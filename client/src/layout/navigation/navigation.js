import React, { Component } from 'react';
import Nav from 'react-bootstrap/lib/Nav';
import Navbar from 'react-bootstrap/lib/Navbar';
import NavItem from 'react-bootstrap/lib/NavItem';
import NavDropdown from 'react-bootstrap/lib/NavDropdown';
import MenuItem from 'react-bootstrap/lib/MenuItem';

import './navigation.css';

class NavigationBar extends Component {
  render() {
    return (
        <Navbar>
            <Navbar.Header>
                <Navbar.Brand>
                    <a href="#">App name</a>
                </Navbar.Brand>
            </Navbar.Header>
            <Nav>
                <NavItem eventKey={1} href="#">Users</NavItem>
                <NavItem eventKey={2} href="#">Playlists</NavItem>
                <NavItem eventKey={2} href="#">Songs</NavItem>
                <NavDropdown eventKey={3} title="npm user name" id="basic-nav-dropdown">
                    <MenuItem eventKey={3.1}>Profile</MenuItem>
                    <MenuItem divider />
                    <MenuItem eventKey={3.4}>Log out</MenuItem>
                </NavDropdown>
            </Nav>
        </Navbar>
    );
  }
}

export default NavigationBar;
