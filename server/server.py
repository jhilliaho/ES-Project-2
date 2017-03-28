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
from passlib.hash import pbkdf2_sha256
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
def user_loader(id):

    u = [user for user in api.getUsers() if str(user.id) == str(id)]

    if u:
        u = u[0]
        usr = User()
        usr.id = u.id
        usr.email = u.email
        usr.password = u.password
        return usr

    return


@app.route('/login', methods=['POST', 'GET'])
def login():
    if flask.request.method == 'GET':
        return render_template('login.html')

    email = request.form['email']
    password = request.form['password']

    print("Trying to log in user", email, password)

    users = api.getUsers()

    for i in range(len(users)):
        if users[i].email == email and pbkdf2_sha256.verify(password, users[i].password):

            user = User()
            user.id = users[i].id
            user.email = users[i].email
            user.password = users[i].password

            flask_login.login_user(user)
            return flask.redirect(flask.url_for('index'))

    return flask.redirect(flask.url_for('login'))

@app.route('/register', methods=['POST', 'GET'])
def register():
    if flask.request.method == 'GET':
        print("register")
        return render_template('register.html')
    
    name = request.form['name']
    email = request.form['email']
    password = request.form['password']
    password = pbkdf2_sha256.hash(password)

    api.addUser(name,email,password)
    #notification that user was added
    return flask.redirect(flask.url_for('login'))

@app.route('/logout', methods=['POST', 'GET'])
def logout():
    flask_login.logout_user()
    return flask.redirect(flask.url_for('login'))

# Redirect unauthorized requests to the login page
@login_manager.unauthorized_handler
def unauthorized():
    if flask.request.method == 'GET':
        return flask.redirect(flask.url_for('login'))
    else:
        abort(401)

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

# i dont know if we need these routes...
#@app.route('/api/users', methods=["GET","POST"])
#@flask_login.login_required
#@swag_from('swag/test.yml')
#def users():
#    if flask.request.method == 'GET':
#        users = api.getUsers()
#        res = []
#        for i in range(len(users)):
#            res.append(users[i].name) #no personal data should be shown for other users, so we only return names
#        return jsonify(res)
#    else:
#        #implement addition of a user using api.addUser(name, email, password)
#        #notification that user was added
#        return flask.redirect(flask.url_for('login'))

@app.route('/api/user', methods=["GET","POST"])
@flask_login.login_required
#@swag_from('swag/test.yml')
def user():
    id = flask_login.current_user.id
    if flask.request.method == 'GET':
        return jsonify(api.getUserById(id))
    else:
        name = request.form["name"]
        email = request.form["email"]
        api.updateUserById(id,name,email)        
        return flask.redirect(flask.url_for('index'))


### SONGS ###

# GET /api/song, returns all songs, must be logged in
@app.route('/api/song', methods=["GET"])
@flask_login.login_required
def getAllSongs():
    return jsonify(api.getSongs())

# GET /api/song/id, returns one song, must be logged in
@app.route('/api/song/<song_id>', methods=["GET"])
@flask_login.login_required
def getSong(song_id):
    pass


# TODO: Send files with ajax, not by form
# POST /api/song, adds one song, must be logged in
@app.route('/api/song', methods=["POST"])
@flask_login.login_required
def postSong():
    print("ADD SONG")
    print(request.form)

    fileOk = False

    file = request.files['file']
    if file.filename != '' and file:
        file_extension = file.filename.split('.')[-1]
        #TODO: check file type

        filename = api.addSong(request.form["title"],request.form["artist"],request.form["album"],request.form["year"], flask_login.current_user.id, file_extension)
        file.save(os.path.join("uploads", filename))
        return flask.redirect(flask.url_for('index'))

    print("ERROR")
    return abort(400)




# DELETE /api/song/id, delete one song, must be logged in and the owner of the song
@app.route('/api/song/<song_id>', methods=["DELETE"])
@flask_login.login_required
def deleteSong(song_id):
    api.deleteSong(song_id, flask_login.current_user.id)
    return "ok"


# PUT /api/song/id, update song data, must be logged in and the owner of the song
@app.route('/api/song/<song_id>', methods=["PUT"])
@flask_login.login_required
def updateSong(song_id):
    data = json.loads(request.data)
    api.updateSong(song_id, data["title"],data["artist"],data["album"],data["release_year"],)
    return "ok"







### ROUTING ENDS ###

if __name__ == '__main__':
    app.run(host="localhost", port=3001)


# database connection and schema
# REST API
# Authentication

