import React, { Component } from 'react';
import './home.css';
import configuration from '../conf.js'

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

    render() {
        return (
            <div className="home">
                <h2>Welcome, {this.state.username}!</h2>
                <h3>In this application you can:</h3>
                <ul>
                    <li>Manage and play songs <a href="#/songs">here</a></li>
                    <li>Manage and listen playlists <a href="#/playlists">here</a></li>
                    <li>Edit your user profile <a href="#/user">here</a></li>
                    <li>Log out <a href="logout">here</a></li>
                </ul>
            </div>
        );
    }
}

export default Home;
