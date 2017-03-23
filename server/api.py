from schema import *

def write():
    session = Session()
    ed_user = User(email='test', username='Ed dsdasd', password='ds')
    session.add(ed_user)
    session.commit()
    session.close()

def read():
    session = Session()
    arr = ""
    for instance in session.query(User).order_by(User.id):
        arr = instance.username + " " + instance.email

    session.close()
    return arr