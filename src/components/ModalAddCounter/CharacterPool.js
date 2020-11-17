import React from 'react';
import styled from 'styled-components';
import getImage from 'src/helpers/getImage';
import PropTypes from 'prop-types';

import CharacterPoolBtn from '../shared/CharacterPoolBtn';
import ToonImg from '../shared/ToonImg';

import { ToonName } from './style';

export const StyledCharacterPool = styled.div`
  display: flex;
  flex-flow: row nowrap;
  padding: 1rem;
  justify-content: space-between;
  height: 100%;
  overflow-y: hidden;
  overflow-x: auto;

  @media only screen and (min-width:768px) {
    flex-flow: ${props => (props.isRow ? 'row wrap' : 'column nowrap')};
    overflow-y: auto;
    overflow-x: hidden;
  }
`;

export default function CharacterPool({
  addCharacter, characters, isRow, ...props
}) {
  CharacterPool.propTypes = {
    addCharacter: PropTypes.func.isRequired,
    characters: PropTypes.array.isRequired,
    isRow: PropTypes.bool.isRequired,
  };

  return (
    <StyledCharacterPool isRow={isRow}>
      { characters
        .sort((a, b) => ((a.name > b.name) ? 1 : -1))
        .map(char => (
          <CharacterPoolBtn id={char.id} isRow={isRow} key={`charPool_${char.id}`} onClick={addCharacter} title={char.name}>
            <ToonImg no-margin alt={char.name} src={ getImage(char.id) } title={char.name}/>
            <ToonName isRow={isRow}>{char.name}</ToonName>
          </CharacterPoolBtn>
        ))}
    </StyledCharacterPool>
  );
}
