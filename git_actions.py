import os
import datetime
import json
from pprint import pprint
from lib.gitstats import GitDataCollector


class GitStatsEncoder(json.JSONEncoder):
    """Encoder for dealing with some attributes in git data collector object."""
    def default(self, obj):
        if isinstance(obj, datetime.timedelta):
            return str(obj) # just make something up
        if isinstance(obj, set):
            return sorted(list(obj)) # sorted list, instead of set
        return json.JSONEncoder.default(self, obj)


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
    curdir = os.path.abspath(os.curdir)
    os.chdir(project_folder)
    data_collector = GitDataCollector()
    data_collector.collect(project_folder)
    os.chdir(curdir)
    return data_collector


def _rm_rf(d):
    for path in (os.path.join(d, f) for f in os.listdir(d)):
        if os.path.isdir(path):
            _rm_rf(path)
        else:
            os.unlink(path)
    os.rmdir(d)

def we_want_this_attribute(obj, attr_name):
    """Decides if we want this attribute in the returned json.

    We don't want it, if it starts with _, get or is a method or any callable of the obj.
    Implementation is ad hoc, and so is the name.
    """
    # print attr_name, attr_name.startswith("_"), attr_name.startswith("get"), callable(attr_name)
    if attr_name.startswith("_") or attr_name.startswith("get") or callable(getattr(obj, attr_name)):
        return False
    else:
        return True

def construct_json(data_collector):
    attributes = [each for each in dir(data_collector) if we_want_this_attribute(data_collector, each)]
    d = {}
    for each in attributes:
        try:
            y = getattr(data_collector, each)
            d.update({each: y})
        except:
            pass
    return json.loads(json.dumps(d, cls=GitStatsEncoder, sort_keys=True, indent=4))

if __name__ == "__main__":
    data = get_data("utkarsh2012", "python-ebay")
    pprint(construct_json(data))
