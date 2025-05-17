from flask import Blueprint, session, redirect, url_for

views = Blueprint('views', __name__)

@views.route('/')
def home():
    if 'user' not in session:
        return redirect(url_for('auth.login'))
    return f"Welcome, {session['user']}! <a href='/logout'>Logout</a>"
