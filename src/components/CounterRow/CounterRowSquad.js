import React from 'react';
import PropTypes from 'prop-types';

import ToonImg from 'src/components/shared/ToonImg';
import { getImage } from 'src/helpers';
import { colors } from 'src/styles/colors';
import { CounterCard } from 'src/styles/style';

export default function CounterRowSquad({
  squad, toggle, type, ...props
}) {
  CounterRowSquad.propTypes = {
    squad: PropTypes.object,
    toggle: PropTypes.func,
    type: PropTypes.string,
  };

  const color = type === 'hard' ? colors.hardCounter : colors.softCounter;

  return <CounterCard key={squad.counterId}>
      <ToonImg
        id={squad.counterId}
        color={color}
        onClick={toggle}
        src={ getImage(squad.toon1Id) }
        title={squad.name}
        alt={squad.name}
      />
    </CounterCard>;
}
