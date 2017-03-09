from flask import Flask
from flask import jsonify
from flask import request
from flask_cors import CORS, cross_origin
import json
import os

app = Flask(__name__)
CORS(app)

@app.route('/', methods=["GET"])
def list():
	return "Hello world!"

if __name__ == '__main__':
    app.run(host="localhost", port=3001)
