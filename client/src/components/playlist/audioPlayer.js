import React, { Component } from 'react';
import configuration from '../../conf.js'

var Sound = require('react-sound');

class AudioPlayer extends Component {
	constructor(props) {
        super(props);
        
        console.log(this.props);
        this.state = {currentSongNumber: this.props.currentSongNumber, currentSongUrl: this.props.currentSongUrl};
        console.log(this.state);

        this.nextSong = this.nextSong.bind(this)
    }

    nextSong(){
    	console.log(this.state);
    	console.log(this.state.currentSongNumber);
        let songNumber = (this.state.currentSongNumber+1)%this.props.songs.length;
        this.setState({currentSongNumber: songNumber});
		console.log(songNumber);
	
		console.log(this.props.songs);
        let newUrl = configuration.api_host + "/api/play/"+this.props.songs[songNumber].id;
        console.log(newUrl);

        this.setState({currentSongUrl: newUrl})
    }

    render() {
		return (
			<Sound
	    		url={this.state.currentSongUrl}
	    		playStatus={this.props.playStatus}
	    		onFinishedPlaying={this.nextSong}
    		/>
	  	)
	}
}

export default AudioPlayer;
