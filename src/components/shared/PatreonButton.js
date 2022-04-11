import React from 'react';
import styled from 'styled-components/macro';
import { NavLink as RRNavLink } from 'react-router-dom';
import { NavLink } from 'reactstrap';

const Wrapper = styled.div`
  padding-top: 1rem;
  padding-bottom: 1rem;
`;

const StyledLinkButton = styled( NavLink )`
  display: inline-block;
  background: rgba(255, 0, 0, 0.863);
  color: whitesmoke;
  text-align: center;
  align-items: center;
  justify-content: center;
  margin: 0;
  font-weight: 500;
  font-size: 1.25em;
  line-height: 1.2rem;
`;

export default function PatreonButton() {
  return (
    <Wrapper>
      {/* <StyledLinkButton href="https://patreon.com/saiastrange" className="btn">
        SUPPORT US ON PATREON<br/>
        <small>REMOVES ADS</small><br/>
      </StyledLinkButton> */}

      <StyledLinkButton tag={RRNavLink} exact to="/login" className="btn">
        Log In for Access
      </StyledLinkButton>
    </Wrapper>
  );
}
