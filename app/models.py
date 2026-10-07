from app import db

# Связующая таблица для пользователей и фильмов
users_movies = db.Table('users_movies',
                        db.Column('user_id', db.Integer, db.ForeignKey('user.id'), primary_key=True),
                        db.Column('movie_id', db.Integer, db.ForeignKey('movie.id'), primary_key=True)
                        )

# Связующая таблица для фильмов и жанров
movies_genres = db.Table('movies_genres',
                         db.Column('movie_id', db.Integer, db.ForeignKey('movie.id'), primary_key=True),
                         db.Column('genre_id', db.Integer, db.ForeignKey('genre.id'), primary_key=True)
                         )


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), nullable=False, unique=True)

    # Связь "многие ко многим" с таблицей Movie
    movies = db.relationship('Movie', secondary=users_movies, lazy='subquery',
                             backref=db.backref('users', lazy=True))


class Genre(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False, unique=True)


from app import db

class Movie(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    imdb_id = db.Column(db.String(20), unique=True, nullable=True)
    title = db.Column(db.String(150), nullable=False)
    year = db.Column(db.Integer, nullable=False)
    director = db.Column(db.String(100))
    genre = db.Column(db.String(50))
    actors = db.Column(db.String(255))      # Новое поле
    description = db.Column(db.Text)        # Новое поле
    status = db.Column(db.String(20), default='planned')
    rating = db.Column(db.Integer, default=0)
    poster = db.Column(db.String(500))