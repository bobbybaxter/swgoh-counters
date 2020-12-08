import React from 'react';
import styled from 'styled-components/macro';
import getImage from 'src/helpers/getImage';
import { colors } from 'src/styles/colors';

import { LockBtn } from '../shared/Locks';
import { ToonName } from './style';
import ToonImg from '../shared/ToonImg';

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

export default function CharacterPool({
  isHardCounter, removeCharacter, setTempSquad, tempSquad, ...props
}) {
  const buildSquadDisplay = tempSquad.map((toon, i) => {
    const handleNewSquadLock = (e) => {
      e.preventDefault();
      const tempSquadCopy = [...tempSquad];

      // only allows isReq/lock toggling on toons that aren't the leader and aren't blank
      if (i !== 0 && tempSquadCopy[i].id !== 'BLANK') {
        tempSquadCopy[i].isReq = !tempSquadCopy[i].isReq;

        setTempSquad(tempSquadCopy);
      }
    };

    return (
      <CharCard key={`${toon.id}_${i}`}>
        <LockBtn
          index={i}
          color="link"
          isOn={toon.isReq}
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
