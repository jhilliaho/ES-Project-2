import React, { Component } from 'react';
import { FormGroup, ControlLabel, Button, FormControl } from 'react-bootstrap';
import './addplaylist.css';
import configuration from '../../conf.js'

class AddPlaylist extends Component {
    constructor() {
        super();
        this.state = {};
        this.handleChange = this.handleChange.bind(this);
        this.addPlaylist = this.addPlaylist.bind(this);
    }

    handleChange(e) {
        this.setState({[e.target.name]:e.target.value});
        console.log("changed",e.target.name,"to",e.target.value);
    }

    addPlaylist(e) {
        console.log("AddPlaylist")
        e.preventDefault();

        let result = fetch(configuration.api_host + '/api/playlist',
            {
                method: "POST",
                mode: "cors",
                credentials: "include",
                headers:{'content-type': 'application/json'},
                body: JSON.stringify({"name":this.state.name})
            });
        result.then((res) => {
            console.log(res);
            this.props.updatePlaylists();
            this.setState({"name":"", "edited":false})
        })
            .catch(function(ex) {console.log('FAIL: ', ex)})
    }

    render() {
        return (
            <div className="addPlaylist">

                    <FormGroup>
                        <ControlLabel>Name</ControlLabel>
                        <FormControl
                                     type="text"
                                     name="name"
                                     placeholder="Enter name"
                                     value={this.state.name}
                                     onChange={this.handleChange}>
                        </FormControl>
                    </FormGroup>

                    <Button onClick={this.addPlaylist}>
                        Submit
                    </Button>
            </div>
        );
    }
}

export default AddPlaylist;
