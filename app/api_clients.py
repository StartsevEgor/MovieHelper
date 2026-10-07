import os
import requests


def search_kinopoisk(query):
    url = "https://api.kinopoisk.dev/v1.4/movie/search"
    headers = {
        "accept": "application/json",
        "X-API-KEY": os.environ.get('KINOPOISK_API_KEY')
    }
    params = {"query": query, "limit": 1}

    try:
        response = requests.get(url, headers=headers, params=params, timeout=5)
        if response.status_code == 200:
            docs = response.json().get('docs', [])
            if docs:
                movie = docs[0]
                imdb_id = movie.get('externalId', {}).get('imdb')

                # Парсинг жанров (берем первый или склеиваем несколько)
                genres = [g.get('name') for g in movie.get('genres', []) if g.get('name')]

                # Парсинг актеров и режиссеров из массива persons
                persons = movie.get('persons', [])
                directors = [p.get('name') for p in persons if p.get('enProfession') == 'director' and p.get('name')]
                actors = [p.get('name') for p in persons if p.get('enProfession') == 'actor' and p.get('name')]

                return {
                    'title': movie.get('name') or movie.get('alternativeName'),
                    'year': movie.get('year'),
                    'description': movie.get('description'),
                    'poster': movie.get('poster', {}).get('url'),
                    'imdb_id': imdb_id,
                    'genre': genres[0].capitalize() if genres else None,
                    'director': ", ".join(directors[:2]) if directors else None,
                    'actors': ", ".join(actors[:3]) if actors else None,  # Берем топ-3 актера
                    'source': 'kinopoisk'
                }
    except Exception as e:
        print(f"Ошибка Кинопоиска: {e}")

    return None


def search_tmdb(query):
    api_key = os.environ.get('TMDB_API_KEY')
    search_url = "https://api.themoviedb.org/3/search/movie"
    params = {"api_key": api_key, "query": query, "language": "ru-RU", "page": 1}

    try:
        search_response = requests.get(search_url, params=params, timeout=5)
        if search_response.status_code == 200:
            results = search_response.json().get('results', [])
            if results:
                movie = results[0]
                tmdb_id = movie.get('id')

                # Добавляем параметр append_to_response=credits для получения актеров и режиссеров в один запрос
                details_url = f"https://api.themoviedb.org/3/movie/{tmdb_id}"
                details_params = {
                    "api_key": api_key,
                    "language": "ru-RU",
                    "append_to_response": "credits"
                }
                details_response = requests.get(details_url, params=details_params, timeout=5)

                if details_response.status_code == 200:
                    details = details_response.json()
                    imdb_id = details.get('imdb_id')

                    genres = [g.get('name') for g in details.get('genres', [])]

                    # Разбор съемочной группы
                    cast = details.get('credits', {}).get('cast', [])
                    crew = details.get('credits', {}).get('crew', [])

                    directors = [c.get('name') for c in crew if c.get('job') == 'Director']
                    actors = [c.get('name') for c in cast]

                    poster_path = movie.get('poster_path')
                    poster_url = f"https://image.tmdb.org/t/p/w500{poster_path}" if poster_path else None

                    release_date = movie.get('release_date', '')
                    year = int(release_date[:4]) if release_date else None

                    return {
                        'title': movie.get('title'),
                        'year': year,
                        'description': movie.get('overview'),
                        'poster': poster_url,
                        'imdb_id': imdb_id,
                        'genre': genres[0].capitalize() if genres else None,
                        'director': ", ".join(directors[:2]) if directors else None,
                        'actors': ", ".join(actors[:3]) if actors else None,
                        'source': 'tmdb'
                    }
    except Exception as e:
        print(f"Ошибка TMDB: {e}")

    return None


def fetch_movie_data(query):
    result = search_kinopoisk(query)
    if result and result.get('title'):
        return result
    return search_tmdb(query)