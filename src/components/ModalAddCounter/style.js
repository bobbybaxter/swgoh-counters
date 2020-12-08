import React from 'react';
import styled from 'styled-components/macro';
import {
  Form, FormGroup, Modal, ModalBody, ModalFooter, ModalHeader,
} from 'reactstrap';

const ReactstrapModalAdapter = ({ className, centered, ...props }) => (
  <Modal
    centered={true}
    className={className}
    {...props}
  />
);

export const FormLeftSide = styled.div`
  display: flex;
  flex-direction: column;
  overflow: initial;
  width: 100%;
  padding-right: 15px;
  padding-left: 15px;

  @media only screen and (min-width:768px) {
    overflow: hidden;
    flex: 0 0 50%;
    max-width: 50%;
  }
`;

export const FormRightSide = styled.div`
  display: flex;
  flex-direction: column;
  overflow: initial;
  width: 100%;
  padding-right: 15px;
  padding-left: 15px;

  @media only screen and (min-width:768px) {
    overflow: scroll;
    flex: 0 0 50%;
    max-width: 50%;
  }
`;

export const FormStrategy = styled(FormGroup)`
  display: flex;
  flex-direction: column;
  margin-bottom: 0;
  padding-top: 1rem;
`;

export const ModalAddCounterWrapper = styled(ReactstrapModalAdapter).attrs({
  contentClassName: 'ModalContent',
})`
  .ModalContent {
    background-color: black;
    font-family: 'Oswald', sans-serif;
    color: whitesmoke;
    box-shadow: inset 4px 4px 15px rgba(255, 255, 255, 0.1), inset -4px -4px 15px rgba(255, 255, 255, 0.1);
  }
`;

export const OpponentBox = styled.div`
  padding-bottom: 1rem;
  width: 100%;
  border-bottom: 1px solid #343a40;
`;

export const StyledForm = styled(Form)`
  display: flex;
  flex-direction: column;
  max-height: calc(100vh - 300px);
  min-height: 400px;
  width: 100%;
  overflow: scroll;

  @media only screen and (min-width:768px) {
    flex-direction: row;
  }
`;

export const StyledModalBody = styled(ModalBody)`
  display: flex;
  flex-direction: column;
  text-align: center;
  align-items: center;
`;

export const StyledModalFooter = styled(ModalFooter)`
  padding: .25rem 1rem;
  border-top: 1px solid #2c2c2c;
`;

export const StyledModalHeader = styled(ModalHeader)`
  padding: .25rem 1rem;
  border-bottom: 1px solid #2c2c2c;
`;

export const ToonName = styled.h6`
  font-size: .7rem;
  font-weight: 300;
  width: fit-content;
  margin: ${props => (props.isRow ? '0' : '0 0 0 0.5rem')};

  @media only screen and (min-width:768px) {
    font-size: .8rem;
  }

  @media only screen and (min-width:992px) {
    font-size: .9rem;
  }

  @media only screen and (min-width:1200px) {
    font-size: .9rem;
  }
`;
