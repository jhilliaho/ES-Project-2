import React, { Component } from 'react';
import { Nav, Navbar, NavItem, NavDropdown, MenuItem} from 'react-bootstrap';
import { Link } from 'react-router'
import { LinkContainer } from 'react-router-bootstrap';
import './layout.css';

// Use react-router-bootstrap wrapper in navbar:
// http://stackoverflow.com/questions/35687353/react-bootstrap-link-item-in-a-navitem
// This navbar includes the links to different modules.
class Layout extends Component {
    constructor() {
      super()
        this.fetchUsername();
      this.state = {'username': ""}
    }

    fetchUsername() {

        let result = fetch('http://localhost:3001/api/test', {mode: "cors", credentials: "include"
        })
        result.then((response) => {
            return response.text()
        }).then((text) => {
            console.log("WE GOT ", text)
            this.setState({username: text});

        }).catch(function(ex) {
            console.log('FAIL: ', ex)
        })
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
                    <NavDropdown title={this.state.username} id="basic-nav-dropdown">
                        <LinkContainer to="/user">
                            <MenuItem>Profile</MenuItem>
                        </LinkContainer>

                        <MenuItem divider />

                        <MenuItem href="/logout">Log out</MenuItem>
                    </NavDropdown>
                </Nav>
            </Navbar>
            {this.props.children}
        </span>
    );
  }
}

export default Layout;
