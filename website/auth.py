from flask import Blueprint, render_template, request, flash, redirect, url_for
from flask_login import login_user, logout_user, login_required, current_user
from .models import User  # your mongoengine User model
from werkzeug.security import generate_password_hash, check_password_hash

auth = Blueprint('auth', __name__)

@auth.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        email = request.form.get('email')
        password = request.form.get('password')
        user = User.objects(email=email).first()

        if user and check_password_hash(user.password, password):
            login_user(user)
            flash('Logged in successfully!', category='success')
            return redirect('http://localhost:3000/form')  # Redirect to React
        else:
            flash('Invalid email or password', category='error')

    return render_template('login_signup_template.html')


@auth.route('/sign-up', methods=['GET', 'POST'])
def sign_up():
    if request.method == 'POST':
        name = request.form.get('name')
        email = request.form.get('email')
        password = request.form.get('password')

        if User.objects(email=email).first():
            flash('Email already registered.', category='error')
        else:
            hashed_pw = generate_password_hash(password, method='pbkdf2:sha256')
            new_user = User(email=email, password=hashed_pw)
            new_user.save()
            flash('Account created successfully!', category='success')
            return redirect(url_for('auth.login'))

    return render_template('login_signup_template.html')


@auth.route('/logout')
@login_required
def logout():
    logout_user()
    flash('You have been logged out.', category='success')
    return redirect(url_for('auth.login'))
