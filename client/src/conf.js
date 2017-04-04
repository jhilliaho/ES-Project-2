/**
 * Created by jani on 04/04/2017.
 */


let deploy = false;

var configuration = {app_name: "Soundsfine"};

if (deploy) {
    configuration.api_host = ""
} else {
    configuration.api_host = "http://localhost:5000"
}


export default configuration