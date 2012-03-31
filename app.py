from flask import Flask
from git_actions import get_data

app = Flask(__name__)

@app.route('/')
def index():
    json = get_data()
    return 'Hello World!'

if __name__ == '__main__':
    app.run()
