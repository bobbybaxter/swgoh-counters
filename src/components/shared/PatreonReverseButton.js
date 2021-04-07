import React from 'react';
import styled from 'styled-components/macro';

const StyledLinkButton = styled.a`
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

export default function PatreonRowButton() {
  return (
    <StyledLinkButton href="https://patreon.com/saiastrange" className="btn col-2">
      Reverse View<br/>
      for Patrons
    </StyledLinkButton>
  );
}
