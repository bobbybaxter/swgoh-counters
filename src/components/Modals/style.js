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

export const FormCheckboxes = styled.div`
  display: flex;
  flex-flow: column nowrap;
  align-items: flex-start;
  justify-content: center;
  font-size: .7rem;
  font-weight: 300;

  @media only screen and (min-width:768px) {
    font-size: .9rem;
    min-height: 50px;
  }

  @media only screen and (min-width:992px) {
    font-size: 1rem;
  }
`;

export const FormDetails = styled(FormGroup)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: ${props => (props.$hasMarginBottom ? '1rem 0' : '1rem 0 0 0')};

  @media only screen and (min-width:768px) {
    margin: ${props => (props.$hasMarginBottom ? '0 0 1rem 0' : '0')};
  }
`;

export const FormCentered = styled.div`
  display: flex;
  flex-direction: column;
  overflow: scroll;
  width: 100%;
  padding-right: 15px;
  padding-left: 15px;
`;

export const FormLeftSide = styled.div`
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

export const FormRightSide = styled.div`
  display: flex;
  flex-direction: column;
  overflow: initial;
  width: 100%;
  padding-top: 1rem;
  padding-right: 15px;
  padding-left: 15px;

  @media only screen and (min-width:768px) {
    padding-top: 0;
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

export const InputWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding-left: 0;
  padding-right: 0;
`;

export const MiddleWrapper = styled(FormGroup)`
  border-bottom: ${props => (props.$hasBorderBottom ? '1px solid #343a40' : 'none')};
  border-top: 1px solid #343a40;
  margin-bottom: ${props => (props.$hasMarginBottom ? '1rem' : '0 !important')};
  padding: ${props => (props.$hasPaddingBottom ? '1rem 0' : '1rem 0 0 0')};
`;

export const ModalWrapper = styled(ReactstrapModalAdapter).attrs({
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
  display: flex;
  flex-direction: column;
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
    overflow: hidden;
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
  margin: 0;

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
