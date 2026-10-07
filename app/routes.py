from flask import Blueprint, render_template, request, jsonify
from app.models import Movie
from app import db

main = Blueprint('main', __name__)


@main.route('/')
def index():
    return render_template('index.html')


@main.route('/api/movies', methods=['GET'])
def get_movies():
    movies = Movie.query.all()
    return jsonify([{
        'id': m.id, 'title': m.title, 'year': m.year,
        'director': m.director, 'genre': m.genre,
        'actors': m.actors, 'description': m.description,
        'status': m.status, 'rating': m.rating, 'poster': m.poster
    } for m in movies])


@main.route('/api/movies', methods=['POST'])
def add_movie():
    data = request.json
    new_movie = Movie(
        title=data['title'], year=data['year'], director=data.get('director'),
        genre=data['genre'], actors=data.get('actors'), description=data.get('description'),
        status=data['status'], rating=data.get('rating', 0), poster=data.get('poster')
    )
    db.session.add(new_movie)
    db.session.commit()
    return jsonify({'success': True})


# Метод для редактирования существующего фильма
@main.route('/api/movies/<int:id>', methods=['PUT'])
def update_movie(id):
    movie = Movie.query.get(id)
    if not movie:
        return jsonify({'error': 'Not found'}), 404

    data = request.json
    movie.title = data['title']
    movie.year = data['year']
    movie.director = data.get('director')
    movie.genre = data['genre']
    movie.actors = data.get('actors')
    movie.description = data.get('description')
    movie.status = data['status']
    movie.rating = data.get('rating', 0)
    movie.poster = data.get('poster')

    db.session.commit()
    return jsonify({'success': True})


@main.route('/api/movies/<int:id>', methods=['DELETE'])
def delete_movie(id):
    movie = Movie.query.get(id)
    if movie:
        db.session.delete(movie)
        db.session.commit()
    return jsonify({'success': True})