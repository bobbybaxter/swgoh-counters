import React from 'react';
import { Button } from 'reactstrap';
import styled from 'styled-components/macro';

const StyledCharBtn = styled(Button)`
  display: flex;
  align-items: center;
  background-color: transparent;
  border-color: transparent;
  margin: 0 .25rem .25rem .25rem;
  padding: 0;
  width: ${props => (props.$isRow ? '55px' : '65px')};
  flex-flow: ${props => (props.$isRow ? 'column wrap' : 'row nowrap')};
  text-align: ${props => (props.$isRow ? 'center' : 'left')};
  align-items: ${props => (props.$isRow ? 'auto' : 'center')};

  @media only screen and (min-width:768px) {
    width: ${props => (props.$isRow ? '55px' : 'auto')};
  }

  @media only screen and (min-width:992px) {
    width: ${props => (props.$isRow ? '65px' : 'auto')};
  }

  @media only screen and (min-width:1200px) {
    width: ${props => (props.$isRow ? '75px' : 'auto')};
  }
`;

export default function CharacterPoolBtn({ isRow, ...props }) {
  return <StyledCharBtn $isRow={isRow} {...props}>{props.children}</StyledCharBtn>;
}
