from flask import Flask
from views import views

app = Flask(__name__)

# Register views
app.register_blueprint(views, url_prefix="/")

# Only run if this is the main script
if __name__ == '__main__':
    app.run(debug=True, port=8000)
