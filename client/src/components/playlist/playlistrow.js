import React, { Component } from 'react';
import { FormGroup, ControlLabel, Glyphicon, FormControl } from 'react-bootstrap';
import './playlistrow.css';

function FieldGroup({ id, label, help, ...props }) {
    return (
        <FormGroup controlId={id}>
            <ControlLabel>{label}</ControlLabel>
            <FormControl {...props} />
        </FormGroup>
    );
}

// Properties: playlist data, callback to update playlist list
// Inside this: delete playlist, edit playlist, add playlist to playlist

class PlayListRow extends Component {
    constructor(props) {
        super(props);
        this.state = this.props.playlist;
        this.state.edited = false;

        this.handleChange = this.handleChange.bind(this);
        this.deletePlaylist = this.deletePlaylist.bind(this);
        this.savePlaylist = this.savePlaylist.bind(this);
        this.discardPlaylist = this.discardPlaylist.bind(this);
        this.editPlaylist = this.editPlaylist.bind(this);
        this.playPlaylist = this.playPlaylist.bind(this);
    }

    playPlaylist(e){
        let id = e.currentTarget.name;
        window.open('http://localhost:3001/api/play/'+id, '_blank')
    }

    handleChange(e) {
        this.setState({[e.target.name]:e.target.value});
        console.log("changed",e.target.name,"to",e.target.value);
    }

    deletePlaylist(e) {
        let id = e.currentTarget.name;
        console.log("Deleting", id);
        e.preventDefault();

        let result = fetch('http://localhost:3001/api/playlist/' + id,
            {
                method: "DELETE",
                mode: "cors",
                credentials: "include"
            });
        result.then((res) => {
            console.log(res)
            this.props.updatePlaylists();
        })
            .catch(function(ex) {console.log('FAIL: ', ex)})
    }

    editPlaylist(e) {
        e.preventDefault();
        this.setState({'edited': true})
    }

    savePlaylist(e) {
        e.preventDefault();
        let id = e.currentTarget.name;
        console.log("Updating", id);
        e.preventDefault();

        console.log(this.state)

        let result = fetch('http://localhost:3001/api/playlist/' + id,
            {
                method: "PUT",
                mode: "cors",
                credentials: "include",
                body: JSON.stringify(this.state)
            });
        result.then((res) => {
            console.log(res);
            this.props.updatePlaylists();
            this.state.edited = false;
        })
            .catch(function(ex) {console.log('FAIL: ', ex)})
    }

    discardPlaylist(e) {
        e.preventDefault();
        this.setState(this.props.playlist);
        this.setState({"edited":false});
    }



    render() {




        let buttons =
            <td className="modify">
                <a href="#" name={this.props.playlist.id} onClick={this.editPlaylist}>
                    <Glyphicon glyph="pencil" />
                </a>
                <a href="#" name={this.props.playlist.id} onClick={this.deletePlaylist}>
                    <Glyphicon glyph="trash" />
                </a>
            </td>

        let submit =
            <td className="modify">
                <a href="#" name={this.props.playlist.id} onClick={this.discardPlaylist}>
                    <Glyphicon glyph="remove" />
                </a>
                <a href="#" name={this.props.playlist.id} onClick={this.savePlaylist}>
                    <Glyphicon glyph="ok" />
                </a>
            </td>;

        let row =
            <tr>
                <td className="playlistProperty">{this.props.playlist.name}</td>
                {buttons}
            </tr>;

        if (this.state.edited) {
            row =
                <tr>
                    <td className="playlistProperty">
                        <FormControl name="name" type="text" placeholder="Enter a name"  value={this.state.name} onChange={this.handleChange}/>
                    </td>
                    {submit}
                </tr>;
        }

        return (
            row
        );
    }
}

export default PlayListRow;
