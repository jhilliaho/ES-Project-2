from flask import Flask
from flask import jsonify
from flask import request
from flask_cors import CORS, cross_origin
from flask import render_template
import json
import os

template_dir = os.path.abspath('../client/build')
static_dir = os.path.abspath('../client/build/static')
app = Flask(__name__,template_folder=template_dir,static_folder=static_dir)
CORS(app)

@app.route('/', methods=["GET"])
def list():
	return render_template('index.html')



if __name__ == '__main__':
    app.run(host="localhost", port=3001)
