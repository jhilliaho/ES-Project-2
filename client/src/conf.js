
let deploy = true;

var configuration = {app_name: "Soundsfine"};

if (deploy) {
    configuration.api_host = ""
} else {
    configuration.api_host = "http://localhost:5000"
}


export default configuration