import flask
from flask import Flask
from flask import jsonify
from flask import request
from flask import redirect
from flask import abort
from flask_cors import CORS, cross_origin
from flask import render_template
from flask_restful import Resource, Api
import json
import os
import flask_login
import configuration
import os
import api

template_dir = os.path.abspath('../client/build')
static_dir = os.path.abspath('../client/build/static')

app = Flask(__name__,template_folder=template_dir,static_folder=static_dir)

#Added for faster react development as python api cant be accessed from react when its running own server
CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}}, supports_credentials=True)

### AUTHENTICATION STARTS ###
# https://flask-login.readthedocs.io/en/latest/
# Most useful features of flask-login:
    # flask_login.login_user(user)
    # flask_login.current_user.id
    # flask_login.logout_user()
    # @flask_login.login_required
    # @login_manager.unauthorized_handler

app.secret_key = configuration.secret_key
login_manager = flask_login.LoginManager()
login_manager.init_app(app)

# This MUST be changed to real database
users = [{"id": "aa@aa.aa", "password": "aa@aa.aa"},
         {"id": "bb@bb.bb", "password": "bb@bb.bb"},
         {"id": "cc@cc.cc", "password": "cc@cc.cc"},]

# User class needed for authentication.
class User(flask_login.UserMixin):
    pass

# Needed for authentication.
# This function returns a User object based on the user id
@login_manager.user_loader
def user_loader(id):
    print("User_loader", id)

    usr = [u for u in users if u["id"] == id]

    if not usr:
        return

    usr = usr[0]
    user = User()
    user.id = usr["id"]
    user.password = usr["password"]

    return user


@app.route('/login', methods=['POST', 'GET'])
def login():
    if flask.request.method == 'GET':
        return render_template('login.html')

    id = request.form['email']
    password = request.form['password']

    usr = [u for u in users if u["id"] == id and u["password"] == password]
    if usr:
        usr = usr[0]
        user = User()
        user.id = usr["id"]
        flask_login.login_user(user)
        return flask.redirect(flask.url_for('index'))

    return flask.redirect(flask.url_for('login'))

@app.route('/logout', methods=['POST', 'GET'])
def logout():
    flask_login.logout_user()
    return flask.redirect(flask.url_for('login'))

# Redirect unauthorized requests to the login page
@login_manager.unauthorized_handler
def unauthorized():
    return flask.redirect(flask.url_for('login'))

### AUTHENTICATION ENDS ###

### ROUTING STARTS ###

@app.route('/', methods=["GET"])
@flask_login.login_required
def index():
    return render_template('index.html')


@app.route('/api/test', methods=["GET"])
@flask_login.login_required
def test():
    return api.read()


### ROUTING ENDS ###


if __name__ == '__main__':
    app.run(host="localhost", port=3001)


# database connection and schema
# REST API
# Authentication

