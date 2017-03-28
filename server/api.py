from schema import *
from flask import jsonify
from passlib.hash import pbkdf2_sha256
import json

### USER ###
def getUsers():
    session = Session()
    users = session.query(User).all()

    session.close()
    return users

def addUser(name,email,password):
    session = Session()
    
    user = User(email=email, name=name, password=password)

    session.add(user)
    session.commit()
    session.close()

def getUserById(id):
    session = Session()
    user = session.query(User).filter(User.id==id).first()

    session.close()

    fields = ["id", "email", "name"]
    return user.getJsonSelectively(fields)

def updateUserById(id,name,email):
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
    session = Session()

    arr = []
    fields = ["id", "title", "artist", "album", "release_year", "path", "user_id"]
    for song in session.query(Song).all(): arr.append(song.getJsonSelectively(fields))
    session.close()
    return arr

def getSongPath(song_id):
    session = Session()
    song = session.query(Song).filter(Song.id==song_id).first()
    session.close()
    return song.path

def deleteSong(song_id, user_id):
    session = Session()
    song = session.query(Song).filter(Song.id==song_id and Song.user_id==user_id).first()
    session.delete(song)
    session.commit()
    session.close()
    return

def addSong(title, artist, album, year, user_id, file_extension):
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
    return path

def updateSong(id, title, artist, album, release_year):
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
    session = Session()
    arr = []
    fields = ["id", "name"]
    for playlist in session.query(Playlist).filter(Playlist.user_id == user_id): arr.append(playlist.getJsonSelectively(fields))
    session.close()
    return arr

def addPlaylist(user_id, name):
    print("ADDING PLAYLIST",user_id,name)
    session = Session()
    playlist = Playlist(name=name, user_id=user_id)
    session.add(playlist)
    session.commit()
    session.close()

def deletePlaylist(playlist_id, user_id):
    session = Session()
    song = session.query(Playlist).filter(Playlist.id == playlist_id and Playlist.user_id == user_id).first()
    session.delete(song)
    session.commit()
    session.close()
    return

def updatePlaylist(id, name):
    session = Session()
    playlist = session.query(Playlist).filter(Playlist.id==id).first()
    playlist.name = name
    session.commit()
    session.close()
    return