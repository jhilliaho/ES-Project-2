import React, { Component } from 'react';
import './home.css';
import configuration from '../conf.js'
import { Glyphicon } from 'react-bootstrap';

class Home extends Component {
    constructor() {
        super();
        this.state = {'username': ""}
        this.fetchUser();
    }

    fetchUser() {

        let result = fetch(configuration.api_host + '/api/user',
            {
                mode: "cors",
                credentials: "include"
            })
        result.then((response) => {return response.text()})
            .then((res) => {
                let user = JSON.parse(res);
                this.setState({username: user.name});
                this.setState({email: user.email});
            })
            .catch(function(ex) {console.log('FAIL: ', ex)})
    }

    logout(e) {
        e.preventDefault();
        let result = fetch(configuration.api_host + '/logout',
            {
                mode: "cors",
                credentials: "include"
            })
        result.then((response) => {return response.text()})
            .then((res) => {
                window.location.reload();
            })
            .catch(function(ex) {console.log('FAIL: ', ex)})
    }

    render() {
        return (
            <div className="home">
                <h2>Welcome, {this.state.username}!</h2>
                <h3>In this application you can:</h3>
                <ul>
                    <a href="#/songs"><Glyphicon glyph="music"/>Manage and play songs </a><br/>
                    <a href="#/playlists"><Glyphicon glyph="th-list"/>Manage and listen playlists </a><br/>
                    <a href="#/user"><Glyphicon glyph="user"/>Edit your user profile </a><br/>
                    <a href="#" onClick={this.logout}><Glyphicon glyph="log-out"/>Log out</a><br/>
                </ul>
            </div>
        );
    }
}

export default Home;
