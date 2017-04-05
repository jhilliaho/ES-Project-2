from schema import *
from flask import jsonify
from passlib.hash import pbkdf2_sha256
import json
import os

import logging
logging.basicConfig(filename='flask.log',level=logging.DEBUG)

### USER ###
def getUsers():
    logging.debug('api.getUsers()')
    session = Session()
    users = session.query(User).all()

    session.close()
    return users

def addUser(name,email,password):
    logging.debug('api.addUser' + " " + name + " " + email + " " + password)
    session = Session()
    
    user = User(email=email, name=name, password=password)

    session.add(user)
    session.commit()
    session.close()

def deleteUser(id):
    logging.debug('api.deleteUser' + " " + id)
    session = Session()

    user = session.query(User).filter(User.id==id).first()
    songs = session.query(Song).filter(Playlist.user_id == id).all()
    
    #songs = []
    fields = ["id", "title", "artist", "album", "release_year", "path", "user_id"]
    for song in session.query(Song).filter(Song.user_id == id).all(): 
        logging.debug('delete song:', song)
        try:
            os.remove(os.path.join(os.path.abspath('./uploads'), song.path))
        except Exception as e:
            logging.debug("Saving unsuccessful" + " " + type(e).__name__)

    session.delete(user)

    session.commit()
    session.close()

def getUserById(id):
    logging.debug('api.getUserById' + str(id))
    session = Session()
    user = session.query(User).filter(User.id==id).first()

    session.close()

    fields = ["id", "email", "name"]
    return user.getJsonSelectively(fields)

def updateUserById(id,name,email):
    logging.debug('api.updateUserById' + " " + id + " " + name + " " + email)
    session = Session()

    user = session.query(User).filter(User.id==id).first()
    if(name):
        user.name = name
    if(email):
        user.email = email

    session.commit()
    session.close()


### SONG ###

def getSongs():
    logging.debug('api.getSongs')
    session = Session()

    arr = []
    fields = ["id", "title", "artist", "album", "release_year", "path", "user_id"]
    for song in session.query(Song).all(): arr.append(song.getJsonSelectively(fields))
    session.close()
    return arr

def getSongPath(song_id):
    logging.debug('api.getSongPath ' + str(song_id))
    session = Session()
    song = session.query(Song).filter(Song.id==song_id).first()
    session.close()
    return song.path

def deleteSong(song_id, user_id):
    logging.debug('api.deleteSong' + " " + song_id + " " + user_id)
    session = Session()
    song = session.query(Song).filter(Song.id==song_id and Song.user_id==user_id).first()
    session.delete(song)
    session.commit()
    session.close()
    return

def addSong(title, artist, album, year, user_id, file_extension):
    logging.debug('api.addSong' + " " + title + " " + artist + " " + album + " " + year + " " + user_id + " " + file_extension)
    session = Session()
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

def updateSong(id, title, artist, album, release_year):
    logging.debug('api.updateSong ' + " " + id + " " + title + " " + artist + " " + album + " " + release_year)
    session = Session()
    song = session.query(Song).filter(Song.id==id).first()
    song.title = title
    song.artist = artist
    song.album = album
    song.release_year = release_year
    session.commit()
    session.close()
    return

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
    logging.debug('api.addPlaylist' + " " + user_id, name)
    session = Session()
    playlist = Playlist(name=name, user_id=user_id)
    session.add(playlist)
    session.commit()
    session.close()

def deletePlaylist(playlist_id, user_id):
    logging.debug('api.deletePlaylist' + " " + playlist_id, user_id)
    session = Session()
    song = session.query(Playlist).filter(Playlist.id == playlist_id and Playlist.user_id == user_id).first()
    session.delete(song)
    session.commit()
    session.close()
    return

def updatePlaylist(id, name):
    logging.debug('api.updatePlaylist' + " " + id,name)
    session = Session()
    playlist = session.query(Playlist).filter(Playlist.id==id).first()
    playlist.name = name
    session.commit()
    session.close()
    return

def addSongToPlaylist(song_id, playlist_id):
    logging.debug('api.addSongToPlaylist' + " " + song_id + " " + playlist_id)
    session = Session()
    playlist = session.query(Playlist).filter(Playlist.id==playlist_id).first()
    song = session.query(Song).filter(Song.id==song_id).first()

    if(not song in playlist.songs):
        playlist.songs.append(song)

    session.commit()
    session.close()
    return

def removeSongFromPlaylist(song_id, playlist_id):
    logging.debug('api.removeSongFromPlaylist' + " " + song_id + " " + playlist_id)
    session = Session()
    playlist = session.query(Playlist).filter(Playlist.id==playlist_id).first()

    playlist.songs = [song for song in playlist.songs if str(song.id) != str(song_id)]

    session.commit()
    session.close()
    return