from flask import Flask, render_template, request
from git_actions import get_data, construct_json

app = Flask(__name__)

@app.route('/')
def index():
    return render_template("index.html")

@app.route('/stats', methods=['POST'])
def get_stats():
    if request.method == 'POST':
        username = request.form['username']
        project = request.form['project']
        data = get_data(username, project)

    if data == "{None}":
        return "Invalid input!"

    return construct_json(data)

if __name__ == '__main__':
    app.run()
