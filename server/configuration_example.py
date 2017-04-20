# THIS FILE NEEDS TO BE COPIED TO "configuration.py"
import os

# If running in Amazon cloud
if 'RDS_HOSTNAME' in os.environ:
	db_host = os.environ['RDS_HOSTNAME']
	db_name = os.environ['RDS_DB_NAME']
	username = os.environ['RDS_USERNAME']
	password = os.environ['RDS_PASSWORD']

# If running locally
else:
	db_host = "localhost"
	db_name = "db_name"
	username = "user_name"
	password = "nanananaaa"


secret_key = "very secret phrase9340u4390jgh53f829"
user_max_file_count = 10
reset_db_on_server_start = False
