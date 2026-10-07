import os
from dotenv import load_dotenv

# Определение абсолютного пути к директории проекта
basedir = os.path.abspath(os.path.dirname(__file__))
load_dotenv(os.path.join(basedir, '.env'))


class Config:
    # Ключ для подписи cookies и сессий
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'dev-key-default'

    # Путь к локальной базе данных SQLite в папке instance
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or \
                              'sqlite:///' + os.path.join(basedir, 'instance', 'cinemate.db')

    SQLALCHEMY_TRACK_MODIFICATIONS = False