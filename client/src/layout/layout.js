import React, { Component } from 'react';
import { Nav, Navbar, NavItem, NavDropdown, MenuItem} from 'react-bootstrap';
import { Link } from 'react-router';
import { LinkContainer } from 'react-router-bootstrap';
import {Grid, Row, Col} from 'react-bootstrap';
import './layout.css';

// Use react-router-bootstrap wrapper in navbar:
// http://stackoverflow.com/questions/35687353/react-bootstrap-link-item-in-a-navitem
// This navbar includes the links to different modules.
class Layout extends Component {
    constructor() {
        super();
        this.state = {'username': ""}
        this.fetchUser();
    }

    fetchUser() {

        let result = fetch('http://localhost:3001/api/user', {mode: "cors", credentials: "include"})
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
        <span>
            <Navbar>
                <Navbar.Header>
                    <Navbar.Text>
                        <Link to="/">App name</Link>
                    </Navbar.Text>
                </Navbar.Header>

                <Nav>
                    <NavItem href="#/songs">Songs</NavItem>
                    <NavItem href="#/playlists">Playlists</NavItem>

                    <NavDropdown title={this.state.username} id="basic-nav-dropdown">
                        <LinkContainer to="/user">
                            <MenuItem>Profile</MenuItem>
                        </LinkContainer>

                        <MenuItem divider />

                        <MenuItem href="/logout">Log out</MenuItem>
                    </NavDropdown>
                </Nav>
            </Navbar>
            <Grid>
                <Row className="show-grid">
                    <Col sm={12}>
                        {this.props.children}
                    </Col>
                </Row>
            </Grid>


        </span>
    );
  }
}

export default Layout;
