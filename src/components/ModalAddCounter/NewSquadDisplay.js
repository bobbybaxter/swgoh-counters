import React from 'react';
import styled from 'styled-components/macro';
import PropTypes from 'prop-types';

import { LockBtn } from 'src/components/shared/Locks';
import ToonImg from 'src/components/shared/ToonImg';
import { getImage } from 'src/helpers';
import { colors } from 'src/styles/colors';

import { ToonName } from './style';

export const CharCard = styled.div`
  display: flex;
  flex-direction: column;
`;

export const NewSquadChar = styled.div`
  display: flex;
  flex-direction: column;
  width: 55px;
  align-items: center;
  word-break: break-word;

  @media only screen and (min-width:768px) {
    width: 65px;
  }

  @media only screen and (min-width:992px) {
    width: 75px;
  }

  @media only screen and (min-width:1200px) {
    width: 85px;
  }
`;

export const Wrapper = styled.div`
  display: flex;
  flex-flow: row wrap;
  width: 100%;
  justify-content: center;
`;

export default function NewSquadDisplay({
  doesTempMatchSource,
  isHardCounter,
  removeCharacter,
  setTempSquad,
  sourceSquad,
  tempSquad,
  ...props
}) {
  NewSquadDisplay.propTypes = {
    doesTempMatchSource: PropTypes.bool,
    isHardCounter: PropTypes.bool.isRequired,
    removeCharacter: PropTypes.func.isRequired,
    setTempSquad: PropTypes.func.isRequired,
    sourceSquad: PropTypes.array,
    tempSquad: PropTypes.array.isRequired,
  };

  const buildSquadDisplay = tempSquad.map((toon, i) => {
    const handleNewSquadLock = (e) => {
      e.preventDefault();
      const tempSquadCopy = [...tempSquad];

      // only allows isReq/lock toggling on toons that aren't the leader and aren't blank
      if (i !== 0 && tempSquadCopy[i].id !== 'BLANK') {
        tempSquadCopy[i].isReq = tempSquadCopy[i].isReq === 1 ? 0 : 1;

        setTempSquad(tempSquadCopy);
      }
    };

    return (
      <CharCard key={`${toon.id}_${i}`}>
        <LockBtn
          index={i}
          color="link"
          isOn={doesTempMatchSource ? sourceSquad[i].isReq : toon.isReq}
          onClick={handleNewSquadLock}
        />
        <NewSquadChar>
          <ToonImg
            no-margin
            id={`newToon${i}`}
            src={ getImage(toon.id) }
            title={toon.name}
            alt={toon.name}
            color={isHardCounter ? colors.hardCounter : colors.softCounter}
            onClick={removeCharacter}
          />
          <ToonName isRow={true}>{toon.name}</ToonName>
        </NewSquadChar>
      </CharCard>
    );
  });

  return (
    <Wrapper>
      {buildSquadDisplay}
    </Wrapper>
  );
}
