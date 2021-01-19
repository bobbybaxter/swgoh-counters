import React from 'react';
import styled from 'styled-components/macro';
import { getImage } from 'src/helpers';
import PropTypes from 'prop-types';

import CharacterPoolBtn from 'src/components/shared/CharacterPoolBtn';
import ToonImg from 'src/components/shared/ToonImg';

import { ToonName } from './style';

export const StyledCharacterPool = styled.div`
  display: flex;
  flex-flow: row nowrap;
  background: #0f0f0f;
  padding: 1rem;
  justify-content: space-between;
  overflow-y: hidden;
  overflow-x: auto;

  @media only screen and (min-width:768px) {
    flex-flow: ${props => (props.isCompact ? 'row nowrap' : 'row wrap')};
    overflow-y: ${props => (props.isCompact ? 'hidden' : 'auto')};
    overflow-x: ${props => (props.isCompact ? 'auto' : 'hidden')};
  }
`;

export default function CharacterPool({
  addCharacter, characters, isCompact, ...props
}) {
  CharacterPool.propTypes = {
    addCharacter: PropTypes.func.isRequired,
    characters: PropTypes.array.isRequired,
    isCompact: PropTypes.bool,
  };
  CharacterPool.defaultProps = {
    isCompact: false,
  };

  return (
    <StyledCharacterPool isCompact={isCompact}>
      { characters
        .sort((a, b) => ((a.name > b.name) ? 1 : -1))
        .map(char => (
          <CharacterPoolBtn id={char.id} isCompact={isCompact} key={`charPool_${char.id}`} onClick={addCharacter} title={char.name}>
            <ToonImg
              alt={char.name}
              isCompact={isCompact}
              no-margin
              src={ getImage(char.id) }
              title={char.name}
            />
            <ToonName isCompact={isCompact}>{char.name}</ToonName>
          </CharacterPoolBtn>
        ))}
    </StyledCharacterPool>
  );
}
