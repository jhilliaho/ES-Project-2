from flask import Flask
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, Integer, String, Sequence
from sqlalchemy.orm import sessionmaker
import configuration
Base = declarative_base()

# Create db engine with username, password, db address and db name
engine = create_engine('mysql+mysqldb://' + configuration.username + ':' + configuration.password + '@' + configuration.db_host + '/' + configuration.db_name, echo=True)

app = Flask(__name__)

class User(Base):
    __tablename__ = 'users'

    id = Column(Integer, Sequence('user_id_seq'), primary_key=True)
    username = Column(String(50))
    email = Column(String(50))
    password = Column(String(12))

    def __repr__(self):
        return "<User(username='%s', email='%s', password='%s')>" % (
                                self.username, self.email, self.password)

Base.metadata.create_all(engine)

# Define Session class
Session = sessionmaker()

# Configure Session
Session.configure(bind=engine)  # once engine is available



# IN OTHER FILES:
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

print("Schema loaded")

