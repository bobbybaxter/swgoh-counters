import React from 'react';
import { Button } from 'reactstrap';
import styled from 'styled-components/macro';
import { BsFillLockFill } from 'react-icons/bs';

const LeaderLockBtn = styled(Button)`
  &,
  &.focus, 
  &:focus,
  &.hover,
  &:hover,
  &:disabled,
  &:not(:disabled):not(.disabled),
  &:not(:disabled):not(.disabled).active,
  &:not(:disabled):not(.disabled):active {
    color: black !important;
    background-color: transparent;
    border-color: transparent;
    box-shadow: none;
    cursor: initial !important;
    padding-top: 0;
    // padding-bottom: 0;
`;


const StyledLockBtn = styled(Button)`
  &,
  &:not(:disabled):not(.disabled),
  &:not(:disabled):not(.disabled).active,
  &:not(:disabled):not(.disabled):active {
    background-color: transparent;
    border-color: transparent !important;
    color: ${props => (props.$isOn ? '#FFFFFF' : '#2C2C2C')};
    padding-top: 0;
  }

  &.hover,
  &:hover {
    color: #808080;
    background-color: transparent;
  }

  &.focus, 
  &:focus {
    color: #4b4b4b;
    background-color: transparent;
    border-color: transparent;
    box-shadow: none;
  }
`;

const StyledLockImg = styled.span`
  position: absolute;
  bottom: -1px;
  right: 0;
  color: white;
  background-color: transparent;
  border-color: transparent;
`;

export const LockBtn = ({ isOn, index, ...props }) => (
  index === 0
    ? <LeaderLockBtn disabled><BsFillLockFill title="Placeholder" alt="Placeholder" /></LeaderLockBtn>
    : <StyledLockBtn
          color="link"
          $isOn={isOn}
          {...props}
        >
          <BsFillLockFill title="Required Character" alt="Required Character" />
        </StyledLockBtn>
);

export const LockImg = () => <StyledLockImg><BsFillLockFill className="toonLock" title="Required Character" alt="Required Character" /></StyledLockImg>;
