import React from 'react';
import styled from 'styled-components';

const StyledToonImg = styled.img`
  width: 35px;
  height: 35px;
  border-radius: 50%;
  margin: ${props => (props['no-margin'] ? '0' : '0 2.5px')};
  border: 2px solid ${props => (props.color ? props.color : 'gray')};
  }};

  @media only screen and (min-width:768px) {
    width: 45px;
    height: 45px;
  }

  @media only screen and (min-width:992px) {
    width: 55px;
    height: 55px;
  }

  @media only screen and (min-width:1200px) {
    width: 65px;
    height: 65px;
  }
`;

export default function ToonImg(props) {
  return (
    <StyledToonImg {...props} />
  );
}
