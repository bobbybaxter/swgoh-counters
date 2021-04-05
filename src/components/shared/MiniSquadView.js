import React, { useEffect, useState } from 'react';
import styled from 'styled-components/macro';
import { getImage } from 'src/helpers';
import { NewSquadChar, SquadTitle } from 'src/styles/style';
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
  };

  const [squad, setSquad] = useState();

  useEffect(() => {
    const {
      toon1Id,
      toon2Id,
      toon3Id,
      toon4Id,
      toon5Id,
    } = leftSquadStub;
    const characters = JSON.parse(sessionStorage.getItem('characters')) || [];
    const toon1 = characters.find(x => x.id === toon1Id);
    const toon2 = characters.find(x => x.id === toon2Id);
    const toon3 = characters.find(x => x.id === toon3Id);
    const toon4 = characters.find(x => x.id === toon4Id);
    const toon5 = characters.find(x => x.id === toon5Id);
    setSquad([
      toon1,
      toon2,
      toon3,
      toon4,
      toon5,
    ]);
  }, [leftSquadStub]);

  return (
    <MiniSquad onClick={toggle} id={leftSquadStub.id}>
      <SquadImages>
        {
          squad && squad.map((toon, i) => i < size.charAt(0)
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
      <SquadTitle className="text-secondary">{leftSquadStub.name}</SquadTitle>
    </MiniSquad>
  );
}
