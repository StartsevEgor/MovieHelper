from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from config import Config

# Глобальный объект БД
db = SQLAlchemy()


def create_app(config_class=Config):
    app = Flask(__name__)

    # Загрузка параметров из config.py
    app.config.from_object(config_class)

    # Привязка расширений к приложению
    db.init_app(app)

    # Регистрация маршрутов и моделей в контексте приложения
    with app.app_context():
        from app import routes, models
        from app.routes import main

        # Регистрация маршрутов
        app.register_blueprint(main)
        print(app.config['SQLALCHEMY_DATABASE_URI'])
        db.create_all()

    return app