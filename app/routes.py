from flask import Blueprint, render_template, request, redirect, url_for
from app.models import Movie
from app import db

# Создаем объект Blueprint для группировки маршрутов
main = Blueprint('main', __name__)


# Маршрут для главной страницы
@main.route('/')
def index():
    # Получаем все фильмы из базы данных
    movies = Movie.query.all()
    # Возвращаем HTML-шаблон, передавая в него список фильмов
    return render_template('index.html', movies=movies)


# Маршрут для обработки формы добавления фильма
@main.route('/add', methods=['POST'])
def add_movie():
    movie_title = request.form.get('title')

    if movie_title:
        new_movie = Movie(title=movie_title, content_type='Фильм')
        db.session.add(new_movie)
        db.session.commit()

    # После добавления перенаправляем пользователя обратно на главную страницу
    return redirect(url_for('main.index'))