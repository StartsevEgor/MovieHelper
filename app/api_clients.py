import os
import requests
import urllib.request
from concurrent.futures import ThreadPoolExecutor, as_completed


def get_universal_proxies():
    # 1. Читаем глобальные сетевые настройки текущей операционной системы
    proxies = urllib.request.getproxies()

    # 2. Если система использует SOCKS, принудительно направляем DNS-запросы в туннель
    if proxies:
        for key, value in proxies.items():
            if value.startswith('socks5://'):
                proxies[key] = value.replace('socks5://', 'socks5h://')
        return proxies

    # 3. Резервный вариант: ищем явное указание в локальном .env
    env_http = os.environ.get('http_proxy') or os.environ.get('HTTP_PROXY')
    env_https = os.environ.get('https_proxy') or os.environ.get('HTTPS_PROXY')

    if env_http or env_https:
        return {"http": env_http, "https": env_https or env_http}

    # 4. Если прокси нигде не задан, возвращаем пустой словарь (прямое подключение)
    return None


def search_kinopoisk(query, proxies):
    url = "https://api.kinopoisk.dev/v1.4/movie/search"
    headers = {
        "accept": "application/json",
        "X-API-KEY": os.environ.get('KINOPOISK_API_KEY')
    }
    params = {"query": query, "limit": 4}

    try:
        response = requests.get(url, headers=headers, params=params, proxies=proxies, timeout=8)
        if response.status_code == 200:
            docs = response.json().get('docs', [])
            results = []
            for movie in docs:
                imdb_id = movie.get('externalId', {}).get('imdb')
                genres = [g.get('name') for g in movie.get('genres', []) if g.get('name')]

                persons = movie.get('persons', [])
                directors = [p.get('name') for p in persons if p.get('enProfession') == 'director' and p.get('name')]
                actors = [p.get('name') for p in persons if p.get('enProfession') == 'actor' and p.get('name')]

                results.append({
                    'title': movie.get('name') or movie.get('alternativeName'),
                    'year': movie.get('year'),
                    'description': movie.get('description'),
                    'poster': movie.get('poster', {}).get('url'),
                    'imdb_id': imdb_id,
                    'genre': genres[0].capitalize() if genres else None,
                    'director': ", ".join(directors[:2]) if directors else None,
                    'actors': ", ".join(actors[:3]) if actors else None,
                    'duration': movie.get('movieLength') or movie.get('seriesLength') or 0,  # Новое поле
                    'source': 'kinopoisk'
                })
            return results
    except Exception as e:
        print(f"Ошибка Кинопоиска: {e}")
    return []


def fetch_tmdb_details(item, api_key, proxies):
    media_type = item.get('media_type')
    if media_type not in ['movie', 'tv']:
        return None

    item_id = item.get('id')
    url = f"https://api.themoviedb.org/3/{media_type}/{item_id}"
    params = {
        "api_key": api_key,
        "language": "ru-RU",
        "append_to_response": "credits,external_ids"
    }

    try:
        res = requests.get(url, params=params, proxies=proxies, timeout=5)
        if res.status_code == 200:
            data = res.json()
            imdb_id = data.get('external_ids', {}).get('imdb_id')
            genres = [g.get('name') for g in data.get('genres', [])]

            cast = data.get('credits', {}).get('cast', [])
            crew = data.get('credits', {}).get('crew', [])

            if media_type == 'movie':
                directors = [c.get('name') for c in crew if c.get('job') == 'Director']
            else:
                directors = [c.get('name') for c in data.get('created_by', [])]

            actors = [c.get('name') for c in cast]
            poster_path = data.get('poster_path')

            date_str = data.get('release_date') or data.get('first_air_date') or ''
            year = int(date_str[:4]) if date_str else None

            # Разбор длительности для TMDB
            duration = 0
            if media_type == 'movie':
                duration = data.get('runtime') or 0
            else:
                ep_run = data.get('episode_run_time')
                duration = ep_run[0] if ep_run else 0

            return {
                'title': data.get('title') or data.get('name'),
                'year': year,
                'description': data.get('overview'),
                'poster': f"https://image.tmdb.org/t/p/w500{poster_path}" if poster_path else None,
                'imdb_id': imdb_id,
                'genre': genres[0].capitalize() if genres else None,
                'director': ", ".join(directors[:2]) if directors else None,
                'actors': ", ".join(actors[:3]) if actors else None,
                'duration': duration,  # Новое поле
                'source': 'tmdb'
            }
    except Exception:
        pass
    return None


def search_tmdb(query, proxies):
    api_key = os.environ.get('TMDB_API_KEY')
    if not api_key or api_key == 'ВАШ_API_КЛЮЧ_ЗДЕСЬ':
        return []

    search_url = "https://api.themoviedb.org/3/search/multi"
    params = {"api_key": api_key, "query": query, "language": "ru-RU"}

    try:
        res = requests.get(search_url, params=params, proxies=proxies, timeout=5)
        if res.status_code == 200:
            results = res.json().get('results', [])[:4]
            parsed_results = []

            with ThreadPoolExecutor(max_workers=4) as exec:
                futures = [exec.submit(fetch_tmdb_details, item, api_key, proxies) for item in results]
                for f in as_completed(futures):
                    data = f.result()
                    if data:
                        parsed_results.append(data)
            return parsed_results
    except Exception as e:
        print(f"Ошибка TMDB: {e}")
    return []


def fetch_movie_data(query):
    # Получаем системные прокси-настройки один раз перед запуском потоков
    sys_proxies = get_universal_proxies()

    with ThreadPoolExecutor(max_workers=2) as executor:
        future_kp = executor.submit(search_kinopoisk, query, sys_proxies)
        future_tmdb = executor.submit(search_tmdb, query, sys_proxies)

        kp_results = future_kp.result() or []
        tmdb_results = future_tmdb.result() or []

    merged_dict = {}

    # 1. Заполняем базу результатами из TMDB
    for item in tmdb_results:
        key = item.get('imdb_id') or f"{item.get('title')}_{item.get('year')}"
        merged_dict[key] = item

    # 2. Добавляем Кинопоиск, сливая данные при совпадении ключа
    for item in kp_results:
        key = item.get('imdb_id') or f"{item.get('title')}_{item.get('year')}"
        if key in merged_dict:
            existing = merged_dict[key]
            existing['description'] = item.get('description') or existing.get('description')
            existing['poster'] = existing.get('poster') or item.get('poster')
            existing['genre'] = existing.get('genre') or item.get('genre')
            existing['director'] = existing.get('director') or item.get('director')
            existing['actors'] = existing.get('actors') or item.get('actors')
            # Забираем длительность из Кинопоиска, если TMDB ее не отдал
            existing['duration'] = existing.get('duration') or item.get('duration') or 0
            existing['source'] = 'merged'
        else:
            merged_dict[key] = item

    print(merged_dict)
    return list(merged_dict.values())