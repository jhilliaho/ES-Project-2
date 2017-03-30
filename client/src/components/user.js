import React, { Component } from 'react';
import './user.css';

class User extends Component {
    constructor() {
        super()
        this.fetchUser();
        this.state = {'username': "",'email': "",'password':"********"}
        this.deleteUser = this.deleteUser.bind(this);
    }

    fetchUser() {

        let result = fetch('/api/user', {mode: "cors", credentials: "include"})
        result.then((response) => {return response.text()})
            .then((res) => {
                let user = JSON.parse(res)
                this.setState({username: user.name});
                this.setState({email: user.email});
            })
            .catch(function(ex) {console.log('FAIL: ', ex)})
    }

    deleteUser(){
        fetch('/api/user', {mode: "cors", credentials: "include",method:"DELETE"}).then(
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
                			<form method="POST" encType="multipart/form-data" action="/api/user">
				                <div className="form-group">
			                        <label htmlFor="userName" autofocus>Name</label>
			                        <input type="text" name="name" className="form-control" id="userName" placeholder={this.state.username}/>
			                    </div>
			                    <div className="form-group">
			                        <label htmlFor="userEmail">Email address</label>
			                        <input type="email" name="email" className="form-control" id="userEmail" aria-describedby="emailHelp" placeholder={this.state.email}/>
			                    </div>
			                    <div className="form-group">
			                        <label htmlFor="userPassword">Password</label>
			                        <input disabled type="password" name="password" className="form-control" id="userPassword" placeholder={this.state.password}/>
			                    </div>
			                    <button className="btn btn-primary">Submit changes</button>
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
