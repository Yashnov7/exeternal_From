from website import create_app
import certifi
import os

os.environ['SSL_CERT_FILE'] = certifi.where()


app = create_app()

if __name__ == '__main__':
    app.run(debug=True)
    