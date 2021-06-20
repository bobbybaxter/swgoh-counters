import React, { memo, useContext, useState } from 'react';
import styled from 'styled-components/macro';
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
import { AuthContext } from 'src/contexts/userContext';

export const NavbarWrapper = styled.div`
  display: block;
  background-color: #9B47E433;
  box-shadow: inset 4px 4px 15px rgba(255, 255, 255, 0.1), inset -4px -4px 15px rgba(255, 255, 255, 0.1);
`;

export const NavDivider = styled.span`
  border-left: 1px solid #6c757d;
  margin-left: 1em;
  margin-right: 1em;
`;

const MyNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { admin, authenticated, handleLogout } = useContext(AuthContext);

  const toggle = () => setIsOpen(!isOpen);

  const handleNavLogout = e => {
    e.preventDefault();
    firebase.auth().signOut();
    handleLogout();
  };

  const selectLoginOrLogout = authenticated
    ? (
      <NavItem>
        <NavLink href="#" onClick={handleNavLogout}>Logout</NavLink>
      </NavItem>
    )
    : (
      <NavItem>
        <NavLink tag={RRNavLink} exact to="/login">Login</NavLink>
      </NavItem>
    );

  return (
      <NavbarWrapper>
        <Navbar dark expand="md">
          <NavbarBrand>SWGOH Counters</NavbarBrand>
          <NavbarToggler onClick={toggle} />
          <Collapse isOpen={isOpen} navbar>
            <Nav className="ml-auto text-center" navbar>
              <NavItem>
                <NavLink tag={RRNavLink} exact to="/">5v5</NavLink>
              </NavItem>
              <NavItem>
                <NavLink tag={RRNavLink} to="/3v3">3v3</NavLink>
              </NavItem>

              <NavDivider />

              <NavItem>
                <NavLink href="https://patreon.com/saiastrange">Patreon</NavLink>
              </NavItem>
              <NavItem>
                <NavLink href="https://discord.gg/eCnE48h">Discord</NavLink>
              </NavItem>
              <NavItem>
                <NavLink href="https://github.com/bobbybaxter/swgoh-counters/wiki">Wiki</NavLink>
              </NavItem>
              <NavItem>
                <NavLink href="https://github.com/bobbybaxter/swgoh-counters/wiki/Frequently-Asked-Questions-(FAQ)">FAQ</NavLink>
              </NavItem>

              <NavDivider />

              { !authenticated ? '' : (
                <NavItem>
                  <NavLink tag={RRNavLink} to="/account">Account</NavLink>
                </NavItem>
              ) }

              { !admin ? '' : (
                <NavItem>
                  <NavLink tag={RRNavLink} to="/admin">Admin</NavLink>
                </NavItem>
              )}

              {selectLoginOrLogout}
            </Nav>
          </Collapse>
        </Navbar>
      </NavbarWrapper>
  );
};

export default memo(MyNavbar);
