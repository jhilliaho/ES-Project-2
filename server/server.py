import flask
from flask import Flask
from flask import jsonify
from flask import request
from flask import redirect
from flask import abort
from flask_cors import CORS, cross_origin
from flask import render_template
from flask_restful import Resource, Api
from flasgger import Swagger
from flasgger.utils import swag_from
import json
import os
import flask_login
import configuration
import os
import api

template_dir = os.path.abspath('../client/build')
static_dir = os.path.abspath('../client/build/static')

app = Flask(__name__,template_folder=template_dir,static_folder=static_dir)
Swagger(app)

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

# User class needed for authentication.
class User(flask_login.UserMixin):
    pass

# Needed for authentication.
# This function returns a User object based on the user id
@login_manager.user_loader
def user_loader(email):
    print("User_loader", email)

    users = api.getUsers()

    for i in range(len(users)):
        if(email==users[i].email):
            user = User()
            user.id = users[i].email
            user.password = users[i].password

            return user

    return


@app.route('/login', methods=['POST', 'GET'])
def login():
    if flask.request.method == 'GET':
        return render_template('login.html')

    email = request.form['email']
    password = request.form['password']

    users = api.getUsers()

    for i in range(len(users)):
        if users[i].email == email and users[i].password == password:
            user = User()
            user.id = users[i].email
            user.password = users[i].password

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

@app.route("/api/spec")
def spec():
    return jsonify(swagger(app))

### API ###

@app.route('/api/test', methods=["GET"])
@flask_login.login_required
@swag_from('swag/test.yml')
def test():
    return api.read()

@app.route('/api/users', methods=["GET","POST"])
@flask_login.login_required
#@swag_from('swag/test.yml')
def users():
    if flask.request.method == 'GET':
        users = api.getUsers()

        res = []
        for i in range(len(users)):
            res.append(users[i].getJson)

        return jsonify(res)
    else:
        user ={"email":"aa@aa.aa", "name": "User aa", "password":"aa@aa.aa"}
        api.addUser(user)
        #notification that user was added
        return flask.redirect(flask.url_for('login'))

@app.route('/api/user', methods=["GET","POST"])
@flask_login.login_required
#@swag_from('swag/test.yml')
def user():
    email = flask_login.current_user.id
    if flask.request.method == 'GET':
        user = api.getUserById(email)
        return jsonify(user.getJson)
    else:
        user ={"email":"aa@aa.aa", "name": "User aa", "password":"aa@aa.aa"}
        api.updateUserById(id)
        return flask.redirect(flask.url_for('login'))

### ROUTING ENDS ###


if __name__ == '__main__':
    app.run(host="localhost", port=3001)


# database connection and schema
# REST API
# Authentication

