import React from 'react';
import styled from 'styled-components/macro';
import PropTypes from 'prop-types';

const StyledToonImg = styled.img`
  cursor: ${props => (props.$isClickable ? 'pointer' : 'auto')};
  width: ${props => (props.$isCompact ? '27px' : '35px')};
  height: ${props => (props.$isCompact ? '27px' : '35px')};
  border-radius: 50%;
  margin: ${props => (props['no-margin'] ? '0' : '0 2.5px')};
  border: ${props => (props.$isCompact ? '1px' : '2px')} solid;
  border-color: ${props => (props.color ? props.color : 'gray')};
  }};

  @media only screen and (min-width:768px) {
    width: ${props => (props.$isCompact ? '37px' : '45px')};
    height: ${props => (props.$isCompact ? '37px' : '45px')};
  }

  @media only screen and (min-width:992px) {
    width: ${props => (props.$isCompact ? '47px' : '55px')};
    height: ${props => (props.$isCompact ? '47px' : '55px')};
  }

  @media only screen and (min-width:1200px) {
    width: ${props => (props.$isCompact ? '57px' : '65px')};
    height: ${props => (props.$isCompact ? '57px' : '65px')};
  }
`;

export default function ToonImg({ isClickable, isCompact, ...props }) {
  ToonImg.propTypes = {
    isClickable: PropTypes.bool,
    isCompact: PropTypes.bool,
  };

  ToonImg.defaultProps = {
    isClickable: false,
    isCompact: false,
  };

  return (
    <StyledToonImg $isClickable={isClickable} $isCompact={isCompact} {...props} />
  );
}
