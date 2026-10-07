import json
from app import db
from werkzeug.security import generate_password_hash, check_password_hash


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), nullable=False, unique=True)
    display_name = db.Column(db.String(50), nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, server_default=db.func.now())

    # Связь 1 ко многим: при удалении пользователя удалятся и все его фильмы
    movies = db.relationship('Movie', backref='owner', lazy=True, cascade="all, delete-orphan")

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)


class Movie(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

    type = db.Column(db.String(20), default='movie')
    title = db.Column(db.String(150), nullable=False)
    year = db.Column(db.Integer)
    director = db.Column(db.String(100))
    genre = db.Column(db.String(100))
    actors = db.Column(db.String(255))
    poster = db.Column(db.String(500))
    description = db.Column(db.Text)
    duration = db.Column(db.Integer, default=0)

    # Теги хранятся в виде текстовой JSON-строки (сериализация массива)
    tags = db.Column(db.Text, default='[]')
    status = db.Column(db.String(20), default='planned')
    rating = db.Column(db.Integer, default=0)
    review = db.Column(db.Text)

    seasons = db.Column(db.Integer, default=1)
    episodes = db.Column(db.Integer, default=1)
    watched_episodes = db.Column(db.Integer, default=0)

    # Вспомогательные методы для работы с тегами
    def get_tags(self):
        return json.loads(self.tags) if self.tags else []

    def set_tags(self, tags_list):
        self.tags = json.dumps(tags_list)