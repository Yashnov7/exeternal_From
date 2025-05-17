from flask import Flask
from flask_mongoengine import MongoEngine
from flask_cors import CORS
from flask_login import LoginManager
from dotenv import load_dotenv
import os

db = MongoEngine()
login_manager = LoginManager()

def create_app():
    load_dotenv()

    app = Flask(__name__)

    app.config['MONGODB_HOST'] = os.getenv("MONGODB_HOST")
    app.config['SECRET_KEY'] = os.getenv("SECRET_KEY")
    app.config['FERNET_KEY'] = os.getenv("FERNET_KEY")

    db.init_app(app)
    CORS(app, supports_credentials=True)
    login_manager.init_app(app)
    login_manager.login_view = 'auth.login'

    from .models import User  # Needed for login_manager
    @login_manager.user_loader
    def load_user(user_id):
        return User.objects(id=user_id).first()

    from .views import views
    from .auth import auth
    from .api import api

    app.register_blueprint(views, url_prefix='/')
    app.register_blueprint(auth, url_prefix='/')
    app.register_blueprint(api, url_prefix='/api')

    return app
