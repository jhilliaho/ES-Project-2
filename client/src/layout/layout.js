import React, { Component } from 'react';
import { Nav, Navbar, NavItem, NavDropdown, MenuItem} from 'react-bootstrap';
import { Link } from 'react-router'
import { LinkContainer } from 'react-router-bootstrap';
import './layout.css';

// Use react-router-bootstrap wrapper in navbar:
// http://stackoverflow.com/questions/35687353/react-bootstrap-link-item-in-a-navitem
// This navbar includes the links to different modules.
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
                    <NavDropdown eventKey={3} title="<username>" id="basic-nav-dropdown">
                        <LinkContainer to="/user">
                            <MenuItem eventKey={3.1}>Profile</MenuItem>
                        </LinkContainer>

                        <MenuItem divider />

                        <MenuItem href="/logout" eventKey={3.4}>Log out</MenuItem>
                    </NavDropdown>
                </Nav>
            </Navbar>
            {this.props.children}
        </span>
    );
  }
}

export default Layout;
