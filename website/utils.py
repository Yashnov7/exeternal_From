from cryptography.fernet import Fernet
from flask import current_app

def encrypt_value(value: str) -> str:
    key = current_app.config['FERNET_KEY']
    fernet = Fernet(key.encode())
    return fernet.encrypt(value.encode()).decode()

def decrypt_value(value: str) -> str:
    key = current_app.config['FERNET_KEY']
    fernet = Fernet(key.encode())
    return fernet.decrypt(value.encode()).decode()
