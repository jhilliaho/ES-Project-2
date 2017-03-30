import React, { Component } from 'react';
import {Table, Accordion, Glyphicon, Panel, Form, ControlLabel, FormControl, FormGroup} from 'react-bootstrap';
import './songlist.css';


class SongList extends Component {
    constructor() {
        super();
        this.state = {};
        this.removeSongFromPlaylist = this.removeSongFromPlaylist.bind(this)
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

    render() {

        let rows = [];
        this.props.songs.forEach((el) => {
            rows.push(
                <span key={el.id}>
                    {el.title} &nbsp;-&nbsp;
                    {el.album} &nbsp;-&nbsp;
                    {el.artist} &nbsp;-&nbsp;
                    {el.release_year}

                    <a href="#" name={el.id} onClick={this.removeSongFromPlaylist}>
                        <Glyphicon glyph="trash" />
                    </a>

                    <br/>
                </span>
            )
        });

        return (
            <div>
                <br/>
                {rows}
            </div>
        );
    }
}

export default SongList;
