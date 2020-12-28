import React, { useEffect, useState } from 'react';
import { Button, Input, Label } from 'reactstrap';
import PropTypes from 'prop-types';
import _ from 'lodash';

import SquadHeader from 'src/components/shared/SquadHeader';
import { useInputValue } from 'src/helpers/';
import { updateCounter, updateSquad } from 'src/helpers/data';

import CharacterPool from '../ModalAddCounter/CharacterPool';
import NewSquadDisplay from '../ModalAddCounter/NewSquadDisplay';
import SquadDetailForm from '../ModalAddCounter/SquadDetailForm';
import ZetaForm from '../ModalAddCounter/ZetaForm';
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
} from '../ModalAddCounter/style';

const defaultTempSquadInfo = {
  id: '',
  name: '',
  description: '',
  counterStrategy: '',
  toon1Id: '',
  toon2Id: '',
  toon3Id: '',
  toon4Id: '',
  toon5Id: '',
};

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
export default function ModalEditCounter({
  counter,
  counterStubs,
  isOpen,
  leftSquad: leftSquadParam,
  reload,
  rightSquad,
  size,
  toggle,
  user,
  view,
  ...props
}) {
  ModalEditCounter.propTypes = {
    counter: PropTypes.object.isRequired,
    counterStubs: PropTypes.object.isRequired,
    isOpen: PropTypes.bool.isRequired,
    leftSquad: PropTypes.object,
    reload: PropTypes.func,
    rightSquad: PropTypes.object,
    size: PropTypes.string,
    toggle: PropTypes.func.isRequired,
    user: PropTypes.object,
    view: PropTypes.string,
  };

  const storedCharacters = JSON.parse(sessionStorage.getItem('characters')) || [];
  const storedSquads = JSON.parse(sessionStorage.getItem('squads')) || [];

  const [characters] = useState(storedCharacters);
  const [doesTempMatchSource, setDoesTempMatchSource] = useState(false);
  const [isHardCounter, setIsHardCounter] = useState(counter.isHardCounter === 1);
  const [isNewCounter, setIsNewCounter] = useState(true);
  const [isPoolViewRow] = useState(true);
  const [leftSquad, setLeftSquad] = useState(leftSquadParam);
  const [sourceSquad, setSourceSquad] = useState();
  const strategy = useInputValue(counter.description);
  const [squads] = useState(storedSquads);
  const [squadMatch, setSquadMatch] = useState('');
  const [tempSquad, setTempSquad] = useState(buildDefaultSquad());
  const [tempSquadInfo, setTempSquadInfo] = useState(defaultTempSquadInfo);

  useEffect(() => {
    const squadToEdit = view === 'normal' ? { ...rightSquad } : { ...leftSquadParam };
    const {
      counterStrategy,
      description,
      id,
      name,
      toon1Id,
      toon2Id,
      toon3Id,
      toon4Id,
      toon5Id,
      toon1Name,
      toon2Name,
      toon3Name,
      toon4Name,
      toon5Name,
    } = squadToEdit;

    const {
      isToon2Req,
      isToon3Req,
      isToon4Req,
      isToon5Req,
      toon1Zetas,
      toon2Zetas,
      toon3Zetas,
      toon4Zetas,
      toon5Zetas,
    } = counter;

    async function buildTempSquad() {
      const toon1 = {
        id: toon1Id,
        name: toon1Name,
        isReq: true,
        zetas: toon1Zetas,
      };
      const toon2 = {
        id: toon2Id,
        name: toon2Name,
        isReq: isToon2Req,
        zetas: toon2Zetas,
      };
      const toon3 = {
        id: toon3Id,
        name: toon3Name,
        isReq: isToon3Req,
        zetas: toon3Zetas,
      };
      const toon4 = {
        id: toon4Id,
        name: toon4Name,
        isReq: isToon4Req,
        zetas: toon4Zetas,
      };
      const toon5 = {
        id: toon5Id,
        name: toon5Name,
        isReq: isToon5Req,
        zetas: toon5Zetas,
      };

      const sourceSquadToSet = [toon1, toon2, toon3, toon4, toon5];
      await setTempSquadInfo({
        id,
        name,
        description,
        counterStrategy,
        toon1Id,
        toon2Id,
        toon3Id,
        toon4Id,
        toon5Id,
      });
      await setSourceSquad(sourceSquadToSet);
      await setTempSquad(sourceSquadToSet);
    }

    buildTempSquad();
  }, [counter, leftSquadParam, rightSquad, view]);

  const checkExistingCounter = (squadId) => {
    let counterExists;
    counterExists = !!counterStubs.rightSquadStubs.find(x => x.id === squadId);
    if (squadId === rightSquad.id) {
      counterExists = false;
    }

    setIsNewCounter(!counterExists);
  };

  const checkExistingSquad = (squadToCheck) => {
    const squadLeader = squadToCheck.shift();
    const squadMembers = squadToCheck.slice(0);
    const matchedSquad = squads.find(squad => squad.toon1Name === squadLeader
      && _.isEqual(
        squadMembers.sort(),
        [squad.toon2Name, squad.toon3Name, squad.toon4Name, squad.toon5Name].sort(),
      ));

    if (!matchedSquad) {
      setSquadMatch('');
      setIsNewCounter(true);
      setTempSquadInfo({
        id: counter.counterSquadId,
        name: view === 'normal' ? rightSquad.name : leftSquad.name,
        description: view === 'normal' ? rightSquad.description : leftSquad.description,
        counterStrategy: view === 'normal' ? rightSquad.counterStrategy : leftSquad.counterStrategy,
        toon1Id: (characters.find(x => x.name === squadLeader)).id || 'BLANK',
        toon2Id: (characters.find(x => x.name === squadMembers[0])).id || 'BLANK',
        toon3Id: (characters.find(x => x.name === squadMembers[1])).id || 'BLANK',
        toon4Id: (characters.find(x => x.name === squadMembers[2])).id || 'BLANK',
        toon5Id: (characters.find(x => x.name === squadMembers[3])).id || 'BLANK',
      });
    }

    if (matchedSquad) {
      setTempSquadInfo({
        id: matchedSquad.id,
        name: matchedSquad.name,
        description: matchedSquad.description,
        counterStrategy: matchedSquad.counterStrategy,
        toon1Id: matchedSquad.toon1Id,
        toon2Id: matchedSquad.toon2Id,
        toon3Id: matchedSquad.toon3Id,
        toon4Id: matchedSquad.toon4Id,
        toon5Id: matchedSquad.toon5Id,
      });
      setSquadMatch(matchedSquad.name);
      checkExistingCounter(matchedSquad.id);
    }
  };

  useEffect(() => {
    async function checkForSourceSquad() {
      if (sourceSquad) {
        const tempIds = tempSquad.map(x => x.id).toString();
        const sourceIds = sourceSquad.map(x => x.id).toString();
        tempIds === sourceIds
          ? await setDoesTempMatchSource(true)
          : await setDoesTempMatchSource(false);
      }
    }

    checkForSourceSquad();
  }, [sourceSquad, tempSquad]);

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

  // TODO: consider changing scroll bar color on modal
  const handleSubmitButton = async (e) => {
    e.preventDefault();
    if (!isNewCounter
      || !!squadMatch
      || tempSquadInfo.name === ''
      || tempSquad[0].id === 'BLANK') {
      console.error('please add or correct squad name or members');
    } else {
      const updateSquadResponse = await updateSquad({
        name: tempSquadInfo.name,
        id: tempSquadInfo.id,
        description: tempSquadInfo.description,
        counterStrategy: tempSquadInfo.counterStrategy,
        toon1Id: tempSquad[0].id,
        toon2Id: tempSquad[1].id,
        toon3Id: tempSquad[2].id,
        toon4Id: tempSquad[3].id,
        toon5Id: tempSquad[4].id,
        userId: user.id,
        username: user.username,
      });

      if (updateSquadResponse === 'ok') {
        await updateCounter({
          id: counter.id,
          opponentSquadId: view === 'normal' ? leftSquad.id : rightSquad.id,
          counterSquadId: view === 'normal' ? rightSquad.id : leftSquad.id,
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
          userId: user.id,
          username: user.username,
        });

        toggle();
        reload();
      } else {
        console.error('error updating squad', updateSquadResponse);
      }
    }
  };

  const closeBtn = <button className="close text-white" onClick={toggle}>&times;</button>;

  return (
    <ModalAddCounterWrapper isOpen={isOpen} toggle={toggle}>
      <StyledModalHeader close={closeBtn}>Edit Counter</StyledModalHeader>

      <StyledModalBody>
        <StyledForm>
        {/* Left-side squad top header */}
          {/* New squad form */}
          <FormLeftSide>
            <OpponentBox>
              {view === 'normal'
                ? leftSquad && <SquadHeader size={size} squad={leftSquad} />
                : rightSquad && <SquadHeader size={size} squad={rightSquad} />
              }
              <h6 className="text-secondary mb-1">vs</h6>
              <NewSquadDisplay
                doesTempMatchSource={doesTempMatchSource}
                isHardCounter={isHardCounter}
                removeCharacter={removeCharacter}
                setTempSquad={setTempSquad}
                sourceSquad={sourceSquad}
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
              defaultTempSquadInfo={defaultTempSquadInfo}
              isHardCounter={isHardCounter}
              isNewCounter={isNewCounter}
              rightSquad={rightSquad}
              setIsHardCounter={setIsHardCounter}
              setSquadMatch={setSquadMatch}
              setIsNewCounter={setIsNewCounter}
              setTempSquadInfo={setTempSquadInfo}
              setTempSquad={setTempSquad}
              tempSquadInfo={tempSquadInfo}
              sourceSquad={sourceSquad}
              squadMatch={squadMatch}
              squads={squads}
            />

            <div>
              {/* Zetas */}
              {!squadMatch && <ZetaForm
                characters={characters}
                doesTempMatchSource={doesTempMatchSource}
                setTempSquad={setTempSquad}
                sourceSquad={sourceSquad}
                tempSquad={tempSquad}
              />}

              {/* Counter Strategy Box */}
              {!squadMatch && <FormStrategy>
                <Label for="squadDescription" className="text-secondary pb-3">Counter Strategy</Label>
                <Input
                  name="squadDescriptionInput"
                  placeholder={leftSquad && `Please explain how to beat ${leftSquad.name} with this counter.`}
                  rows="10"
                  type="textarea"
                  {...strategy}
                />
              </FormStrategy>}
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
