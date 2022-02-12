import React from 'react';
import { Button } from 'reactstrap';
import styled from 'styled-components/macro';

const StyledCharBtn = styled( Button )`
  display: flex;
  align-items: center;
  background-color: transparent;
  border-color: transparent;
  margin: 0 .25rem .25rem .25rem;
  padding: 0;
  width: 55px;
  flex-flow: column wrap;
  text-align: center;
  align-items: auto;
  @media only screen and (min-width:768px) {
    width: 55px;
  }
  @media only screen and (min-width:992px) {
    width: 65px;
  }
  @media only screen and (min-width:1200px) {
    width: 75px;
  }
`;

export default function CharacterPoolBtn( { isCompact, ...props } ) {
  return <StyledCharBtn $isCompact={isCompact} {...props}>{props.children}</StyledCharBtn>;
}
