import React from 'react';
import styled from 'styled-components/macro';
import { getImage } from 'src/helpers';
import PropTypes from 'prop-types';

import ToonImg from 'src/components/shared/ToonImg';
import CharacterPoolBtn from './CharacterPoolBtn';

// can be elevated from Modal/style.js
const ToonName = styled.h6`
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

export const StyledCharacterPool = styled.div`
  display: flex;
  flex-flow: row nowrap;
  background: ${ props => ( props.isCounter ? '#e4474733' : '#9B47E433' ) };
  padding: 1rem 1rem 0 1rem;
  justify-content: space-between;
  overflow-y: hidden;
  overflow-x: auto;

  @media only screen and (min-width:768px) {
    padding: 1rem;
    flex-flow: ${ props => ( props.isCompact ? 'row nowrap' : 'row wrap' ) };
    overflow-y: ${ props => ( props.isCompact ? 'hidden' : 'auto' ) };
    overflow-x: ${ props => ( props.isCompact ? 'auto' : 'hidden' ) };
  }
`;

export default function CharacterPool( {
  addCharacter, characters, isCompact, isCounter, type, ...props
} ) {
  CharacterPool.propTypes = {
    addCharacter: PropTypes.func.isRequired,
    characters: PropTypes.array.isRequired,
    isCompact: PropTypes.bool,
    isCounter: PropTypes.bool,
    type: PropTypes.string,
  };
  CharacterPool.defaultProps = {
    isCompact: false,
    isCounter: false,
    type: '',
  };

  return (
    <StyledCharacterPool isCompact={isCompact} isCounter={isCounter} className={type}>
      { characters
        .sort(( a, b ) => (( a.name > b.name ) ? 1 : -1 ))
        .filter( x => x.id !== 'BLANK' )
        .map( char => (
          <CharacterPoolBtn id={char.id} isCompact={isCompact} key={`charPool_${ char.id }`} onClick={addCharacter} title={char.name}>
            <ToonImg
              alt={char.name}
              isCompact={isCompact}
              no-margin
              src={ getImage( char.id ) }
              title={char.name}
            />
            <ToonName isCompact={isCompact}>{char.name}</ToonName>
          </CharacterPoolBtn>
        ))}
    </StyledCharacterPool>
  );
}
