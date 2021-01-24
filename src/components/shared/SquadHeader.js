import React, { useEffect, useState } from 'react';
import styled from 'styled-components/macro';
import PropTypes from 'prop-types';
import { colors } from 'src/styles/colors';
import { getImage } from 'src/helpers';
import ToonImg from './ToonImg';
import { LockImg } from './Locks';

export const CharCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const NewSquadChar = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  align-items: center;
  word-break: break-word;
`;

export const Wrapper = styled.div`
  display: flex;
  flex-flow: row wrap;
  width: 100%;
  justify-content: center;
`;

export const Zeta = styled.img`
  position: absolute;
  bottom: -5px;
  left: 0;
  background-color: transparent;
  border-color: transparent;
  width: 20px;

  @media only screen and (min-width:768px) {
    width: 24px;
  }

  @media only screen and (min-width:992px) {
    width: 28px;
  }

  @media only screen and (min-width:1200px) {
    width: 32px;
  }
`;

export const ZetaCounter = styled.span`
  position: absolute;
  bottom: 1.5px;
  left: 0;
  font-size: 7px;
  text-align: center;
  width: 20px;

  @media only screen and (min-width:768px) {
    bottom: 0.6px;
    left: 2.1px;
    font-size: 10px;
  }

  @media only screen and (min-width:992px) {
    bottom: 2.5px;
    left: 4.5px;
    font-size: 11px;
  }

  @media only screen and (min-width:1200px) {
    bottom: 3.5px;
    left: 5.8px;
    font-size: 12px;
  }
`;

export default function SquadHeader({
  counter, showLocks, size, squad, ...props
}) {
  SquadHeader.propTypes = {
    counter: PropTypes.object,
    showLocks: PropTypes.bool,
    size: PropTypes.string.isRequired,
    squad: PropTypes.object.isRequired,
  };

  const selectColor = () => {
    if (!counter) {
      return 'gray';
    }

    if (counter) {
      return counter.isHardCounter === 1 ? colors.hardCounter : colors.softCounter;
    }
    return 'gray';
  };

  const [displaySquad, setDisplaySquad] = useState();

  useEffect(() => {
    const counterCopy = { ...counter };
    const setSquad = () => {
      const toon1 = {
        id: squad.toon1Id,
        name: squad.toon1Name,
        isReq: true,
        zetas: counterCopy.toon1Zetas,
        image: squad.toon1Id ? getImage(squad.toon1Id) : null,
      };
      const toon2 = {
        id: squad.toon2Id,
        name: squad.toon2Name,
        isReq: counterCopy.isToon2Req === 1,
        zetas: counterCopy.toon2Zetas,
        image: squad.toon2Id ? getImage(squad.toon2Id) : null,
      };
      const toon3 = {
        id: squad.toon3Id,
        name: squad.toon3Name,
        isReq: counterCopy.isToon3Req === 1,
        zetas: counterCopy.toon3Zetas,
        image: squad.toon3Id ? getImage(squad.toon3Id) : null,
      };
      const toon4 = {
        id: squad.toon4Id,
        name: squad.toon4Name,
        isReq: counterCopy.isToon4Req === 1,
        zetas: counterCopy.toon4Zetas,
        image: squad.toon4Id ? getImage(squad.toon4Id) : null,
      };
      const toon5 = {
        id: squad.toon5Id,
        name: squad.toon5Name,
        isReq: counterCopy.isToon5Req === 1,
        zetas: counterCopy.toon5Zetas,
        image: squad.toon5Id ? getImage(squad.toon5Id) : null,
      };
      setDisplaySquad([toon1, toon2, toon3, toon4, toon5]);
    };

    setSquad();
  }, [counter, squad.toon1Id, squad.toon1Name, squad.toon2Id, squad.toon2Name, squad.toon3Id, squad.toon3Name, squad.toon4Id, squad.toon4Name, squad.toon5Id, squad.toon5Name]); // eslint-disable-line max-len

  const {
    name,
  } = squad || {};

  return (
    <>
      <h5>{name}</h5>
      <Wrapper className="mb-1">
      {
        displaySquad && displaySquad.map((toon, i) => (i < size.charAt(0)
            && <CharCard key={`CharCard_${toon.name}_${i}`}>
              <NewSquadChar>
                <ToonImg
                  src={ toon.image }
                  title={toon.name}
                  alt={toon.name}
                  color={selectColor()}
                />
                {
                  showLocks
                  && toon.zetas.length > 0
                  && <>
                    <Zeta src={require('../../assets/zeta.png')}/>
                    <ZetaCounter>{toon.zetas.length}</ZetaCounter>
                  </>
                }
                {showLocks && toon.isReq && <LockImg />}
              </NewSquadChar>
            </CharCard>))
      }
      </Wrapper>
    </>
  );
}
