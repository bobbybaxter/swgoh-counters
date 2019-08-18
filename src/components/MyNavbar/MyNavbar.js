import React from 'react';
import {
  // Collapse,
  Navbar,
  // NavbarToggler,
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

  toggle = () => {
    this.setState({
      isOpen: !this.state.isOpen,
    });
  }

  render() {
    return (
      <div className="MyNavbar">
        <Navbar color="dark" dark expand="md">
          <NavbarBrand>SWGOH Counters</NavbarBrand>
          <Nav className="ml-auto" navbar>
            <NavItem>
              <NavLink href="https://docs.google.com/forms/d/e/1FAIpQLSetDRLSGQHCNcw1iCKhNbmouBiOg1dseSBERJNGR5OORFx-lQ/viewform?embedded=true">Submit an Issue</NavLink>
            </NavItem>
            {/* <NavItem>
              <NavLink href="/counters5v5">5v5</NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="/3v3">3v3</NavLink>
            </NavItem> */}
          </Nav>
          {/* <NavbarToggler onClick={this.toggle} />
          <Collapse isOpen={this.state.isOpen} navbar>
            <Nav className="ml-auto" navbar>
              <NavItem>
                <NavLink href="/5v5/">5v5</NavLink>
              </NavItem>
              <NavItem>
                <NavLink href="/3v3/">3v3</NavLink>
              </NavItem>
            </Nav>
          </Collapse> */}
        </Navbar>
      </div>
    );
  }
}

export default MyNavbar;
