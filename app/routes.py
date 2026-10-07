from flask import Blueprint, render_template, request, jsonify, session
from app.models import Movie, User
from app.api_clients import fetch_movie_data
from app import db

main = Blueprint('main', __name__)


@main.route('/')
def index():
    return render_template('index.html')


# ==========================================
# АВТОРИЗАЦИЯ И ПРОФИЛЬ
# ==========================================

@main.route('/api/register', methods=['POST'])
def register():
    data = request.json
    username = data.get('username').lower()

    if User.query.filter_by(username=username).first():
        return jsonify({'error': 'Пользователь уже существует'}), 400

    user = User(username=username, display_name=data.get('displayName'))
    user.set_password(data.get('password'))

    db.session.add(user)
    db.session.commit()

    session['user_id'] = user.id
    return jsonify({'success': True, 'username': user.username, 'displayName': user.display_name})


@main.route('/api/login', methods=['POST'])
def login():
    data = request.json
    user = User.query.filter_by(username=data.get('username').lower()).first()

    if not user or not user.check_password(data.get('password')):
        return jsonify({'error': 'Неверный логин или пароль'}), 401

    session['user_id'] = user.id
    return jsonify({'success': True, 'username': user.username, 'displayName': user.display_name})


@main.route('/api/logout', methods=['POST'])
def logout():
    session.pop('user_id', None)
    return jsonify({'success': True})


@main.route('/api/me', methods=['GET'])
def get_me():
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({'error': 'Не авторизован'}), 401

    user = User.query.get(user_id)
    return jsonify({
        'username': user.username,
        'displayName': user.display_name,
        'createdAt': user.created_at.isoformat()
    })


@main.route('/api/profile', methods=['PUT'])
def update_profile():
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({'error': 'Не авторизован'}), 401

    user = User.query.get(user_id)
    user.display_name = request.json.get('displayName')
    db.session.commit()
    return jsonify({'success': True})


# ==========================================
# ПОИСК И КАТАЛОГ ФИЛЬМОВ
# ==========================================

@main.route('/api/search', methods=['GET'])
def search_external():
    query = request.args.get('q')
    if not query:
        return jsonify({'error': 'Пустой запрос'}), 400

    data = fetch_movie_data(query)
    if data:
        return jsonify(data)

    return jsonify({'error': 'Ничего не найдено'}), 404


@main.route('/api/movies', methods=['GET'])
def get_movies():
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({'error': 'Не авторизован'}), 401

    movies = Movie.query.filter_by(user_id=user_id).all()
    return jsonify([{
        'id': m.id, 'type': m.type, 'title': m.title, 'year': m.year,
        'director': m.director, 'genre': m.genre, 'actors': m.actors,
        'poster': m.poster, 'description': m.description, 'duration': m.duration,
        'tags': m.get_tags(), 'status': m.status, 'rating': m.rating,
        'review': m.review, 'seasons': m.seasons, 'episodes': m.episodes,
        'watchedEpisodes': m.watched_episodes
    } for m in movies])


@main.route('/api/movies', methods=['POST'])
def add_movie():
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({'error': 'Не авторизован'}), 401

    data = request.json
    new_movie = Movie(
        user_id=user_id, type=data.get('type', 'movie'), title=data['title'],
        year=data['year'], director=data.get('director'), genre=data.get('genre'),
        actors=data.get('actors'), poster=data.get('poster'), description=data.get('description'),
        duration=data.get('duration', 0), status=data.get('status', 'planned'),
        rating=data.get('rating', 0), review=data.get('review'),
        seasons=data.get('seasons', 1), episodes=data.get('episodes', 1),
        watched_episodes=data.get('watchedEpisodes', 0)
    )
    new_movie.set_tags(data.get('tags', []))

    db.session.add(new_movie)
    db.session.commit()
    return jsonify({'success': True})


@main.route('/api/movies/<int:id>', methods=['PUT'])
def update_movie(id):
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({'error': 'Не авторизован'}), 401

    movie = Movie.query.filter_by(id=id, user_id=user_id).first()
    if not movie:
        return jsonify({'error': 'Not found'}), 404

    data = request.json
    movie.type = data.get('type', movie.type)
    movie.title = data['title']
    movie.year = data['year']
    movie.director = data.get('director')
    movie.genre = data.get('genre')
    movie.actors = data.get('actors')
    movie.poster = data.get('poster')
    movie.description = data.get('description')
    movie.duration = data.get('duration', 0)
    movie.set_tags(data.get('tags', []))
    movie.status = data.get('status', 'planned')
    movie.rating = data.get('rating', 0)
    movie.review = data.get('review')
    movie.seasons = data.get('seasons', 1)
    movie.episodes = data.get('episodes', 1)
    movie.watched_episodes = data.get('watchedEpisodes', 0)

    db.session.commit()
    return jsonify({'success': True})


@main.route('/api/movies/<int:id>', methods=['DELETE'])
def delete_movie(id):
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({'error': 'Не авторизован'}), 401

    movie = Movie.query.filter_by(id=id, user_id=user_id).first()
    if movie:
        db.session.delete(movie)
        db.session.commit()
    return jsonify({'success': True})