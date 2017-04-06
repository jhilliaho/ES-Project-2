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
    constructor(props) {
        super(props);
        this.state = {"title": "exTitle", "artist": "exArtist", "album": "exAlbum", "year": 1231};
        this.state = {};
        this.handleChange = this.handleChange.bind(this);
        this.uploadSong = this.uploadSong.bind(this);
    }

    handleChange(e) {
        this.setState({[e.target.name]:e.target.value});
        console.log("changed",e.target.name,"to",e.target.value);
    }

    uploadSong(e) {
        e.preventDefault();

        let file = this.refs.file.files[0];
        console.log("Uploading file", file)
        let data = new FormData();

        data.append("file", this.refs.file.files[0], file.name);
        data.append("title", this.state["title"]);
        data.append("artist", this.state["artist"]);
        data.append("album", this.state["album"]);
        data.append("year", this.state["year"]);

        fetch(configuration.api_host + '/api/song', {
            method: "POST",
            mode: "cors",
            credentials: "include",
            body: data,
        }).then((response) => {
            this.props.updateList();
        })
    }

    render() {
        return (
            <div className="addSong">
                <form ref="form" method="POST" encType="multipart/form-data">
                    <FieldGroup
                        id="addSongTitle"
                        type="text"
                        label="Title"
                        name="title"
                        placeholder="Enter title"
                        onChange={this.handleChange}
                        value={this.state["title"]}
                    />
                    <FieldGroup
                        id="addSongArtist"
                        type="text"
                        label="Artist"
                        name="artist"
                        placeholder="Enter artist"
                        onChange={this.handleChange}
                        value={this.state["artist"]}
                    />
                    <FieldGroup
                        id="addSongAlbum"
                        type="text"
                        label="Album"
                        name="album"
                        placeholder="Enter album"
                        onChange={this.handleChange}
                        value={this.state["album"]}
                    />
                    <FieldGroup
                        id="addSongYear"
                        type="number"
                        label="Release year"
                        name="year"
                        placeholder="Enter year"
                        onChange={this.handleChange}
                        value={this.state["year"]}
                    />

                    <FormGroup controlId="addSongFile">
                        <ControlLabel>File (Max size: 10MB)</ControlLabel>
                        <input
                             type="file"
                             name="file"
                             ref="file"
                        />
                    </FormGroup>

                    <Button onClick={this.uploadSong}>
                        Submit
                    </Button>
                </form>
            </div>
        );
    }
}


export default AddSong;
