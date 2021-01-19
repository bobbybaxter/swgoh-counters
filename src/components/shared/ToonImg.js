import React from 'react';
import styled from 'styled-components/macro';
import PropTypes from 'prop-types';

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

// @media only screen and (min-width:768px) {
//   width: ${props => (props.$isCompact ? '35px' : '45px')};
//   height: ${props => (props.$isCompact ? '35px' : '45px')};
// }

// @media only screen and (min-width:992px) {
//   width: ${props => (props.$isCompact ? '35px' : '55px')};
//   height: ${props => (props.$isCompact ? '35px' : '55px')};
// }

// @media only screen and (min-width:1200px) {
//   width: ${props => (props.$isCompact ? '35px' : '65px')};
//   height: ${props => (props.$isCompact ? '35px' : '65px')};

export default function ToonImg({ isCompact, ...props }) {
  ToonImg.propTypes = {
    isCompact: PropTypes.bool,
  };

  ToonImg.defaultProps = {
    isCompact: false,
  };

  return (
    <StyledToonImg $isCompact={isCompact} {...props} />
  );
}
