import React, { useState } from 'react';
import { NavLink as RRNavLink } from 'react-router-dom';
import {
  Collapse,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  UncontrolledDropdown,
} from 'reactstrap';
// import firebase from 'firebase/app';
// import 'firebase/auth';

import './MyNavbar.scss';

export default function MyNavbar(props) {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen(!isOpen);

  // const handleLogin = (e) => {
  //   e.preventDefault();
  //   const provider = new firebase.auth.GoogleAuthProvider();
  //   provider.setCustomParameters({
  //     prompt: 'select_account',
  //   });
  //   firebase.auth().signInWithRedirect(provider);
  // };

  // const handleLogout = (e) => {
  //   e.preventDefault();
  //   localStorage.removeItem('userData');
  //   localStorage.removeItem('userUnits');
  //   sessionStorage.setItem('token', '');
  //   firebase.auth().signOut();
  //   props.handleLogout();
  // };

  // const selectLoginOrLogout = props.authenticated
  //   ? (
  //     <NavItem>
  //       <NavLink href="#" onClick={handleLogout}>Logout</NavLink>
  //     </NavItem>
  //   )
  //   : (
  //     <NavItem>
  //       <NavLink href="#" onClick={handleLogin}>Login</NavLink>
  //     </NavItem>
  //   );

  // TODO: Add proptypes
  // TODO: Add tests
  return (
      <div className="MyNavbar">
        <Navbar color="dark" dark expand="md">
          <NavbarBrand>SWGOH Counters</NavbarBrand>
          <NavbarToggler onClick={toggle} />
          <Collapse isOpen={isOpen} navbar>
            <Nav className="ml-auto text-center" navbar>
              <NavItem>
                <NavLink tag={RRNavLink} exact to="/">5v5</NavLink>
              </NavItem>
              <NavItem>
                <NavLink tag={RRNavLink} to="/3v3/">3v3</NavLink>
              </NavItem>
              {/* { !props.authenticated ? '' : (
                <NavItem>
                  <NavLink tag={RRNavLink} to="/profile">Profile</NavLink>
                </NavItem>
              ) } */}
              <UncontrolledDropdown nav inNavbar>
                <DropdownToggle nav caret>Links</DropdownToggle>
                <DropdownMenu right>
                  <DropdownItem tag={RRNavLink} to="/submit">Submit Issue</DropdownItem>
                  <DropdownItem href="https://patreon.com/saiastrange">Patreon</DropdownItem>
                  <DropdownItem href="https://discord.gg/eCnE48h">Discord</DropdownItem>
                  <DropdownItem href="https://github.com/bobbybaxter/swgoh-counters/wiki">Wiki</DropdownItem>
                </DropdownMenu>
              </UncontrolledDropdown>
              {/* {selectLoginOrLogout} */}
            </Nav>
          </Collapse>
        </Navbar>
      </div>
  );
}
