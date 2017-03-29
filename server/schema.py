from flask import Flask
from flask import jsonify
import sqlalchemy
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, Integer, String, Sequence, ForeignKey, Table, DateTime
from sqlalchemy.orm import sessionmaker
from sqlalchemy.orm import relationship
import configuration
import datetime
from flask import jsonify

Base = declarative_base()

# Create db engine with username, password, db address and db name
engine = create_engine('mysql+mysqldb://' + configuration.username + ':' + configuration.password + '@' + configuration.db_host + '/' + configuration.db_name, echo=True)

app = Flask(__name__)


def selectJson(self, fields):
    obj = {}

    # Traverse fields
    for field in fields:

        # If field is string, read property value
        if isinstance(field, str):
            obj[field] = getattr(self, field)

            # If field is an object, serialize it
        else:
            # Read property value
            child = getattr(self, field["name"])

            # If the property is a list, serialize its objects
            if isinstance(child, sqlalchemy.orm.collections.InstrumentedList):
                obj[field["name"]] = []

                # Serialize single objects
                for item in child:
                    obj[field["name"]].append(item.getJsonSelectively(field["fields"]))

            # If the property is a single object, serialize it
            else:
                obj[field["name"]] = child.getJsonSelectively(field["fields"])

    return obj


class User(Base):
    __tablename__ = 'users'

    id = Column(Integer, Sequence('user_id_seq'), primary_key=True)
    name = Column(String(50))
    email = Column(String(50), unique=True)
    password = Column(String(200))
    creation_date = Column(DateTime, default=datetime.datetime.utcnow)

    # Relationships to songs and playlists
    songs = relationship("Song", back_populates="user")
    playlists = relationship("Playlist", back_populates="user")

    def __repr__(self): return "<User(name='%s', email='%s', password='%s')>" % (self.name, self.email, self.password)

    @property
    def getJson(self):
        user = {'name':self.name,'email':self.email}
        return user

    getJsonSelectively = selectJson



# Association table for many-to-may relationship between songs and playlists
songs_and_playlists = Table('songs_and_playlists', Base.metadata,
    Column('song_id', Integer, ForeignKey('songs.id')),
    Column('playlist_id', Integer, ForeignKey('playlists.id'))
)

class Song(Base):
    __tablename__ = 'songs'
    id = Column(Integer, Sequence('user_id_seq'), primary_key=True)
    title = Column(String(50))
    artist = Column(String(50))
    album = Column(String(50))
    release_year = Column(Integer())
    path = Column(String(200))
    creation_date = Column(DateTime, default=datetime.datetime.utcnow)

    # Relationship with user
    user_id = Column(Integer, ForeignKey('users.id'))
    user = relationship("User", back_populates="songs")

    # many-to-many relationship with playlist
    playlists = relationship(
        "Playlist",
        secondary=songs_and_playlists,
        back_populates="songs")

    @property
    def getJson(self):
        song = {'title':self.title,'artist':self.artist,'album':self.album,'release_year':self.release_year,'path':self.path,'playlists':self.playlists}
        return song

    getJsonSelectively = selectJson


class Playlist(Base):
    __tablename__ = "playlists"
    id = Column(Integer, Sequence('user_id_seq'), primary_key=True)
    name = Column(String(50))
    creation_date = Column(DateTime, default=datetime.datetime.utcnow)

    # Relationship with user
    user_id = Column(Integer, ForeignKey('users.id'))
    user = relationship("User", back_populates="playlists")

    # many to many relationship with song
    songs = relationship(
        "Song",
        secondary=songs_and_playlists,
        back_populates="playlists")

    @property
    def getJson(self):
        playlist = {'name':self.name,'email':self.email,'songs':self.songs}
        return playlist

    getJsonSelectively = selectJson


# Create all non-existing tables
# This can't update tables!
Base.metadata.create_all(engine)

# Define Session class
Session = sessionmaker()

# Configure Session
Session.configure(bind=engine)  # once engine is available


# USING SCHEMA IN OTHER FILES:
# import schema
# session = schema.Session()

# Create an User instance
# ed_user = User(email='ed', username='Ed Jones', password='edspassword')

# Add the User instance to the session
# session.add(ed_user)

# Write changes to the database
# session.commit()

# Close the session
# session.close()


