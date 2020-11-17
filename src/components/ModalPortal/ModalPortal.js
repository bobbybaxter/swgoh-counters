import React from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';

const Portal = ({ children }) => {
  const modalRoot = document.getElementById('App');
  return createPortal(children, modalRoot);
};

export default function ModalPortal(props) {
  ModalPortal.propTypes = {
    children: PropTypes.object.isRequired,
  };

  const { children } = props;

  return (
  <Portal>
    {children}
  </Portal>
  );
}
