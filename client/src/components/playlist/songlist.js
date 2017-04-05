import React, { Component } from 'react';
import {Glyphicon} from 'react-bootstrap';
import './songlist.css';
import AudioPlayer from './audioPlayer'
import configuration from '../../conf.js'

class SongList extends Component {
    constructor(props) {
        super(props);

        let url, playerRef;

        if (this.props.songs.length > 0) {
            url = configuration.api_host + "/api/play/" + this.props.songs[0].id;
            playerRef = "audioPlayer"+this.props.playlistId
        }

        this.state = {
            currentSongNumber: 0,
            currentSongUrl:url,
            playStatus: "PAUSED",
            glyph: "play",
            playerRef: playerRef
        };

        this.removeSongFromPlaylist = this.removeSongFromPlaylist.bind(this)
        this.togglePlay = this.togglePlay.bind(this)
        this.nextSong = this.nextSong.bind(this)
    }

    removeSongFromPlaylist(e) {
        let id = e.currentTarget.name;
        console.log("Deleting", id);
        e.preventDefault();

        let result = fetch(configuration.api_host + '/api/playlist/' + this.props.playlistId + "/songs/" + id,
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

    togglePlay(){
        if(this.state.playStatus === "PAUSED"){
            this.setState({playStatus: "PLAYING"})
            this.setState({glyph: "pause"})
        }
        else{
            this.setState({playStatus: "PAUSED"})
            this.setState({glyph: "play"})
        }
    }

    nextSong(){
        this.refs[this.state.playerRef].nextSong()
    }

    render() {
        let rows = [];
        let player, buttons;
        if (this.props.songs.length > 0) {
            this.props.songs.forEach((el) => {
                rows.push(
                    <span key={el.id}>
                        {el.title} &nbsp;-&nbsp;
                        {el.album} &nbsp;-&nbsp;
                        {el.artist} &nbsp;-&nbsp;
                        {el.release_year}

                        <a href="#" name={el.id} onClick={this.removeSongFromPlaylist}>
                            <Glyphicon ref="" glyph="trash" />
                        </a>

                        <br/>
                    </span>
                )
            });

            buttons = <div>
                <button className="btn btn-default" id="playButton" onClick={this.togglePlay}>
                    <Glyphicon glyph={this.state.glyph}/>
                </button>
                <button className="btn btn-default" id="nextButton" onClick={this.nextSong}>
                    <Glyphicon glyph="forward" />
                </button>
                <br/>
                <br/>
            </div>

            player = <AudioPlayer songs={this.props.songs} playStatus={this.state.playStatus} currentSongUrl={this.state.currentSongUrl} currentSongNumber={this.state.currentSongNumber} ref={this.state.playerRef}/>


        } else {
            rows = <b>This playlist is empty</b>
        }

        return (
            <div>
                {buttons}
                {player}
                {rows}
            </div>
        );
    }
}

export default SongList;
