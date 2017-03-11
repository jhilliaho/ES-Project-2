import React, { Component } from 'react';
import { Nav, Navbar, NavItem, NavDropdown, MenuItem} from 'react-bootstrap';
import { Link } from 'react-router'
import { LinkContainer } from 'react-router-bootstrap';
import './layout.css';

// Use react-router-bootstrap wrapper in navbar:
// http://stackoverflow.com/questions/35687353/react-bootstrap-link-item-in-a-navitem

class Layout extends Component {
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
                    <LinkContainer to="/login">
                        <NavItem eventKey={1}>Login</NavItem>
                    </LinkContainer>

                    <LinkContainer to="/register">
                        <NavItem eventKey={2}>Register</NavItem>
                    </LinkContainer>

                    <NavDropdown eventKey={3} title="<username>" id="basic-nav-dropdown">
                        <LinkContainer to="/user">
                            <MenuItem eventKey={3.1}>Profile</MenuItem>
                        </LinkContainer>

                        <MenuItem divider />

                        <LinkContainer to="/logout">
                            <MenuItem eventKey={3.4}>Log out</MenuItem>
                        </LinkContainer>
                    </NavDropdown>
                </Nav>
            </Navbar>
            {this.props.children}
        </span>
    );
  }
}

export default Layout;
