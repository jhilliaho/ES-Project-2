# ES-Project-2
A Three-Tier Application on the Cloud with Flask, SQLAlchemy and React.

**How to run locally:**
1. Clone this project
2. Create the configuration file by copying server/configuration_example.py to server/configuration.py
3. Have MySQL database running
4. Install Python requirements with command "pip install -r server/requirements.txt"
5. Launch application with command "python server/application.py"

**How to deploy in Amazon Elastic Beanstalk:**
1. Clone this project
2. Create the configuration file by copying server/configuration_example.py to server/configuration.py
3. Install Amazon EB CLI
4. If you want to use Amazon EFS for storing music files in the application, create and EFS instance and copy its id to configuration file "server/.ebextensions/efs_mount.config". Otherwise delete the configuration file.
5. Deploy the application with Amazon EB CLI with commands "eb init" and "eb create"

**How to modify the React GUI**
1. Install node modules by function "npm install" in client folder
2. Modify something
3. Run client/deploy.sh
4. Restart python server or deploy changes in Amazon cloud by command "eb deploy" in the server folder
