import flask
from flask import Flask
from flask import Response
from flask import jsonify
from flask import request
from flask import redirect
from flask import make_response
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
from functools import partial
from subprocess import Popen, PIPE
import sys
from werkzeug.exceptions import HTTPException

# RUN SEED ON EVERY LAUNCH
#import db_seed

### LOGGING STARTS ###

import logging
logging.basicConfig(filename='flask.log',level=logging.DEBUG)

root = logging.getLogger()
root.setLevel(logging.DEBUG)

ch = logging.StreamHandler(sys.stdout)
ch.setLevel(logging.DEBUG)
formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
ch.setFormatter(formatter)
root.addHandler(ch)

logging.debug('Starting the application')

### LOGGING ENDS ###

### FILE PATHS START ###

PATH, tail = os.path.split(os.path.dirname(os.path.realpath(__file__)))

MUSIC_PATH = os.path.join(PATH, 'server/uploads')

if not os.path.exists(MUSIC_PATH):
    logging.debug("Creating the music folder")
    os.makedirs(MUSIC_PATH)
    logging.debug("Set folder permissions")
    os.chmod(MUSIC_PATH, 0o700)

deploy = False

if deploy:
    logging.debug('MODE: Deploy')
    template_dir = os.path.join(PATH, 'server/templates')
    static_dir = os.path.join(PATH, 'server/static')
else:
    logging.debug('MODE: Develop')
    template_dir = os.path.join(PATH, 'client/build')
    static_dir = os.path.join(PATH, 'client/build/static')

logging.debug("Music folder: " + MUSIC_PATH)
logging.debug('Templates: ' + template_dir)
logging.debug('Static: ' + static_dir)


### FILE PATHS ENDS ###


app = Flask(__name__,template_folder=template_dir,static_folder=static_dir)
Swagger(app)

# This should be needed only for developing locally
if not deploy:
    CORS(app, supports_credentials=True)

application = app

@app.errorhandler(Exception)
def handle_error(e):
    code = 500
    logging.debug(e)
    if isinstance(e, HTTPException):
        code = e.code
        logging.debug(code)
    return jsonify(error=str(e)), code

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
    logging.debug('User loader: loading user ' + str(id))

    u = [user for user in api.getUsers() if str(user.id) == str(id)]

    if u:
        u = u[0]
        usr = User()
        usr.id = u.id
        usr.email = u.email
        usr.password = u.password
        return usr

    return

@app.route('/login', methods=['GET'])
@swag_from('swag/loginGet.yml')
def login():
    logging.debug('GET login')
    return render_template('login.html')

@app.route('/login', methods=['POST'])
@swag_from('swag/loginPost.yml')
def loginUser():
    email = request.form['email']
    password = request.form['password']

    logging.debug('POST login with ' + str(email) + " : " +  str(password))

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


@app.route('/register', methods=['GET'])
@swag_from('swag/registerGet.yml')
def register():
    logging.debug('GET register')
    return render_template('register.html')



@app.route('/register', methods=['POST'])
@swag_from('swag/registerPost.yml')
def registerUser():
    name = request.form['name']
    email = request.form['email']
    password = request.form['password']

    logging.debug('POST register with ', str(name), str(email), str(password))

    password = pbkdf2_sha256.hash(password)

    api.addUser(name,email,password)
    #notification that user was added
    return flask.redirect(flask.url_for('login'))

@app.route('/logout', methods=['POST', 'GET'])
@swag_from('swag/logout.yml')
def logout():
    logging.debug('Logout')

    flask_login.logout_user()
    return flask.redirect(flask.url_for('login'))

# Redirect unauthorized requests to the login page
@login_manager.unauthorized_handler
def unauthorized():
    logging.debug('Unauthorized')

    if flask.request.method == 'GET':
        return flask.redirect(flask.url_for('login'))
    else:
        abort(401)

### AUTHENTICATION ENDS ###

### ROUTING STARTS ###

@app.route('/', methods=["GET"])
@flask_login.login_required
@swag_from('swag/index.yml')
def index():
    logging.debug('GET index')

    return render_template('index.html')

@app.route("/api/spec")
def spec():
    logging.debug('GET api/spec')

    return jsonify(swagger(app))



### API ###

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

@app.route('/api/user', endpoint='user', methods=["GET","POST","DELETE"])
@flask_login.login_required
@swag_from('swag/userGet.yml', endpoint='user', methods=['GET'])
@swag_from('swag/userPost.yml', endpoint='user', methods=['POST'])
@swag_from('swag/userDelete.yml', endpoint='user', methods=['DELETE'])
def user():
    id = flask_login.current_user.id
    if flask.request.method == 'GET':
        logging.debug('GET api/user')
        return jsonify(api.getUserById(id))
    elif flask.request.method == 'POST':
        logging.debug('POST api/user')
        print("post")
        name = request.form["name"]
        email = request.form["email"]
        api.updateUserById(id,name,email)
        return flask.redirect(flask.url_for('index'))
    else:
        logging.debug('DELETE api/user')
        print("delete")
        api.deleteUser(id)
        flask_login.logout_user()
        return "ok"



### SONGS ###

# GET /api/song, returns all songs, must be logged in
@app.route('/api/song', methods=["GET"])
@flask_login.login_required
@swag_from('swag/songGet.yml')
def getAllSongs():
    logging.debug('GET api/song')
    return jsonify(api.getSongs())

# TODO: Send files with ajax, not by form
# POST /api/song, adds one song, must be logged in
@app.route('/api/song', methods=["POST"])
@flask_login.login_required
@swag_from('swag/songPost.yml')
def postSong():
    logging.debug('POST api/song')
    print("ADD SONG")
    print(request.form)
    logging.debug(request.form)

    fileOk = False

    file = request.files['file']
    logging.debug(file)

    if file.filename != '' and file:
        file_extension = file.filename.split('.')[-1]
        #TODO: check file type
        logging.debug(file_extension)

        filename = api.addSong(request.form["title"],request.form["artist"],request.form["album"],request.form["year"], flask_login.current_user.id, file_extension)
        logging.debug(filename)

        try:
            file.save(os.path.join(MUSIC_PATH, filename))
        except Exception as e:
            logging.debug("Saving unsuccessful", type(e).__name__)

        logging.debug("File saved")

        return flask.redirect(flask.url_for('index'))

    print("ERROR")
    return abort(400)


# DELETE /api/song/id, delete one song, must be logged in and the owner of the song
@app.route('/api/song/<song_id>', methods=["DELETE"])
@flask_login.login_required
@swag_from('swag/songWithIdDelete.yml')
def deleteSong(song_id):
    logging.debug('DELETE api/song')
    api.deleteSong(song_id, flask_login.current_user.id)
    return "ok"

# PUT /api/song/id, update song data, must be logged in and the owner of the song
@app.route('/api/song/<song_id>', methods=["PUT"])
@flask_login.login_required
@swag_from('swag/songWithIdPut.yml')
def updateSong(song_id):
    logging.debug('PUT api/song')
    data = request.json
    api.updateSong(song_id, data["title"],data["artist"],data["album"],data["release_year"],)
    return "ok"

### PLAYLISTS ###

# GET /api/playlist, returns all playlists of the user, must be logged in
@app.route('/api/playlist', methods=["GET"])
@flask_login.login_required
@swag_from('swag/playlistGet.yml')
def getAllPlaylists():
    logging.debug('GET api/playlist')
    return jsonify(api.getPlaylists(flask_login.current_user.id))

# POST /api/playlist, adds one playlist, must be logged in
@app.route('/api/playlist', methods=["POST"])
@flask_login.login_required
@swag_from('swag/playlistPost.yml')
def postPlaylist():
    logging.debug('POST api/playlist')
    logging.debug(request.json)

    data = request.json
    logging.debug(data)

    api.addPlaylist(flask_login.current_user.id, data["name"])

    return "ok"

# DELETE /api/playlist/id, delete one playlist, must be logged in and the owner of the playlist
@app.route('/api/playlist/<playlist_id>', methods=["DELETE"])
@flask_login.login_required
@swag_from('swag/playlistWithIdDelete.yml')
def deletePlaylist(playlist_id):
    logging.debug('DELETE api/playlist/id')
    api.deletePlaylist(playlist_id, flask_login.current_user.id)
    return "ok"

# PUT /api/playlist/id, update playlist data, must be logged in and the owner of the playlist
@app.route('/api/playlist/<playlist_id>', methods=["PUT"])
@flask_login.login_required
@swag_from('swag/playlistWithIdPut.yml')
def updatePlaylist(playlist_id):
    logging.debug('PUT api/playlist/id')
    data = request.json
    logging.debug(data)
    api.updatePlaylist(playlist_id, data["name"])
    return "ok"



# POST /api/playlist/<playlist_id>/songs/<song_id>, add song to playlist, must be logged in and the owner of the playlist
@app.route('/api/playlist/<playlist_id>/songs/<song_id>', methods=["POST"])
@flask_login.login_required
@swag_from('swag/playlistWithSongPost.yml')
def addSongToPlaylist(playlist_id, song_id):
    logging.debug('POST /api/playlist/<playlist_id>/songs/<song_id>')
    api.addSongToPlaylist(song_id, playlist_id)
    return "ok"

# DELETE /api/playlist/<playlist_id>/songs/<song_id>, remove song from playlist, must be logged in and the owner of the playlist
@app.route('/api/playlist/<playlist_id>/songs/<song_id>', methods=["DELETE"])
@flask_login.login_required
@swag_from('swag/playlistWithSongDelete.yml')
def removeSongFromPlaylist(playlist_id, song_id):
    logging.debug('DELETE /api/playlist/<playlist_id>/songs/<song_id>')
    print("\n\nREMOVE SONG FROM PLAYLIST", playlist_id, song_id, "\n\n")
    api.removeSongFromPlaylist(song_id, playlist_id)
    return "ok"




# FOR PLAYING MUSIC
@app.route('/api/play/<song_id>', methods=["GET"])
@flask_login.login_required
@swag_from('swag/play.yml')
def stream(song_id):
    logging.debug('GET /api/play/<song_id>')
    filename = api.getSongPath(song_id)
    process = Popen(['cat', os.path.join(MUSIC_PATH,filename)], stdout=PIPE, bufsize=-1)
    read_chunk = partial(os.read, process.stdout.fileno(), 1024)
    return Response(iter(read_chunk, b''), mimetype='audio/mp3')

### ROUTING ENDS ###

if __name__ == '__main__':
    if deploy:
        application.debug = True
        application.run()
    else:
        application.debug = True
        application.run(host="localhost", port=5000)

