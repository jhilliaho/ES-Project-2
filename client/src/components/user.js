import React, { Component } from 'react';
import './user.css';
import configuration from '../conf.js'

class User extends Component {
    constructor() {
        super()
        this.fetchUser();
        this.state = {'username': "",'email': "",'password':"********"}
        this.deleteUser = this.deleteUser.bind(this);
        this.updateUser = this.updateUser.bind(this);
    }

    updateUser(e) {
        console.log("Update user")
        e.preventDefault();

        let data = new FormData();

        data.append("name", this.refs.name.value);
        data.append("email", this.refs.email.value);

        fetch(configuration.api_host + '/api/user', {
            method: "PUT",
            mode: "cors",
            credentials: "include",
            body: data,
        }).then((response) => {
            console.log(response)
        })
    }

    fetchUser() {

        let result = fetch(configuration.api_host + '/api/user',
            {
                mode: "cors",
                credentials: "include"
            })
        result.then((response) => {return response.text()})
            .then((res) => {
                let user = JSON.parse(res)
                this.setState({username: user.name});
                this.setState({email: user.email});
            })
            .catch(function(ex) {console.log('FAIL: ', ex)})
    }

    deleteUser(){
        fetch(configuration.api_host + '/api/user',
            {
                mode: "cors",
                credentials: "include",
                method:"DELETE"
            }).then(
                window.location.reload()
            )

    }

    render() {
        return (
            <div className="user">
			    <div className="container">
			        <div className="row">
			            <div className="col-xs-12 col-sm-8 col-sm-offset-2 col-md-6 col-md-offset-3 col-lg-4 col-lg-offset-4 well">
			                <h3>Welcome to your profile!</h3>
                			<form>
				                <div className="form-group">
			                        <label htmlFor="userName" autoFocus>Name</label>
			                        <input ref="name" type="text" name="name" className="form-control" id="userName" placeholder={this.state.username}/>
			                    </div>
			                    <div className="form-group">
			                        <label htmlFor="userEmail">Email address</label>
			                        <input ref="email" type="email" name="email" className="form-control" id="userEmail" aria-describedby="emailHelp" placeholder={this.state.email}/>
			                    </div>
			                    <div className="form-group">
			                        <label htmlFor="userPassword">Password</label>
			                        <input ref="password" disabled type="password" name="password" className="form-control" id="userPassword" placeholder={this.state.password}/>
			                    </div>
			                    <button className="btn btn-primary" onClick={this.updateUser}>Submit changes</button>
		                    </form>
                            <button className="btn btn-danger" onClick={this.deleteUser}>Delete Account</button>
			            </div>
			        </div>
			    </div>
            </div>
        );
    }
}

export default User;
