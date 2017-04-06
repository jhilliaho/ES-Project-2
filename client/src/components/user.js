import React, { Component } from 'react';
import './user.css';
import { FormGroup, ControlLabel, FormControl, Row, Col, HelpBlock} from 'react-bootstrap';
import configuration from '../conf.js'


function FieldGroup({ id, label, help, ...props }) {
    return (
        <FormGroup controlId={id}>
            <ControlLabel>{label}</ControlLabel>
            <FormControl {...props} />
            {help && <HelpBlock>{help}</HelpBlock>}
        </FormGroup>
    );
}

class User extends Component {
    constructor() {
        super();
        this.fetchUser();
        this.state = {'username': "",'email': "",'password':"********"};
        this.deleteUser = this.deleteUser.bind(this);
        this.updateUser = this.updateUser.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    validateEmail(email) {
        var re = /[^@]+@[^@]+\.[^@]+/;
        return re.test(email);
    }

    updateUser(e) {
        console.log("Update user");
        e.preventDefault();

        let good_email = this.validateEmail(this.state["email"]);

        if (!good_email) {
            alert("Email is not acceptable");
            return;
        }

        let data = new FormData();

        data.append("name", this.state["username"]);
        data.append("email", this.state["email"]);

        fetch(configuration.api_host + '/api/user', {
            method: "PUT",
            mode: "cors",
            credentials: "include",
            body: data,
        }).then((response) => {
            console.log(response)
            window.location = '/';
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
        if (!confirm("Do you really want to remove the user?")) {
            return;
        }
        let result = fetch(configuration.api_host + '/api/user',
            {
                mode: "cors",
                credentials: "include",
                method:"DELETE"
            }
        );

        result.then((res) => {
                window.location = '/login'
            }
        )
    }

    handleChange(e) {
        console.log("Changing", e.currentTarget.name, e.currentTarget.value)
        e.preventDefault();
        this.setState({[e.currentTarget.name]:e.currentTarget.value});
    }

    render() {
        return (
            <div className="user">
			    <div className="container">
			        <div className="row">
			            <div className="col-xs-12 col-sm-8 col-sm-offset-2 col-md-6 col-md-offset-3 col-lg-4 col-lg-offset-4 well">
			                <h3>Welcome to your profile!</h3>
                			<form>

                                <FieldGroup
                                    type="text"
                                    label="Name"
                                    name="username"
                                    placeholder="Enter a new name"
                                    onChange={this.handleChange}
                                    value={this.state["username"]}
                                />
                                <FieldGroup
                                    type="email"
                                    label="Email"
                                    name="email"
                                    placeholder="Enter email"
                                    onChange={this.handleChange}
                                    value={this.state["email"]}
                                />
		                    </form>
                            <Row>
                                <Col xs={12} sm={6}><button className="btn btn-primary" onClick={this.updateUser}>Submit changes</button></Col>
                                <Col xs={12} sm={6}><button className="btn btn-danger pull-right" onClick={this.deleteUser}>Delete Account</button></Col>
                            </Row>
                        </div>
			        </div>
			    </div>
            </div>
        );
    }
}

export default User;
