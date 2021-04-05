import React from 'react';
import styled from 'styled-components/macro';
import PropTypes from 'prop-types';

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const StyledLinkButton = styled.a`
  display: inline-block;
  background: rgba(255, 0, 0, 0.863);
  color: whitesmoke;
  text-align: center;
  align-items: center;
  justify-content: center;
  margin: 0 2.5px;
  font-weight: 500;
  font-size: .8rem;
  padding: .25rem;

  @media only screen and (min-width:768px) {
    font-size: .9rem;
  }

  @media only screen and (min-width:992px) {
    font-size: 1rem;
  }

  @media only screen and (min-width:1200px) {
    font-size: 1.2rem;
  }
`;

export default function PatreonRowButton({
  amount,
}) {
  PatreonRowButton.propTypes = {
    amount: PropTypes.number.isRequired,
  };

  return (
    <Wrapper>
      <StyledLinkButton href="https://patreon.com/saiastrange" className="btn">
        {amount} more {amount > 1 ? 'counters' : 'counter'}<br/>
        for Patrons
      </StyledLinkButton>
    </Wrapper>
  );
}
