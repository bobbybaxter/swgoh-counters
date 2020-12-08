import React, { useEffect, useState } from 'react';
import { Button, Input, Label } from 'reactstrap';
import PropTypes from 'prop-types';
import _ from 'lodash';

import useInputValue from 'src/helpers/hooks/useInputValue';
import { addSquad } from 'src/helpers/data/squadsData';
import { addCounter } from 'src/helpers/data/countersData';

import {
  FormLeftSide,
  FormRightSide,
  FormStrategy,
  ModalAddCounterWrapper,
  OpponentBox,
  StyledForm,
  StyledModalBody,
  StyledModalFooter,
  StyledModalHeader,
} from './style';
import SquadHeader from '../shared/SquadHeader';
import CharacterPool from './CharacterPool';
import NewSquadDisplay from './NewSquadDisplay';
import SquadDetailForm from './SquadDetailForm';
import ZetaForm from './ZetaForm';

const defaultToon = {
  id: 'BLANK',
  name: 'Blank',
  isReq: false,
  zetas: ['zeta 1', 'zeta 2'], // TODO: change to empty array before deployment
};

const buildDefaultSquad = () => {
  const defaultSquad = [];
  for (let i = 0; i < 5; i += 1) {
    defaultSquad.push(defaultToon);
  }
  return defaultSquad;
};

// TODO: Add tests
export default function ModalAddCounter({
  counterStubs, isOpen, leftSquadStub, reload, size, toggle, view, ...props
}) {
  ModalAddCounter.propTypes = {
    counterStubs: PropTypes.object.isRequired,
    isOpen: PropTypes.bool.isRequired,
    leftSquadStub: PropTypes.object,
    reload: PropTypes.func,
    size: PropTypes.string,
    toggle: PropTypes.func.isRequired,
    view: PropTypes.string,
  };

  const storedCharacters = JSON.parse(sessionStorage.getItem('characters')) || [];
  const storedSquads = JSON.parse(sessionStorage.getItem('squads')) || [];

  const [characters] = useState(storedCharacters);
  const [isHardCounter, setIsHardCounter] = useState(false);
  const [isNewCounter, setIsNewCounter] = useState(true);
  const [isNewSquad, setIsNewSquad] = useState(true);
  const [isPoolViewRow] = useState(true);
  const [leftSquad, setLeftSquad] = useState();
  const strategy = useInputValue('');
  const [squads] = useState(storedSquads);
  const [squadMatch, setSquadMatch] = useState('');
  const [tempSquad, setTempSquad] = useState(buildDefaultSquad());
  const [tempSquadInfo, setTempSquadInfo] = useState({ id: '', name: '' });

  useEffect(() => {
    async function getLeftSquad() {
      const matchedLeftSquad = squads.find(x => x.id === leftSquadStub.id);
      await setLeftSquad(matchedLeftSquad);
    }

    getLeftSquad();
  }, [leftSquadStub.id, squads]);

  const checkExistingCounter = (squadId) => {
    const counterExists = !!counterStubs.rightSquadStubs.find(x => x.id === squadId);
    setIsNewCounter(!counterExists);
  };

  const checkExistingSquad = (squadToCheck) => {
    const squadLeader = squadToCheck.shift();
    const squadNonLeaders = squadToCheck.slice(0);
    const matchedSquad = squads.find(squad => squad.toon1Name === squadLeader
      && _.isEqual(
        squadNonLeaders.sort(),
        [squad.toon2Name, squad.toon3Name, squad.toon4Name, squad.toon5Name].sort(),
      ));

    if (!matchedSquad) {
      setIsNewSquad(true);
      setIsNewCounter(true);
      setTempSquadInfo({ id: '', name: tempSquadInfo.name });
    }

    if (matchedSquad) {
      setIsNewSquad(false);
      setTempSquadInfo({ id: matchedSquad.id, name: matchedSquad.name });
      checkExistingCounter(matchedSquad.id);
    }
  };

  const addCharacter = async (e) => {
    e.preventDefault();
    const addedToon = {
      id: e.currentTarget.id,
      name: e.currentTarget.title,
      isReq: false,
      zetas: [],
    };

    const tempSquadCopy = [...tempSquad];
    const tempSquadIds = tempSquadCopy.map(x => x.id);

    if (!tempSquadIds.includes(addedToon.id)) {
      const indexToFill = await tempSquadCopy.findIndex(x => x.id === 'BLANK');
      addedToon.isReq = indexToFill === 0;
      tempSquadCopy[indexToFill] = addedToon;
      setTempSquad(tempSquadCopy);

      const currentSquadNames = await tempSquadCopy.map(x => x.name);
      checkExistingSquad(currentSquadNames);
    }
  };

  const removeCharacter = (e) => {
    e.preventDefault();
    const { id, title } = e.target;
    const buttonIndex = id[id.length - 1];
    const tempSquadCopy = [...tempSquad];
    tempSquadCopy[buttonIndex] = defaultToon;
    setTempSquad(tempSquadCopy);

    const currentSquadNames = tempSquad.map(x => x.name);
    const index = currentSquadNames.indexOf(title);
    index !== -1 ? currentSquadNames[index] = 'Blank' : ''; // eslint-disable-line no-unused-expressions
    checkExistingSquad(currentSquadNames);
  };

  // TODO: configure this to handle reverse counters
  // TODO: consider changing scroll bar color on modal
  const handleSubmitButton = async (e) => {
    e.preventDefault();
    if (!isNewCounter
      || !!squadMatch
      || tempSquadInfo.name === ''
      || tempSquad[0].id === 'BLANK') {
      console.error('please add or correct squad name or members');
    } else {
      if (!tempSquadInfo.id) {
        const addSquadResponse = await addSquad({
          name: tempSquadInfo.name,
          description: '',
          counterStrategy: '',
          toon1Id: tempSquad[0].id,
          toon2Id: tempSquad[1].id,
          toon3Id: tempSquad[2].id,
          toon4Id: tempSquad[3].id,
          toon5Id: tempSquad[4].id,
        });

        if (addSquadResponse.status === 'ok') {
          await addCounter({
            opponentSquadId: leftSquadStub.id,
            counterSquadId: addSquadResponse.squadId,
            isHardCounter: 0,
            battleType: size,
            description: strategy.value,
            isToon2Req: tempSquad[1].isReq,
            isToon3Req: tempSquad[2].isReq,
            isToon4Req: tempSquad[3].isReq,
            isToon5Req: tempSquad[4].isReq,
            toon1Zetas: tempSquad[0].zetas.toString(),
            toon2Zetas: tempSquad[1].zetas.toString(),
            toon3Zetas: tempSquad[2].zetas.toString(),
            toon4Zetas: tempSquad[3].zetas.toString(),
            toon5Zetas: tempSquad[4].zetas.toString(),
          });

          toggle();
          reload();
        } else {
          console.error('error adding squad', addSquadResponse);
        }
      }

      if (tempSquadInfo.id) {
        const addCounterResponse = await addCounter({
          opponentSquadId: leftSquadStub.id,
          counterSquadId: tempSquadInfo.id,
          isHardCounter: 0,
          battleType: size,
          description: strategy.value,
          isToon2Req: tempSquad[1].isReq,
          isToon3Req: tempSquad[2].isReq,
          isToon4Req: tempSquad[3].isReq,
          isToon5Req: tempSquad[4].isReq,
          toon1Zetas: tempSquad[0].zetas.toString(),
          toon2Zetas: tempSquad[1].zetas.toString(),
          toon3Zetas: tempSquad[2].zetas.toString(),
          toon4Zetas: tempSquad[3].zetas.toString(),
          toon5Zetas: tempSquad[4].zetas.toString(),
        });

        if (addCounterResponse === 'ok') {
          toggle();
          reload();
        } else {
          console.error('error adding counter', addCounterResponse);
        }
      }
    }
  };

  const closeBtn = <button className="close text-white" onClick={toggle}>&times;</button>;

  const strategyPlaceholder = () => {
    if (leftSquad) {
      return view === 'normal'
        ? `Please explain how to beat ${leftSquad.name} with this counter.`
        : `Please explain how ${leftSquad.name} beats this opponent.`;
    }
    return '';
  };

  return (
    <ModalAddCounterWrapper isOpen={isOpen} toggle={toggle}>
      <StyledModalHeader close={closeBtn}>{view === 'normal' ? 'Add Counter' : 'Add Opponent'}</StyledModalHeader>

      <StyledModalBody>
        <StyledForm>
        {/* Left-side squad top header */}
          {/* New squad form */}
          <FormLeftSide>
            <OpponentBox>
              {leftSquad && <SquadHeader size={size} squad={leftSquad} />}
              <h6 className="text-secondary mb-1">vs</h6>
              <NewSquadDisplay
                isHardCounter={isHardCounter}
                removeCharacter={removeCharacter}
                setTempSquad={setTempSquad}
                tempSquad={tempSquad}
              />
            </OpponentBox>
            <CharacterPool
              addCharacter={addCharacter}
              characters={characters}
              isRow={isPoolViewRow}
            />
          </FormLeftSide>

          <FormRightSide>
              {/* Squad details */}
            <SquadDetailForm
              buildDefaultSquad={buildDefaultSquad}
              checkExistingSquad={checkExistingSquad}
              isHardCounter={isHardCounter}
              isNewCounter={isNewCounter}
              isNewSquad={isNewSquad}
              setIsHardCounter={setIsHardCounter}
              setIsNewSquad={setIsNewSquad}
              setSquadMatch={setSquadMatch}
              setIsNewCounter={setIsNewCounter}
              setTempSquadInfo={setTempSquadInfo}
              setTempSquad={setTempSquad}
              tempSquadInfo={tempSquadInfo}
              squadMatch={squadMatch}
              squads={squads}
              view={view}
            />

            <div>
              {/* Zetas */}
              <ZetaForm
                characters={characters}
                setTempSquad={setTempSquad}
                tempSquad={tempSquad}
              />

              {/* Counter Strategy Box */}
              <FormStrategy>
                <Label for="squadDescription" className="text-secondary pb-3">Counter Strategy</Label>
                <Input
                  name="squadDescriptionInput"
                  placeholder={strategyPlaceholder()}
                  rows="3"
                  type="textarea"
                  {...strategy}
                />
              </FormStrategy>
            </div>
          </FormRightSide>
        </StyledForm>
      </StyledModalBody>

      <StyledModalFooter>
        <Button color="primary" onClick={handleSubmitButton}
          disabled={ !isNewCounter
            || !!squadMatch
            || tempSquadInfo.name === ''
            || tempSquad[0].id === 'BLANK' }>Submit</Button>
        <Button color="secondary" onClick={toggle}>Cancel</Button>
      </StyledModalFooter>
    </ModalAddCounterWrapper>
  );
}
