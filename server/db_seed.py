# THIS FILE REMOVES ALL DATA FROM DATABASE TABLES AND WRITES DEFAULT VALUES TO THEM

from schema import *

# Create session
session = Session()

# Remove all data
for instance in session.query(Song):
    instance.playlists = []

session.query(Playlist).delete()
session.query(Song).delete()
session.query(User).delete()

# Add new data
users = [
    User(email="aa@aa.aa", name="User aa", password="aa@aa.aa"),
    User(email="bb@bb.bb", name="User bb", password="bb@bb.bb")
]

session.add_all(users)

songs = [
    Song(title="Song a1", artist="Artist 1", album="Album a", release_year=2001, path="File 1", user=users[0]),
    Song(title="Song a2", artist="Artist 2", album="Album a", release_year=2002, path="File 2", user=users[0]),
    Song(title="Song a3", artist="Artist 3", album="Album a", release_year=2003, path="File 3", user=users[0]),
    Song(title="Song b1", artist="Artist 1", album="Album b", release_year=2004, path="File 4", user=users[1]),
    Song(title="Song b2", artist="Artist 2", album="Album b", release_year=2005, path="File 5", user=users[1]),
    Song(title="Song b3", artist="Artist 3", album="Album b", release_year=2006, path="File 6", user=users[1])
]

playlists = [
    Playlist(name="Playlist a1", user=users[0]),
    Playlist(name="Playlist a2", user=users[0]),
    Playlist(name="Playlist b1", user=users[1]),
    Playlist(name="Playlist b2", user=users[1])
]

playlists[0].songs.extend(songs[0:3])
playlists[1].songs.extend(songs[1:4])
playlists[2].songs.extend(songs[2:5])
playlists[3].songs.extend(songs[3:6])

session.add_all(songs)
session.add_all(playlists)

session.commit()
session.close()