import React, { Component } from 'react';
import './user.css';

class User extends Component {
    constructor() {
        super()
        this.fetchUser();
        this.state = {'username': "",'email': "",'password':"********"}

	    // This binding is necessary to make `this` work in the callback
	    this.submit = this.submit.bind(this);
	    this.changeName = this.changeName.bind(this);
    }

	submit(){
		let data = {}
		data.name = this.state.username
		fetch('http://localhost:3001/api/user?name='+data.name, {
			method: 'POST',
			mode: "cors",
			credentials: "include"
		})
	}

	changeName(event){
		this.setState({username: event.target.value});
	}

    fetchUser() {

        let result = fetch('http://localhost:3001/api/user', {mode: "cors", credentials: "include"})
        result.then((response) => {return response.text()})
            .then((res) => {
                let user = JSON.parse(res)
                this.setState({username: user.name});
                this.setState({email: user.email});
            })
            .catch(function(ex) {console.log('FAIL: ', ex)})
    }

    render() {
        return (
            <div className="user">
			    <div className="container">
			        <div className="row">
			            <div className="col-xs-12 col-sm-8 col-sm-offset-2 col-md-6 col-md-offset-3 col-lg-4 col-lg-offset-4 well">
			                <h3>Welcome to your profile!</h3>
			                <div className="form-group">
		                        <label htmlFor="userName">Name</label>
		                        <input type="text" name="name" className="form-control" id="userName" placeholder={this.state.username} onChange={this.changeName}/>
		                    </div>
		                    <div className="form-group">
		                        <label htmlFor="userEmail">Email address</label>
		                        <input disabled type="email" name="email" className="form-control" id="userEmail" aria-describedby="emailHelp" placeholder={this.state.email}/>
		                    </div>
		                    <div className="form-group">
		                        <label htmlFor="userPassword">Password</label>
		                        <input disabled type="password" name="password" className="form-control" id="userPassword" placeholder={this.state.password}/>
		                    </div>
		                    <button onClick={this.submit} className="btn btn-primary">Submit changes</button>
			            </div>
			        </div>
			    </div>
            </div>
        );
    }
}

export default User;
