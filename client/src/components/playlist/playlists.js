import React, { Component } from 'react';
import {Accordion, Panel, FormControl, FormGroup, ControlLabel, Col} from 'react-bootstrap';
import './playlists.css';
import AddPlaylist from './addplaylist'
import PlaylistRow from './playlistrow'
import configuration from '../../conf.js'

class Playlists extends Component {
    constructor() {
        super();
        this.state = {'playlists': [],'activePlaylist': "", 'user_id': "", "sortBy":"name", "sortDir":1};
        this.sortKeys = {"name": "Name", "creation_date": "Date", "song_count": "Song count"};
        this.fetchPlaylists = this.fetchPlaylists.bind(this);
        this.changePlaylist = this.changePlaylist.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.fetchUser();
        this.fetchPlaylists();
    }

    fetchPlaylists() {
        let result = fetch(configuration.api_host + '/api/playlist', {mode: "cors", credentials: "include"})
        result.then((response) => {return response.text()})
            .then((res) => {
                let playlists = JSON.parse(res);
                playlists.forEach((el) => {el.song_count = el.songs.length});
                this.setState({playlists: playlists, activePlaylist: playlists[0].id});
                console.log(playlists)
            })
            .catch(function(ex) {console.log('FAIL: ', ex)})
    }

    fetchUser() {
        let result = fetch(configuration.api_host + '/api/user', {mode: "cors", credentials: "include"})
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

    handleChange(e) {
        e.preventDefault();
        console.log("Changing", e.target.name, e.target.value)
        this.setState({[e.target.name]:e.target.value});
    }

    render() {

        let rows = [];

        let sort_choices = Object.keys(this.sortKeys);
        let index = sort_choices.indexOf(this.state.sortBy);
        sort_choices.splice(index, 1);
        sort_choices.unshift(this.state.sortBy);

        this.state["playlists"].sort((x,y) => {
            let decision = 0;
            sort_choices.some((val) => {
                let com = this.state.sortDir * (String(x[val]).localeCompare(String(y[val])));
                if (com != 0) {
                    decision = com;
                    return true;
                }
            });
            return decision;
        });

        this.state["playlists"].forEach((el) => {
            rows.push(<PlaylistRow ref={el.id} key={el.id} playlist={el} updatePlaylists={this.fetchPlaylists} activePlaylist={this.state.activePlaylist} changePlaylist={this.changePlaylist}/>)
        });

        let sort_options = [];
        Object.keys(this.sortKeys).forEach((key, index) => {
            let val = this.sortKeys[key]
            sort_options.push(<option key={key} value={key}>{val}</option>);
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
                    <Col xs={12} sm={6}>
                        <FormGroup controlId="formControlsSelect">
                            <ControlLabel>Sort by</ControlLabel>
                            <FormControl name="sortBy" componentClass="select" placeholder="select" value={this.state.sortBy} onChange={this.handleChange}>
                                {sort_options}
                            </FormControl>
                        </FormGroup>
                    </Col>
                    <Col xs={12} sm={6}>
                        <FormGroup controlId="formControlsSelect">
                            <ControlLabel>Direction</ControlLabel>
                            <FormControl name="sortDir" componentClass="select" placeholder="select" value={this.state.sortDir} onChange={this.handleChange}>
                                <option value="1">Ascending</option>
                                <option value="-1">Descending</option>
                            </FormControl>
                        </FormGroup>
                    </Col>
                </Panel>

                <Accordion>
                    {rows}
                </Accordion>
                

            </div>
        );
    }
}

export default Playlists;
