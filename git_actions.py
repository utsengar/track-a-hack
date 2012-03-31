import os
from lib.gitstats import GitDataCollector

"""
>>> pull_project("utkarsh2012", "python-ebay")
"""

def get_data(user_name, project):
    project_dir_path = pull_project(user_name, project)

    if os.path.exists(project_dir_path):
        data = call_gitstats(project_dir_path)
        _rm_rf(project_dir_path)
        return data
    else:
        return "Git repo does not exist!"


def pull_project(user_name, project):
    os.system('git clone https://github.com/' + user_name + '/' + project + '.git')
    project_dir = os.getcwd() + '/' + project
    return project_dir



def call_gitstats(project_folder):
    data_collector = GitDataCollector()
    data_collector.collect(project_folder)
    return data_collector


def _rm_rf(d):
    for path in (os.path.join(d, f) for f in os.listdir(d)):
        if os.path.isdir(path):
            _rm_rf(path)
        else:
            os.unlink(path)
    os.rmdir(d)


def construct_json():
    pass


if __name__ == "__main__":
    get_data("utkarsh2012", "python-ebay")
