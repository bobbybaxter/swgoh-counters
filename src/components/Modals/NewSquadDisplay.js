import React from 'react';
import styled from 'styled-components/macro';
import PropTypes from 'prop-types';

import { LockBtn } from 'src/components/shared/Locks';
import ToonImg from 'src/components/shared/ToonImg';
import { getImage } from 'src/helpers';

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
  color,
  doesTempMatchSource,
  hideLocks,
  isCompact,
  removeCharacter,
  setTempSquad,
  size,
  sourceSquad,
  squadMatch,
  tempSquad,
  ...props
}) {
  NewSquadDisplay.propTypes = {
    color: PropTypes.string,
    doesTempMatchSource: PropTypes.bool,
    hideLocks: PropTypes.bool,
    isCompact: PropTypes.bool,
    removeCharacter: PropTypes.func,
    setTempSquad: PropTypes.func.isRequired,
    size: PropTypes.string,
    sourceSquad: PropTypes.array,
    squadMatch: PropTypes.string,
    tempSquad: PropTypes.array.isRequired,
  };

  const buildCounterDisplay = tempSquad.map((toon, i) => {
    const handleNewSquadLock = e => {
      e.preventDefault();
      const tempSquadCopy = [...tempSquad];

      // only allows isReq/lock toggling on toons that aren't the leader and aren't blank
      if (i !== 0 && tempSquadCopy[i].id !== 'BLANK') {
        tempSquadCopy[i].isReq = tempSquadCopy[i].isReq !== true;
        setTempSquad(tempSquadCopy);
      }
    };

    return (
      i < size.charAt(0) && <CharCard key={`${toon.id}_${i}`}>
        {!hideLocks && <LockBtn
          index={i}
          color="link"
          isOn={doesTempMatchSource ? sourceSquad[i].isReq : toon.isReq}
          onClick={handleNewSquadLock}
        />}
        <NewSquadChar $isCompact={isCompact}>
          <ToonImg
            no-margin
            id={`newToon${i}`}
            isCompact={isCompact}
            src={ getImage(toon.id) }
            title={toon.name}
            alt={toon.name}
            color={color || 'gray'}
            onClick={removeCharacter || undefined}
          />
          <ToonName isCompact={true}>{toon.name}</ToonName>
        </NewSquadChar>
      </CharCard>
    );
  });

  return (
    <>
      <Wrapper>
        {buildCounterDisplay}
      </Wrapper>
      {squadMatch && <div className="alert alert-danger mt-3">Squad exists as {squadMatch}</div>}
    </>
  );
}
