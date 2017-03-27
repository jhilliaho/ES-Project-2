import React, { Component } from 'react';
import {Table, Glyphicon, Button, Col, Row, Panel, Form, ControlLabel, FormControl, FormGroup} from 'react-bootstrap';
import './songlist.css';

class SongList extends Component {
    constructor() {
        super();
        this.state = {'songs': [], 'user_id': "", "artist": "", "album": "", "title": ""};
        this.fetchSongs();
        this.fetchUser();
        this.handleChange = this.handleChange.bind(this);
    }

    fetchSongs() {

        let result = fetch('http://localhost:3001/api/song', {mode: "cors", credentials: "include"})
        result.then((response) => {return response.text()})
            .then((res) => {
                let songs = JSON.parse(res);
                this.setState({songs: songs});
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

    handleChange(e) {
        console.log("Changed", e.target.name, e.target.value);
        this.setState({[e.target.name]:e.target.value.toLowerCase()});
    }

    render() {

        let rows = [];
        console.log("Rendering");
        this.state["songs"].forEach((el) => {

            if (el.artist.toLowerCase().indexOf(this.state.artist) === -1 ||
                el.album.toLowerCase().indexOf(this.state.album) === -1 ||
                el.title.toLowerCase().indexOf(this.state.title) === -1) {
                return;
            }

            let edit = "";
            if (el.user_id === this.state.user_id) {
                edit =
                    <td>
                        <Glyphicon glyph="pencil" />
                        <Glyphicon glyph="trash" />
                        <Glyphicon glyph="plus" />
                    </td>
            } else {
                edit =
                    <td>
                        <Glyphicon glyph="plus" />
                    </td>
            }

            let row =
                <tr key={el.id}>
                    <td>{el.title}</td>
                    <td>{el.artist}</td>
                    <td>{el.album}</td>
                    <td>{el.release_year}</td>
                    {edit}
                </tr>;

            rows.push(row)
        });

        return (
            <div className="songs">
                <h3>Songs</h3>
                <Panel>
                    <Form inline>
                        <FormGroup className="filter">
                            <ControlLabel className="filterLabel">Title: </ControlLabel>
                            <FormControl name="title" type="text" placeholder="Search..."  value={this.state.title} onChange={this.handleChange}/>
                        </FormGroup>
                        <FormGroup className="filter">
                            <ControlLabel className="filterLabel">Artist: </ControlLabel>
                            <FormControl name="artist" type="text" placeholder="Search..." value={this.state.artist} onChange={this.handleChange}/>
                        </FormGroup>
                        <FormGroup className="filter">
                            <ControlLabel className="filterLabel">Album: </ControlLabel>
                            <FormControl name="album" type="text" placeholder="Search..."  value={this.state.album} onChange={this.handleChange}/>
                        </FormGroup>
                    </Form>


                    <Table fill striped bordered condensed hover>
                        <thead>
                        <tr>
                            <th>Title</th>
                            <th>Artist</th>
                            <th>Album</th>
                            <th>Release year</th>
                            <th className="modify" >&nbsp;</th>
                        </tr>
                        </thead>
                        <tbody>
                            {rows}
                        </tbody>
                    </Table>
                </Panel>
            </div>
        );
    }
}

export default SongList;
