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

def updateUserById(id,name):
    session = Session()

    user = session.query(User).filter(User.id==id).first()
    user.name = name

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

def getSongById(user_id):
    pass