from schema import *
from flask import jsonify
from passlib.hash import pbkdf2_sha256
import json
import os
import configuration

import logging
logging.basicConfig(filename='flask.log',level=logging.DEBUG)

### USER ###

# Return all users. No errors if database is working
def getUsers():
    logging.debug('api.getUsers()')
    session = Session()
    users = session.query(User).all()

    session.close()
    return users

# Add user. No errors if database is working
def addUser(name,email,password):
    logging.debug('api.addUser' + " " + name + " " + email + " " + password)
    session = Session()
    
    user = User(email=email, name=name, password=password)

    session.add(user)
    session.commit()
    session.close()
    return "OK"

def deleteUser(id):
    logging.debug('api.deleteUser' + " " + str(id))
    session = Session()

    user = session.query(User).filter(User.id==id).first()

    for song in session.query(Song).filter(Song.user_id == id).all():
        try:
            os.remove(os.path.join(os.path.abspath('./uploads'), song.path))
        except Exception as e:
            logging.debug("Deleting user unsuccessful" + " " + type(e).__name__)

    session.delete(user)
    session.commit()
    session.close()
    return "OK"

def getUserById(id):
    logging.debug('api.getUserById' + str(id))
    session = Session()
    user = session.query(User).filter(User.id==id).first()

    session.close()

    fields = ["id", "email", "name"]
    return user.getJsonSelectively(fields)

def updateUserById(id,name,email):
    logging.debug('api.updateUserById' + " " + str(id) + " " + name + " " + email)
    session = Session()

    user = session.query(User).filter(User.id==id).first()
    if(name):
        user.name = name
    if(email):
        user.email = email

    session.commit()
    session.close()
    return "OK"


### SONG ###

def getSongs():
    logging.debug('api.getSongs')
    session = Session()

    arr = []
    fields = ["id", "title", "artist", "album", "release_year", "path", "user_id", "deleted"]
    for song in session.query(Song).all(): arr.append(song.getJsonSelectively(fields))
    session.close()
    return arr

def getSongPath(song_id):
    logging.debug('api.getSongPath ' + str(song_id))
    session = Session()
    song = session.query(Song).filter(Song.id==song_id).first()
    if not song:
        logging.debug("Song not found")
        session.close()
        return "NOT_FOUND"

    session.close()
    return song.path

#mode can be "full" or "partial"
def deleteSong(song_id, user_id, mode):
    logging.debug('api.deleteSong' + " " + str(song_id) + " " + str(user_id) + " " + str(mode))
    session = Session()
    song = session.query(Song).filter(Song.id==song_id).first()

    if not song:
        logging.debug("Song not found")
        session.close()
        return "NOT_FOUND"

    if song.user_id  != user_id:
        session.close()
        logging.debug("Unauthorized")
        return "UNAUTHORIZED"

    if mode == "full":
        session.delete(song)
    else:
        song.deleted = True

    session.commit()
    session.close()
    return "OK"

def addSong(title, artist, album, year, user_id, file_extension):
    logging.debug('api.addSong' + " " + title + " " + artist + " " + album + " " + str(year) + " " + str(user_id) + " " + file_extension)
    session = Session()

    # Check user song amount:
    user_song_amount = len(session.query(Song).filter(Song.user_id == user_id).all())
    if user_song_amount > configuration.user_max_file_count:
        logging.debug("Song limit reached. " + str(user_song_amount) + " >= " + str(configuration.user_max_file_count))
        return "LIMIT_REACHED"

    song = Song(title=title, artist=artist, album=album, release_year=year, user_id=user_id)
    session.add(song)
    session.commit()
    id = song.id

    song = session.query(Song).filter(Song.id==id).first()
    song.path = str(song.id) + '-' + song.artist + '-' + song.title
    song.path = ''.join(e for e in song.path if e.isalnum()).lower() + '.' + file_extension

    path = song.path
    session.commit()

    session.close()
    logging.debug('Saving file with name' + " " + path)

    return path

def updateSong(user_id, id, title, artist, album, release_year):
    logging.debug('api.updateSong ' + " " + str(id) + " " + title + " " + artist + " " + album + " " + str(release_year))
    session = Session()
    song = session.query(Song).filter(Song.id==id).first()

    if not song:
        logging.debug("Song not found")
        session.close()
        return "NOT_FOUND"

    if song.user_id  != user_id:
        session.close()
        logging.debug("Unauthorized")
        return "UNAUTHORIZED"

    song.title = title
    song.artist = artist
    song.album = album
    song.release_year = release_year

    session.commit()
    session.close()
    return "OK"

### PLAYLIST ###

def getPlaylists(user_id):
    logging.debug('api.getPlaylists ' + str(user_id))
    session = Session()
    arr = []
    fields = [
        "id",
        "name",
        "creation_date",
        {
            "name":"songs",
            "fields": [
                "id",
                "title",
                "artist",
                "album",
                "release_year",
                "creation_date"
            ]
        }
    ]

    for playlist in session.query(Playlist).filter(Playlist.user_id == user_id): arr.append(playlist.getJsonSelectively(fields))
    session.close()
    return arr

def addPlaylist(user_id, name):
    logging.debug('api.addPlaylist' + " " + str(user_id) + " " + str(name))
    session = Session()
    playlist = Playlist(name=name, user_id=user_id)
    session.add(playlist)
    session.commit()
    session.close()
    return "OK"

def deletePlaylist(user_id, playlist_id):
    logging.debug('api.deletePlaylist' + " " + str(playlist_id) + " " + str(user_id))
    session = Session()
    playlist = session.query(Playlist).filter(Playlist.id == playlist_id).first()

    if not playlist:
        logging.debug("Playlist not found")
        session.close()
        return "NOT_FOUND"

    if playlist.user_id  != user_id:
        session.close()
        logging.debug("Unauthorized")
        return "UNAUTHORIZED"

    session.delete(playlist)
    session.commit()
    session.close()
    return "OK"

def updatePlaylist(user_id, id, name):
    logging.debug('api.updatePlaylist' + " " + str(id) + " " + name)
    session = Session()
    playlist = session.query(Playlist).filter(Playlist.id==id).first()

    if not playlist:
        logging.debug("Playlist not found")
        session.close()
        return "NOT_FOUND"

    if playlist.user_id  != user_id:
        session.close()
        logging.debug("Unauthorized")
        return "UNAUTHORIZED"

    playlist.name = name
    session.commit()
    session.close()
    return "OK"

def addSongToPlaylist(user_id, song_id, playlist_id):
    logging.debug('api.addSongToPlaylist' + " " + str(song_id) + " " + str(playlist_id))
    session = Session()
    playlist = session.query(Playlist).filter(Playlist.id==playlist_id).first()

    if not playlist:
        logging.debug("Playlist not found")
        session.close()
        return "NOT_FOUND"

    if playlist.user_id  != user_id:
        session.close()
        logging.debug("Unauthorized")
        return "UNAUTHORIZED"

    song = session.query(Song).filter(Song.id==song_id).first()

    if not song:
        logging.debug("Song not found")
        session.close()
        return "NOT_FOUND"

    if(not song in playlist.songs):
        playlist.songs.append(song)

    session.commit()
    session.close()
    return "OK"

def removeSongFromPlaylist(user_id, song_id, playlist_id):
    logging.debug('api.removeSongFromPlaylist' + " " + str(song_id) + " " + str(playlist_id))
    session = Session()
    playlist = session.query(Playlist).filter(Playlist.id==playlist_id and Playlist-user_id == user_id).first()

    if not playlist:
        logging.debug("Playlist not found")
        session.close()
        return "NOT_FOUND"

    if playlist.user_id  != user_id:
        session.close()
        logging.debug("Unauthorized")
        return "UNAUTHORIZED"

    if not [song for song in playlist.songs if str(song.id) == str(song_id)]:
        logging.debug("Song not found")
        session.close()
        return "NOT_FOUND"

    playlist.songs = [song for song in playlist.songs if str(song.id) != str(song_id)]

    session.commit()
    session.close()
    return "OK"
