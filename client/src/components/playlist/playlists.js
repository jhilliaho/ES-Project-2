import React, { Component } from 'react';
import {Table, Accordion, Panel, Form, ControlLabel, FormControl, FormGroup} from 'react-bootstrap';
import './playlists.css';
import AddPlaylist from './addplaylist'
import PlaylistRow from './playlistrow'

class Playlists extends Component {
    constructor() {
        super();
        this.state = {'playlists': [], 'user_id': ""};
        this.fetchPlaylists = this.fetchPlaylists.bind(this);
        this.fetchUser();
        this.fetchPlaylists();
    }

    fetchPlaylists() {
        let result = fetch('http://localhost:3001/api/playlist', {mode: "cors", credentials: "include"})
        result.then((response) => {return response.text()})
            .then((res) => {
                let playlists = JSON.parse(res);
                this.setState({playlists: playlists});
                console.log(playlists)
            })
            .catch(function(ex) {console.log('FAIL: ', ex)})
    }

    fetchUser() {
        let result = fetch('http://localhost:3001/api/user', {mode: "cors", credentials: "include"})
        result.then((response) => {return response.text()})
            .then((res) => {
                let user = JSON.parse(res);
                this.setState({user_id: user.id});
            })
            .catch(function(ex) {console.log('FAIL: ', ex)})
    }

    render() {

        let rows = [];
        this.state["playlists"].forEach((el) => {
            rows.push(<PlaylistRow key={el.id} playlist={el} updatePlaylists={this.fetchPlaylists}/>)
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
                {rows}

            </div>
        );
    }
}

export default Playlists;
