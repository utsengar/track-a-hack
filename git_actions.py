import os
from lib.gitstats import GitDataCollector

"""

>>> pull_project("utkarsh2012", "python-ebay")

"""

def pull_project(user_name, project):
    os.system('git clone https://github.com/' + user_name + '/' + project + '.git')
    project_dir = os.getcwd() + '/' + project
    print project_dir

    if os.path.exists(project_dir):
        call_gitstats(project_dir)
    else:
        return "Git repo does not exist!"


def call_gitstats(project_folder):
    data_collector = GitDataCollector()
    data = data_collector.collect(project_folder)
    _rm_rf(project_folder)
    return data


def _rm_rf(d):
    for path in (os.path.join(d, f) for f in os.listdir(d)):
        if os.path.isdir(path):
            _rm_rf(path)
        else:
            os.unlink(path)
    os.rmdir(d)


if __name__ == "__main__":
   pull_project("utkarsh2012", "python-ebay")
