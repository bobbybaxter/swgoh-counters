import React, { useState } from 'react';
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
import firebase from 'firebase/app';
import 'firebase/auth';

import './MyNavbar.scss';

export default function MyNavbar(props) {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen(!isOpen);

  const handleLogin = (e) => {
    e.preventDefault();
    const provider = new firebase.auth.GoogleAuthProvider();
    return firebase.auth().signInWithPopup(provider).then((cred) => {
      // get token from Firebase and save it to session storage
      cred.user.getIdToken()
        .then(token => sessionStorage.setItem('token', token));
    });
  };

  const handleLogout = (e) => {
    e.preventDefault();
    firebase.auth().signOut();
  };

  const selectLoginOrLogout = props.authenticated
    ? (
      <NavItem>
        <NavLink href="#" onClick={handleLogout}>Logout</NavLink>
      </NavItem>
    )
    : (
      <NavItem>
        <NavLink href="#" onClick={handleLogin}>Login</NavLink>
      </NavItem>
    );

  return (
      <div className="MyNavbar">
        <Navbar color="dark" dark expand="md">
          <NavbarBrand>SWGOH Counters</NavbarBrand>
          <NavbarToggler onClick={toggle} />
          <Collapse isOpen={isOpen} navbar>
            <Nav className="ml-auto text-center" navbar>
              <NavItem>
                <NavLink tag={RRNavLink} to="/5v5">5v5</NavLink>
              </NavItem>
              <NavItem>
                <NavLink tag={RRNavLink} to="/3v3/">3v3</NavLink>
              </NavItem>
              <NavItem>
                <NavLink tag={RRNavLink} to="/profile">Profile</NavLink>
              </NavItem>
              <NavItem>
                <NavLink tag={RRNavLink} to="/submit">Submit Issue</NavLink>
              </NavItem>
              <NavItem>
                <NavLink href="https://patreon.com/saiastrange">Patreon</NavLink>
              </NavItem>
              <NavItem>
                <NavLink href="https://discord.gg/eCnE48h">Discord</NavLink>
              </NavItem>
              <NavItem>
                <NavLink href="https://github.com/bobbybaxter/swgoh-counters/wiki">Wiki</NavLink>
              </NavItem>
              {selectLoginOrLogout}
            </Nav>
          </Collapse>
        </Navbar>
      </div>
  );
}
