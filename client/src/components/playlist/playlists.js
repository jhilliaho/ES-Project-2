import React, { Component } from 'react';
import {Table, Accordion, Panel, Form, ControlLabel, FormControl, FormGroup} from 'react-bootstrap';
import './playlists.css';
import AddPlaylist from './addplaylist'
import PlaylistRow from './playlistrow'

class Playlists extends Component {
    constructor() {
        super();
        this.state = {'playlists': [],'activePlaylist': "", 'user_id': ""};
        this.fetchPlaylists = this.fetchPlaylists.bind(this);
        this.changePlaylist = this.changePlaylist.bind(this);
        this.fetchUser();
        this.fetchPlaylists();
    }

    fetchPlaylists() {
        let result = fetch('/api/playlist', {mode: "cors", credentials: "include"})
        result.then((response) => {return response.text()})
            .then((res) => {
                let playlists = JSON.parse(res);
                this.setState({playlists: playlists, activePlaylist: playlists[0].id});
                console.log(playlists)
            })
            .catch(function(ex) {console.log('FAIL: ', ex)})
    }

    fetchUser() {
        let result = fetch('/api/user', {mode: "cors", credentials: "include"})
        result.then((response) => {return response.text()})
            .then((res) => {
                let user = JSON.parse(res);
                this.setState({user_id: user.id});
            })
            .catch(function(ex) {console.log('FAIL: ', ex)})
    }

    changePlaylist(playlist){
        this.refs[this.state.activePlaylist].hidePlaylist()
        this.setState({activePlaylist: playlist})
    }

    render() {

        let rows = [];
        this.state["playlists"].forEach((el) => {
            rows.push(<PlaylistRow ref={el.id} key={el.id} playlist={el} updatePlaylists={this.fetchPlaylists} activePlaylist={this.state.activePlaylist} changePlaylist={this.changePlaylist}/>)
        });

        return (
            <div className="playlists">
                <h3>Playlists</h3>
                <Accordion>
                    <Panel header="Add a new playlist" eventKey="1">
                        <AddPlaylist updatePlaylists={this.fetchPlaylists}/>
                    </Panel>
                </Accordion>

                <Panel header="Sort by" eventKey="1">
                    Form
                </Panel>

                <Accordion>
                    {rows}
                </Accordion>
                

            </div>
        );
    }
}

export default Playlists;
