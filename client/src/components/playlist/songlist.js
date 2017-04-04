import React, { Component } from 'react';
import {Table, Accordion, Glyphicon, Panel, Form, ControlLabel, FormControl, FormGroup} from 'react-bootstrap';
import './songlist.css';
import AudioPlayer from './audioPlayer'

class SongList extends Component {
    constructor(props) {
        super(props);
        
        let url = "/api/play/"+this.props.songs[0].id
        this.state = {currentSongNumber: 0, currentSongUrl:url, playStatus: "PAUSED", glyph: "play"};
        
        this.removeSongFromPlaylist = this.removeSongFromPlaylist.bind(this)
        this.togglePlay = this.togglePlay.bind(this)
        this.nextSong = this.nextSong.bind(this)
    }

    removeSongFromPlaylist(e) {
        let id = e.currentTarget.name;
        console.log("Deleting", id);
        e.preventDefault();

        let result = fetch('/api/playlist/' + this.props.playlistId + "/songs/" + id,
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
        if(this.state.playStatus == "PAUSED"){
            this.setState({playStatus: "PLAYING"})
            this.setState({glyph: "pause"})
        }
        else{
            this.setState({playStatus: "PAUSED"})
            this.setState({glyph: "play"})
        }
    }

    nextSong(){
        let songNumber = (this.state.currentSongNumber+1)%this.props.songs.length
        this.setState({currentSongNumber: songNumber})

        let newUrl = "/api/play/"+this.props.songs[songNumber].id
        this.setState({currentSongUrl: newUrl})
    }

    render() {

        let rows = []
 ;       this.props.songs.forEach((el) => {
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
        
        return (
            <div>
                <br/>
                <div>
                    <button class="btn btn-default" id="playButton" onClick={this.togglePlay}>
                        <Glyphicon glyph={this.state.glyph}/>
                    </button>
                    <button class="btn btn-default" id="nextButton" onClick={this.nextSong}>
                        <Glyphicon glyph="forward" />
                    </button>
                </div>
                <AudioPlayer songs={this.props.songs} playStatus={this.state.playStatus} currentSongUrl={this.state.currentSongUrl} currentSongNumber={this.state.currentSongNumber}/>
                <br/>
                {rows}
            </div>
        );
    }
}

export default SongList;
