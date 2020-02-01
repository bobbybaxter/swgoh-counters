import React from 'react';
import firebase from 'firebase/app';
import 'firebase/auth';
import { NavLink as RRNavLink } from 'react-router-dom';
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
} from 'reactstrap';

import './MyNavbar.scss';

class MyNavbar extends React.Component {
  state = {
    isOpen: false,
  }

  logoutClickEvent = (e) => {
    e.preventDefault();
    firebase.auth().signOut();
  }

  toggle = () => {
    this.setState({
      isOpen: !this.state.isOpen,
    });
  }

  render() {
    const { authenticated } = this.props;

    return (
      <div className="MyNavbar">
        <Navbar color="dark" dark expand="md">
          <NavbarBrand>SWGOH Counters</NavbarBrand>
          <NavbarToggler onClick={this.toggle} />
          <Collapse isOpen={this.state.isOpen} navbar>
            <Nav className="ml-auto text-center" navbar>
              <NavItem>
                <NavLink tag={RRNavLink} to="/5v5">5v5</NavLink>
              </NavItem>
              {
                authenticated === true
                  ? <NavItem>
                      <NavLink tag={RRNavLink} to="/3v3">3v3</NavLink>
                    </NavItem>
                  : ''
              }
              <NavItem>
                <NavLink href="https://discord.gg/eCnE48h">Discord</NavLink>
              </NavItem>
              <NavItem>
                <NavLink href="https://patreon.com/saiastrange">Patreon</NavLink>
              </NavItem>
              <NavItem>
                <NavLink href="https://github.com/bobbybaxter/swgoh-counters/wiki">Wiki</NavLink>
              </NavItem>
              {
                authenticated === false
                  ? <NavItem>
                      <NavLink tag={RRNavLink} to="/auth">Login</NavLink>
                    </NavItem>
                  : <NavItem>
                      <NavLink href="#" onClick={this.logoutClickEvent}>Logout</NavLink>
                    </NavItem>
              }
            </Nav>
          </Collapse>
        </Navbar>
      </div>
    );
  }
}

export default MyNavbar;
