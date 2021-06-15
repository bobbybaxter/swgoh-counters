import React from 'react';
import styled from 'styled-components/macro';
import { getImage } from 'src/helpers';
import { NewSquadChar } from 'src/styles/style';
import PropTypes from 'prop-types';
import ToonImg from './ToonImg';

const MiniSquad = styled.div`
  display: flex;
  flex-flow: row nowrap;
  width: 100%;
  justify-content: left;
  align-items: center;
  cursor: pointer;
`;

const SquadImages = styled.div`
  display: flex;
  flex-flow: row nowrap;
  background-color: black;
  margin: 0 2.5px 0 2.5px;
  border: 1px #3D182560 solid;
`;

export default function MiniSquadView({
  leftSquadStub,
  size,
  toggle,
}) {
  MiniSquadView.propTypes = {
    leftSquadStub: PropTypes.object.isRequired,
    size: PropTypes.string.isRequired,
    toggle: PropTypes.func.isRequired,
  };

  const {
    toon1Id,
    toon1Name,
    toon2Id,
    toon2Name,
    toon3Id,
    toon3Name,
    toon4Id,
    toon4Name,
    toon5Id,
    toon5Name,
  } = leftSquadStub;

  const squad = [
    { id: toon1Id, name: toon1Name },
    { id: toon2Id, name: toon2Name },
    { id: toon3Id, name: toon3Name },
    { id: toon4Id, name: toon4Name },
    { id: toon5Id, name: toon5Name },
  ];

  return (
    <MiniSquad onClick={toggle} id={leftSquadStub.id}>
      <SquadImages>
        {
          squad.map((toon, i) => i < size.charAt(0)
            && <NewSquadChar key={`MiniSquad_${leftSquadStub.id}_${toon.name}_${i}`}>
              <ToonImg
                alt={toon.name}
                color={'black'}
                isClickable
                isCompact
                no-margin
                src={ getImage(toon.id) }
                title={ toon.name }
              />
            </NewSquadChar>)
        }
      </SquadImages>
    </MiniSquad>
  );
}
