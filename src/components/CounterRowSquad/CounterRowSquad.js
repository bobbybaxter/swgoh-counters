import React from 'react';
import PropTypes from 'prop-types';
import getImage from '../../helpers/getImage';

// TODO: Add tests
export default function CounterRowSquad(props) {
  CounterRowSquad.propTypes = {
    squad: PropTypes.object,
    toggle: PropTypes.func,
    type: PropTypes.string,
  };

  const { squad, toggle, type } = props;
  const className = `toonImg ${type}Counter`;

  return <div key={squad.counterId} className="countersRow counterCard">
      <img
        id={squad.counterId}
        className={className}
        onClick={toggle}
        src={ getImage(squad.toon1Id) }
        title={squad.name}
        alt={squad.name}
      />
    </div>;
}
