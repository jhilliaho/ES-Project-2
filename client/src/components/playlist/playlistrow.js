import React, { Component } from 'react';
import { FormGroup, ControlLabel, Glyphicon, FormControl, Panel} from 'react-bootstrap';
import './playlistrow.css';
import SongList from './songlist'

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
        this.state.showSongs = false;

        this.handleChange = this.handleChange.bind(this);
        this.deletePlaylist = this.deletePlaylist.bind(this);
        this.savePlaylist = this.savePlaylist.bind(this);
        this.discardPlaylist = this.discardPlaylist.bind(this);
        this.editPlaylist = this.editPlaylist.bind(this);
        this.playPlaylist = this.playPlaylist.bind(this);
        this.showSongList = this.showSongList.bind(this);
    }

    showSongList(e) {
        e.preventDefault();
        let show = (e.currentTarget.name == "show");
        this.setState({'showSongs': show})
    }

    playPlaylist(e){
        let id = e.currentTarget.name;
        window.open('api/play/'+id, '_blank')
    }

    handleChange(e) {
        this.setState({[e.target.name]:e.target.value});
        console.log("changed",e.target.name,"to",e.target.value);
    }

    deletePlaylist(e) {
        let id = e.currentTarget.name;
        console.log("Deleting", id);
        e.preventDefault();

        let result = fetch('/api/playlist/' + id,
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

        let result = fetch('/api/playlist/' + id,
            {
                method: "PUT",
                mode: "cors",
                credentials: "include",
                headers:{'content-type': 'application/json'},
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
        let showSongs = this.state.showSongs;
        this.setState(this.props.playlist);
        this.setState({"edited":false, "showSongs": showSongs});
    }



    render() {
        let chevron = <a href="#" name="show" onClick={this.showSongList}><Glyphicon glyph="chevron-up"/></a>;
        if (this.state.showSongs) {
            chevron = <a href="#" name="hide" onClick={this.showSongList}><Glyphicon glyph="chevron-down"/></a>;
        }

        let buttons =
            <span className="modify pull-right">
                <a href="#" name={this.props.playlist.id} onClick={this.editPlaylist}>
                    <Glyphicon glyph="pencil" />
                </a>
                <a href="#" name={this.props.playlist.id} onClick={this.deletePlaylist}>
                    <Glyphicon glyph="trash" />
                </a>
            </span>;


        let submit =
            <span className="modify pull-right">
                <a href="#" name={this.props.playlist.id} onClick={this.discardPlaylist}>
                    <Glyphicon glyph="remove" />
                </a>
                <a href="#" name={this.props.playlist.id} onClick={this.savePlaylist}>
                    <Glyphicon glyph="ok" />
                </a>
            </span>;

        let row =
                <div>
                    {chevron}
                    <h4 className="playlistTitle">
                        {this.props.playlist.name} &nbsp;-&nbsp;
                        {this.props.playlist.creation_date} &nbsp;-&nbsp;
                        {this.props.playlist.songs.length}
                    </h4>
                    {buttons}
                </div>;

        if (this.state.edited) {
            row =
                <div>
                    {chevron}
                    <FormControl  className="playlistProperty" name="name" type="text" placeholder="Enter a name"  value={this.state.name} onChange={this.handleChange}/>
                    {submit}
                </div>
        }

        let songList = null;
        if (this.state.showSongs) {
            songList = <SongList playlistId={this.props.playlist.id} songs={this.props.playlist.songs} updatePlaylists={this.props.updatePlaylists}/>
        }

        return (
            <Panel>
                {row}
                {songList}
            </Panel>
        );
    }
}

export default PlayListRow;
