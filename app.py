from flask import Flask, render_template
from git_actions import get_data

app = Flask(__name__)

@app.route('/')
def index():
    return render_template("index.html")

@app.route('/stats')
def get_stats():
    json = get_data("userename", "project name")
    return  "{count:10}"



if __name__ == '__main__':
    app.run()
