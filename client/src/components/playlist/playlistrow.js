import React, { Component } from 'react';
import { Glyphicon, FormControl, Panel} from 'react-bootstrap';
import './playlistrow.css';
import SongList from './songlist'
import configuration from '../../conf.js'

class PlayListRow extends Component {
    constructor(props) {
        super(props);
        this.state = this.props.playlist;
        if (this.state == undefined) this.state = {};
        this.state.edited = false;

        if(this.props.activePlaylist === this.props.playlist.id)
            this.state.showSongs = true;
        else {
            this.state.showSongs = false;
        }

        this.handleChange = this.handleChange.bind(this);
        this.deletePlaylist = this.deletePlaylist.bind(this);
        this.savePlaylist = this.savePlaylist.bind(this);
        this.discardPlaylist = this.discardPlaylist.bind(this);
        this.editPlaylist = this.editPlaylist.bind(this);
        this.changePlaylist = this.changePlaylist.bind(this);
        this.hidePlaylist = this.hidePlaylist.bind(this);
    }


    handleChange(e) {
        this.setState({[e.target.name]:e.target.value});
        console.log("changed",e.target.name,"to",e.target.value);
    }

    deletePlaylist(e) {
        let id = e.currentTarget.name;
        console.log("Deleting", id);
        e.preventDefault();

        let result = fetch(configuration.api_host + '/api/playlist/' + id,
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

        let result = fetch(configuration.api_host + '/api/playlist/' + id,
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
            this.setState({"edited": false});
        })
            .catch(function(ex) {console.log('FAIL: ', ex)})
    }

    discardPlaylist(e) {
        e.preventDefault();
        let showSongs = this.state.showSongs;
        this.setState(this.props.playlist);
        this.setState({"edited":false, "showSongs": showSongs});
    }

    changePlaylist() {
        this.props.changePlaylist(this.props.playlist.id)
        this.setState({showSongs: true})
    }

    hidePlaylist(){
        this.setState({showSongs: false})
    }



    render() {
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
                <div onClick={this.changePlaylist}>
                    <h4 className="playlistTitle">
                        {this.props.playlist.name} &nbsp;-&nbsp;
                        {this.props.playlist.creation_date} &nbsp;-&nbsp;
                        {this.props.playlist.songs.length}
                    </h4>
                    {buttons}
                </div>;

        if (this.state.edited) {
            row =
                <div onClick={this.changePlaylist}>
                    <FormControl  className="playlistProperty" name="name" type="text" placeholder="Enter a name"  value={this.state.name} onChange={this.handleChange}/>
                    {submit}
                </div>
        }

        let songList = null;
        if (this.state.showSongs) {
            songList = <SongList playlistId={this.props.playlist.id} songs={this.props.playlist.songs} updatePlaylists={this.props.updatePlaylists}/>
        }

        return (
            <Panel header={row} eventKey={this.props.playlistId}>
                {songList}
            </Panel>
        );
    }
}

export default PlayListRow;
