import React, { Component } from 'react';
import { FormGroup, ControlLabel, Button, FormControl } from 'react-bootstrap';
import './addsong.css';
import configuration from '../../conf.js'

function FieldGroup({ id, label, help, ...props }) {
    return (
        <FormGroup controlId={id}>
            <ControlLabel>{label}</ControlLabel>
            <FormControl {...props} />
        </FormGroup>
    );
}

class AddSong extends Component {
    constructor() {
        super();
        this.state = {};
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(e) {
        this.setState({[e.target.name]:e.target.value});
        console.log("changed",e.target.name,"to",e.target.value);
    }

    render() {
        return (
            <div className="addSong">
                <form method="POST" encType="multipart/form-data" action={configuration.api_host + '/api/song'}>
                    <FieldGroup
                        id="addSongTitle"
                        type="text"
                        label="Title"
                        name="title"
                        placeholder="Enter title"
                        onChange={this.handleChange}
                    />
                    <FieldGroup
                        id="addSongArtist"
                        type="text"
                        label="Artist"
                        name="artist"
                        placeholder="Enter artist"
                        onChange={this.handleChange}
                    />
                    <FieldGroup
                        id="addSongAlbum"
                        type="text"
                        label="Album"
                        name="album"
                        placeholder="Enter album"
                        onChange={this.handleChange}
                    />
                    <FieldGroup
                        id="addSongYear"
                        type="number"
                        label="Release year"
                        name="year"
                        placeholder="Enter year"
                        onChange={this.handleChange}
                    />
                    <FieldGroup
                        id="addSongFile"
                        type="file"
                        label="File (Max size: 5MB)"
                        name="file"
                        help="Example block-level help text here."
                        onChange={this.handleChange}
                    />
                    <Button type="submit">
                        Submit
                    </Button>
                </form>
            </div>
        );
    }
}


export default AddSong;
