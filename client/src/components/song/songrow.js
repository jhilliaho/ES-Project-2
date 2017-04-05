import React, { Component } from 'react';
import { Glyphicon, FormControl, Popover, OverlayTrigger } from 'react-bootstrap';
import './songrow.css';
import configuration from '../../conf.js'

class SongRow extends Component {
    constructor(props) {
        super(props);
        this.state = this.props.song;
        this.state.edited = false;
        this.state.playlists = [];

        this.handleChange = this.handleChange.bind(this);
        this.deleteSong = this.deleteSong.bind(this);
        this.saveSong = this.saveSong.bind(this);
        this.discardSong = this.discardSong.bind(this);
        this.editSong = this.editSong.bind(this);
        this.playSong = this.playSong.bind(this);
        this.getPlaylists = this.getPlaylists.bind(this);
        this.addSongToPlaylist = this.addSongToPlaylist.bind(this);
    }

    playSong(e){
        let id = e.currentTarget.name;
        window.open(configuration.api_host + '/api/play/'+id, '_blank')
    }

    handleChange(e) {
        this.setState({[e.target.name]:e.target.value});
        console.log("changed",e.target.name,"to",e.target.value);
    }

    deleteSong(e) {
        let id = e.currentTarget.name;
        console.log("Deleting", id);
        e.preventDefault();

        let result = fetch(configuration.api_host + '/api/song/' + id,
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

        let result = fetch(configuration.api_host + '/api/song/' + id,
            {
                method: "PUT",
                mode: "cors",
                headers:{'content-type': 'application/json'},
                credentials: "include",
                body: JSON.stringify(this.state)
            });
        result.then((res) => {
            console.log(res);
            this.props.updateSongs();
            this.setState({"edited":false})
        })
            .catch(function(ex) {console.log('FAIL: ', ex)})
    }

    discardSong(e) {
        e.preventDefault();
        this.setState(this.props.song);
        this.setState({"edited":false});
    }

    getPlaylists(e) {
        e.preventDefault();

        let result = fetch(configuration.api_host + '/api/playlist',
            {
                method: "GET",
                mode: "cors",
                credentials: "include",
            });
        result.then((res) => {
            res.json().then(json => {
                console.log(json);

                json = json.filter((playlist) => {
                    let res = true
                    playlist.songs.forEach((song) => {
                       console.log(song.id, this.state.id)
                       if (song.id == this.state.id) {
                           res = false
                       }
                   });
                    return res;
                });

                this.setState({"playlists":json})
            })

        })
            .catch(function(ex) {console.log('FAIL: ', ex)})
    }

    addSongToPlaylist(e) {
        let song_id = String(this.state.id);
        let playlist_id = e.target.name;
        e.preventDefault();
        console.log("Shit happens")
        e.preventDefault();

        let result = fetch(configuration.api_host + '/api/playlist/' + playlist_id + '/songs/' + song_id,
            {
                method: "POST",
                mode: "cors",
                headers:{'content-type': 'application/json'},
                credentials: "include",
            });
        result.then((res) => {
            console.log("Added")
            this.refs.addSongToPlaylistPopover.hide();
        })
            .catch(function(ex) {console.log('FAIL: ', ex)})
    }

    render() {


        let playlists = [];
        this.state.playlists.forEach((el) => {
            playlists.push(<li key={el.id} ><a name={el.id} href="#" onClick={this.addSongToPlaylist}>{el.name}</a></li>)
        });

        const popover = (
            <Popover id="popover-positioned-right" title="Add song to playlist">
                <ol>{playlists}</ol>
            </Popover>
        );

        let buttons =
            <td className="modify">
                <OverlayTrigger ref="addSongToPlaylistPopover" trigger="click" placement="left" overlay={popover}>
                    <a href="#" onClick={this.getPlaylists}><Glyphicon glyph="plus" /></a>
                </OverlayTrigger>
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
                    <a href="#/songs" name={this.props.song.id} onClick={this.playSong}>
                        <Glyphicon glyph="play" />
                    </a>


                    <OverlayTrigger ref="addSongToPlaylistPopover" trigger="click" placement="left" overlay={popover}>
                        <a href="#" onClick={this.getPlaylists}><Glyphicon glyph="plus" /></a>
                    </OverlayTrigger>

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
