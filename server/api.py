from schema import *
from flask import jsonify
from passlib.hash import pbkdf2_sha256
import json

def write():
    session = Session()
    ed_user = User(email='test', name='Ed dsdasd', password='ds')
    session.add(ed_user)
    session.commit()
    session.close()

def read():
    session = Session()
    arr = ""
    for instance in session.query(User).order_by(User.id):
        arr = instance.name + " " + instance.email

    session.close()
    return arr


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

def getUserById(email):
    session = Session()
    user = session.query(User).filter(User.email==email).first()

    session.close()
    return user

def updateUserById(email,name):
    session = Session()
    
    user = session.query(User).filter(User.email==email).first()
    user.name = name

    session.commit()
    session.close()


### SONG ###

def getSongs(user_id):
    session = Session()

    arr = []
    fields = ["id", "title", "artist", "album", "release_year", "path", "creation_date", "user_id"]
    for song in session.query(Song).all():
        song = song.getJsonSelectively(fields)
        print("I am ", user_id, " song owner is ", song["user_id"])
        if song["user_id"] == user_id:
            song["owner"] = True
        else:
            song["owner"] = False
        arr.append(song)

    session.close()
    return arr
