import React from 'react';
import styled from 'styled-components/macro';
import { NavLink as RRNavLink } from 'react-router-dom';
import { NavLink } from 'reactstrap';

const StyledLinkButton = styled( NavLink )`
  display: inline-block;
  background: rgba(255, 0, 0, 0.863);
  color: whitesmoke;
  text-align: center;
  align-items: center;
  justify-content: center;
  height: 50%;
  font-weight: 500;
  font-size: .7rem;
  padding: .25rem;

  @media only screen and (min-width:600px) {
    font-size: .75rem;
  }
  
  @media only screen and (min-width:768px) {
    font-size: 1rem;
  }
`;

export default function PatreonSortButton() {
  return (
  // <StyledLinkButton href="https://patreon.com/saiastrange" className="btn col-12">
  //   Filtering Options for Patrons
  // </StyledLinkButton>

    <StyledLinkButton className="btn col-12" tag={RRNavLink} exact to="/login">Log In for Filtering Options</StyledLinkButton>
  );
}
