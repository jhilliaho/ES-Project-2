import React, { Component } from 'react';
import { FormGroup, ControlLabel, Glyphicon, FormControl } from 'react-bootstrap';
import './songrow.css';

function FieldGroup({ id, label, help, ...props }) {
    return (
        <FormGroup controlId={id}>
            <ControlLabel>{label}</ControlLabel>
            <FormControl {...props} />
        </FormGroup>
    );
}

// Properties: song data, callback to update song list
// Inside this: delete song, edit song, add song to playlist

class SongRow extends Component {
    constructor(props) {
        super(props);
        this.state = this.props.song;
        this.state.edited = false;

        this.handleChange = this.handleChange.bind(this);
        this.deleteSong = this.deleteSong.bind(this);
        this.saveSong = this.saveSong.bind(this);
        this.discardSong = this.discardSong.bind(this);
        this.editSong = this.editSong.bind(this);
    }

    handleChange(e) {
        this.setState({[e.target.name]:e.target.value});
        console.log("changed",e.target.name,"to",e.target.value);
    }

    deleteSong(e) {
        let id = e.currentTarget.name;
        console.log("Deleting", id);
        e.preventDefault();

        let result = fetch('http://localhost:3001/api/song/' + id,
            {
                method: "DELETE",
                mode: "cors",
                credentials: "include"
            });
        result.then((res) => {
            console.log(res)
            this.props.updateSongs();
        })
            .catch(function(ex) {console.log('FAIL: ', ex)})
    }

    editSong(e) {
        e.preventDefault();
        this.setState({'edited': true})
    }

    saveSong(e) {
        e.preventDefault();
        let id = e.currentTarget.name;
        console.log("Updating", id);
        e.preventDefault();

        console.log(this.state)

        let result = fetch('http://localhost:3001/api/song/' + id,
            {
                method: "PUT",
                mode: "cors",
                credentials: "include",
                body: JSON.stringify(this.state)
            });
        result.then((res) => {
            console.log(res);
            this.props.updateSongs();
            this.state.edited = false;
        })
            .catch(function(ex) {console.log('FAIL: ', ex)})
    }

    discardSong(e) {
        e.preventDefault();
        this.setState(this.props.song);
        this.setState({"edited":false});
    }



    render() {


        let buttons =
            <td className="modify">
                <a href="#" ><Glyphicon glyph="plus" /></a>
            </td>;

        if (this.props.song.owner) {
            buttons =
                <td className="modify">
                    <a href="#" name={this.props.song.id} onClick={this.editSong}>
                        <Glyphicon glyph="pencil" />
                    </a>
                    <a href="#" name={this.props.song.id} onClick={this.deleteSong}>
                        <Glyphicon glyph="trash" />
                    </a>
                    <a href="#" ><Glyphicon glyph="plus" /></a>
                </td>
        }

        let submit =
            <td className="modify">
                <a href="#" name={this.props.song.id} onClick={this.discardSong}>
                    <Glyphicon glyph="remove" />
                </a>
                <a href="#" name={this.props.song.id} onClick={this.saveSong}>
                    <Glyphicon glyph="ok" />
                </a>
            </td>;

        let row =
            <tr>
                <td className="songProperty">{this.props.song.title}</td>
                <td className="songProperty">{this.props.song.artist}</td>
                <td className="songProperty">{this.props.song.album}</td>
                <td className="songProperty">{this.props.song.release_year}</td>
                {buttons}
            </tr>;

        if (this.state.edited) {
            row =
                <tr>
                    <td className="songProperty">
                        <FormControl name="title" type="text" placeholder="Enter a title"  value={this.state.title} onChange={this.handleChange}/>
                    </td>
                    <td className="songProperty">
                        <FormControl name="artist" type="text" placeholder="Enter a artist"  value={this.state.artist} onChange={this.handleChange}/>
                    </td>
                    <td className="songProperty">
                        <FormControl name="album" type="text" placeholder="Enter a album"  value={this.state.album} onChange={this.handleChange}/>
                    </td>
                    <td className="songProperty">
                        <FormControl name="release_year" type="text" placeholder="Enter a year"  value={this.state.release_year} onChange={this.handleChange}/>
                    </td>
                    {submit}
                </tr>;
        }

        return (
            row
        );
    }
}

export default SongRow;
