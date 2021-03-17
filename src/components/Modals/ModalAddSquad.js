import React, { useContext, useState } from 'react';
import { Button, Input, Label } from 'reactstrap';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { isWebUri } from 'valid-url';

import { LockBtn } from 'src/components/shared/Locks';
import { useInputValue } from 'src/helpers/';
import { AuthContext } from 'src/userContext';
import {
  addCounter, addSquad, addVideoLink, updateSquad,
} from 'src/helpers/data';
import { EditMenu } from 'src/styles/style';

import { colors } from 'src/styles/colors';
import CharacterPool from './CharacterPool';
import NewSquadDisplay from './NewSquadDisplay';
import CounterDetailForm from './CounterDetailForm';
import SquadDetailForm from './SquadDetailForm';
import ZetaForm from './ZetaForm';
import VideoForm from './VideoForm';
import {
  FormLeftSide,
  FormRightSide,
  FormStrategy,
  MiddleWrapper,
  ModalWrapper,
  OpponentBox,
  StyledForm,
  StyledModalBody,
  StyledModalFooter,
  StyledModalHeader,
} from './style';
import { getCounterStubsBySquadId } from '../../helpers/data/countersData';

const defaultTempSquadInfo = {
  id: '',
  name: '',
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
  zetas: [],
};

const buildDefaultSquad = () => {
  const defaultSquad = [];
  for (let i = 0; i < 5; i += 1) {
    defaultSquad.push(defaultToon);
  }
  return defaultSquad;
};

// TODO: optimize this code so that i'm not repeating the same code for a leftSquad and a rightSquad
//  there is a bunch of code that can be shared between the Modals
export default function ModalAddSquad({
  isOpen,
  reload,
  size,
  toggle,
  // user,
  view,
  ...props
}) {
  ModalAddSquad.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    reload: PropTypes.func,
    size: PropTypes.string,
    toggle: PropTypes.func.isRequired,
    view: PropTypes.string,
  };

  const storedCharacters = JSON.parse(sessionStorage.getItem('characters')) || [];
  const storedSquads = JSON.parse(sessionStorage.getItem('squads')) || [];

  const [areVideoLinksValid, setAreVideoLinksValid] = useState(true);
  const [areVideoTitlesTooLong, setAreVideoTitlesTooLong] = useState(false);
  const [characters] = useState(storedCharacters);
  const [isHardCounter, setIsHardCounter] = useState(false);
  const [isNewCounter, setIsNewCounter] = useState(true);
  const [isNewLeftSquad, setIsNewLeftSquad] = useState(true);
  const [isNewSquad, setIsNewSquad] = useState(true);
  const [leftSquadNameMatch, setLeftSquadNameMatch] = useState('');
  const [description, setDescription] = useState('');
  const [generalStrategy, setGeneralStrategy] = useState('');
  const [sourceDescription, setSourceDescription] = useState('');
  const [sourceGeneralStrategy, setSourceGeneralStrategy] = useState('');
  const strategy = useInputValue('');
  const [squads] = useState(storedSquads);
  const [squadMatch, setSquadMatch] = useState(''); // eslint-disable-line no-unused-vars
  const [squadNameMatch, setSquadNameMatch] = useState('');
  const [tempLeftSquad, setTempLeftSquad] = useState(buildDefaultSquad());
  const [tempLeftSquadInfo, setTempLeftSquadInfo] = useState(defaultTempSquadInfo);
  const [tempSquad, setTempSquad] = useState(buildDefaultSquad());
  const [tempSquadInfo, setTempSquadInfo] = useState(defaultTempSquadInfo);
  const [videoLinks, setVideoLinks] = useState([]);
  const { user } = useContext(AuthContext);

  const checkIfVideoLinksAreValid = (updatedLinks) => {
    const isInvalid = updatedLinks.some(videoLink => !isWebUri(videoLink.link));
    setAreVideoLinksValid(!isInvalid);
  };

  const checkExistingCounter = async (leftSquadId, rightSquadId) => {
    if (leftSquadId && rightSquadId) {
      // abortController cleans up cancelled requests
      const abortController = new AbortController();
      const opts = { signal: abortController.signal };

      try {
        const counterStubs = await getCounterStubsBySquadId(leftSquadId, view, size, opts);
        return !_.isEmpty(counterStubs)
          ? !counterStubs.rightSquadStubs.find(x => x.id === rightSquadId)
          : true;
      } catch (err) {
        if (!abortController.signal.aborted) {
          console.error('checkExistingCounter aborted :>> ', err);
          throw err;
        }
      }
    }

    return true;
  };

  const checkExistingSquad = async (squadToCheck) => {
    const squadLeader = squadToCheck.shift();
    const squadMembers = squadToCheck.slice(0);
    const matchedSquad = squads.find(squad => squad.toon1Name === squadLeader
      && _.isEqual(
        squadMembers.sort(),
        [squad.toon2Name, squad.toon3Name, squad.toon4Name, squad.toon5Name].sort(),
      ));

    if (!matchedSquad) {
      return {
        squadMatch: '',
        isNewCounter: true,
        isNewSquad: true,
        tempSquadInfo: {
          id: '',
          name: tempSquadInfo.name,
          description: '',
          generalStrategy: '',
          toon1Id: (characters.find(x => x.name === squadLeader)).id || 'BLANK',
          toon2Id: (characters.find(x => x.name === squadMembers[0])).id || 'BLANK',
          toon3Id: (characters.find(x => x.name === squadMembers[1])).id || 'BLANK',
          toon4Id: (characters.find(x => x.name === squadMembers[2])).id || 'BLANK',
          toon5Id: (characters.find(x => x.name === squadMembers[3])).id || 'BLANK',
        },
      };
    }

    const isNewCounterCheck = await checkExistingCounter(tempLeftSquadInfo.id, matchedSquad.id);
    return {
      squadMatch: matchedSquad.name,
      isNewCounter: isNewCounterCheck,
      isNewSquad: false,
      tempSquadInfo: {
        id: matchedSquad.id,
        name: matchedSquad.name,
        description: matchedSquad.description,
        generalStrategy: matchedSquad.generalStrategy,
        toon1Id: matchedSquad.toon1Id,
        toon2Id: matchedSquad.toon2Id,
        toon3Id: matchedSquad.toon3Id,
        toon4Id: matchedSquad.toon4Id,
        toon5Id: matchedSquad.toon5Id,
      },
    };
  };

  const checkExistingLeftSquad = async (squadToCheck) => {
    const squadLeader = squadToCheck.shift();
    const squadMembers = squadToCheck.slice(0);
    const matchedSquad = squads.find(squad => squad.toon1Name === squadLeader
      && _.isEqual(
        squadMembers.sort(),
        [squad.toon2Name, squad.toon3Name, squad.toon4Name, squad.toon5Name].sort(),
      ));

    if (!matchedSquad) {
      return {
        squadMatch: '',
        isNewCounter: true,
        isNewSquad: true,
        generalStrategy: '',
        sourceGeneralStrategy: '',
        description: '',
        sourceDescription: '',
        tempSquadInfo: {
          id: '',
          name: tempLeftSquadInfo.name,
          toon1Id: (characters.find(x => x.name === squadLeader)).id || 'BLANK',
          toon2Id: (characters.find(x => x.name === squadMembers[0])).id || 'BLANK',
          toon3Id: (characters.find(x => x.name === squadMembers[1])).id || 'BLANK',
          toon4Id: (characters.find(x => x.name === squadMembers[2])).id || 'BLANK',
          toon5Id: (characters.find(x => x.name === squadMembers[3])).id || 'BLANK',
        },
      };
    }

    const isNewCounterCheck = await checkExistingCounter(matchedSquad.id, tempSquadInfo.id);

    return {
      squadMatch: matchedSquad.name,
      isNewCounter: isNewCounterCheck,
      isNewSquad: false,
      generalStrategy: matchedSquad.generalStrategy,
      sourceGeneralStrategy: matchedSquad.generalStrategy,
      description: matchedSquad.description,
      sourceDescription: matchedSquad.description,
      tempSquadInfo: {
        id: matchedSquad.id,
        name: matchedSquad.name,
        toon1Id: matchedSquad.toon1Id,
        toon2Id: matchedSquad.toon2Id,
        toon3Id: matchedSquad.toon3Id,
        toon4Id: matchedSquad.toon4Id,
        toon5Id: matchedSquad.toon5Id,
      },
    };
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
      if (indexToFill < size.charAt(0)) {
        tempSquadCopy[indexToFill] = addedToon;
      }
      setTempSquad(tempSquadCopy);

      const currentSquadNames = await tempSquadCopy.map(x => x.name);
      const squadCheck = await checkExistingSquad(currentSquadNames);
      setIsNewCounter(squadCheck.isNewCounter);
      setIsNewSquad(squadCheck.isNewSquad);
      setSquadMatch(squadCheck.squadMatch);
      setTempSquadInfo(squadCheck.tempSquadInfo);
    }
  };

  const addLeftCharacter = async (e) => {
    e.preventDefault();
    const addedToon = {
      id: e.currentTarget.id,
      name: e.currentTarget.title,
      isReq: false,
      zetas: [],
    };

    const tempLeftSquadCopy = [...tempLeftSquad];
    const tempLeftSquadIds = tempLeftSquadCopy.map(x => x.id);

    if (!tempLeftSquadIds.includes(addedToon.id)) {
      const indexToFill = await tempLeftSquadCopy.findIndex(x => x.id === 'BLANK');
      addedToon.isReq = indexToFill === 0;
      if (indexToFill < size.charAt(0)) {
        tempLeftSquadCopy[indexToFill] = addedToon;
      }
      setTempLeftSquad(tempLeftSquadCopy);

      const currentSquadNames = await tempLeftSquadCopy.map(x => x.name);
      const squadCheck = await checkExistingLeftSquad(currentSquadNames);
      setGeneralStrategy(squadCheck.generalStrategy);
      setDescription(squadCheck.description);
      setIsNewCounter(squadCheck.isNewCounter);
      setIsNewLeftSquad(squadCheck.isNewSquad);
      setSourceGeneralStrategy(squadCheck.sourceGeneralStrategy);
      setSourceDescription(squadCheck.sourceDescription);
      setSquadMatch(squadCheck.squadMatch);
      setTempLeftSquadInfo(squadCheck.tempSquadInfo);
    }
  };

  const removeCharacter = async (e) => {
    e.preventDefault();
    const { id, title } = e.target;
    const buttonIndex = id[id.length - 1];
    const tempSquadCopy = [...tempSquad];
    tempSquadCopy[buttonIndex] = defaultToon;
    setTempSquad(tempSquadCopy);

    const currentSquadNames = tempSquad.map(x => x.name);
    const index = currentSquadNames.indexOf(title);
    index !== -1 ? currentSquadNames[index] = 'Blank' : ''; // eslint-disable-line no-unused-expressions

    const squadCheck = await checkExistingSquad(currentSquadNames);
    setIsNewCounter(squadCheck.isNewCounter);
    setIsNewSquad(squadCheck.isNewSquad);
    setSquadMatch(squadCheck.squadMatch);
    setTempSquadInfo(squadCheck.tempSquadInfo);
  };

  const removeLeftCharacter = async (e) => {
    e.preventDefault();
    const { id, title } = e.target;
    const buttonIndex = id[id.length - 1];
    const tempLeftSquadCopy = [...tempLeftSquad];
    tempLeftSquadCopy[buttonIndex] = defaultToon;
    setTempLeftSquad(tempLeftSquadCopy);

    const currentSquadNames = tempLeftSquad.map(x => x.name);
    const index = currentSquadNames.indexOf(title);
    index !== -1 ? currentSquadNames[index] = 'Blank' : ''; // eslint-disable-line no-unused-expressions

    const squadCheck = await checkExistingLeftSquad(currentSquadNames);
    setIsNewCounter(squadCheck.isNewCounter);
    setIsNewLeftSquad(squadCheck.isNewSquad);
    setGeneralStrategy(squadCheck.generalStrategy);
    setDescription(squadCheck.description);
    setSourceGeneralStrategy(squadCheck.sourceGeneralStrategy);
    setSourceDescription(squadCheck.sourceDescription);
    setTempLeftSquadInfo(squadCheck.tempSquadInfo);
  };

  const handleGeneralStrategyInput = (e) => {
    e.preventDefault();
    setGeneralStrategy(e.target.value || e.target.innerText);
  };

  const handleGeneralStrategyReset = (e) => {
    e.preventDefault();
    setGeneralStrategy(sourceGeneralStrategy);
  };

  const handleDescriptionInput = (e) => {
    e.preventDefault();
    setDescription(e.target.value || e.target.innerText);
  };

  const handleDescriptionReset = (e) => {
    e.preventDefault();
    setDescription(sourceDescription);
  };

  const handleSubmitButton = async (e) => {
    e.preventDefault();
    // blocks submission if this counter already exists, if the squad name is in use,
    // the squad name is blank, or the squad leader is blank
    if (!isNewCounter
      || !!squadNameMatch
      || tempSquadInfo.name === ''
      || tempSquad[0].id === 'BLANK') {
      console.error('please add or correct squad name or members');
    } else {
      try {
        let leftSquadId;
        let leftSquadStatus;
        let rightSquadId;
        let rightSquadStatus;

        if (tempLeftSquadInfo.id) {
          const updatedSquadStatus = await updateSquad({
            name: tempLeftSquadInfo.name,
            id: tempLeftSquadInfo.id,
            description,
            generalStrategy,
            toon1Id: tempLeftSquad[0].id,
            toon2Id: tempLeftSquad[1].id,
            toon3Id: tempLeftSquad[2].id,
            toon4Id: tempLeftSquad[3].id,
            toon5Id: tempLeftSquad[4].id,
            userId: user.id,
            username: user.username,
          });
          leftSquadId = tempLeftSquadInfo.id;
          leftSquadStatus = updatedSquadStatus;
        } else {
          const newSquad = await addSquad({
            name: tempLeftSquadInfo.name,
            description,
            generalStrategy,
            toon1Id: tempLeftSquad[0].id,
            toon2Id: tempLeftSquad[1].id,
            toon3Id: tempLeftSquad[2].id,
            toon4Id: tempLeftSquad[3].id,
            toon5Id: tempLeftSquad[4].id,
            userId: user.id,
            username: user.username,
          });
          leftSquadId = newSquad.squadId;
          leftSquadStatus = newSquad.status;
        }

        if (tempSquadInfo.id) {
          const updatedSquadStatus = await updateSquad({
            name: tempSquadInfo.name,
            id: tempSquadInfo.id,
            description: tempSquadInfo.description,
            generalStrategy: tempSquadInfo.generalStrategy,
            toon1Id: tempSquad[0].id,
            toon2Id: tempSquad[1].id,
            toon3Id: tempSquad[2].id,
            toon4Id: tempSquad[3].id,
            toon5Id: tempSquad[4].id,
            userId: user.id,
            username: user.username,
          });
          rightSquadId = tempSquadInfo.id;
          rightSquadStatus = updatedSquadStatus;
        } else {
          const newSquad = await addSquad({
            name: tempSquadInfo.name,
            description: '',
            generalStrategy: '',
            toon1Id: tempSquad[0].id,
            toon2Id: tempSquad[1].id,
            toon3Id: tempSquad[2].id,
            toon4Id: tempSquad[3].id,
            toon5Id: tempSquad[4].id,
            userId: user.id,
            username: user.username,
          });
          rightSquadId = newSquad.squadId;
          rightSquadStatus = newSquad.status;
        }

        if (leftSquadStatus === 'ok' && rightSquadStatus === 'ok') {
          const counterResponse = await addCounter({
            opponentSquadId: leftSquadId,
            counterSquadId: rightSquadId,
            isHardCounter,
            battleType: size,
            counterStrategy: strategy.value,
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

          if (counterResponse.status === 'ok') {
            await Promise.all(videoLinks.map(async (videoLink) => {
              if (!videoLink.deleteVideo && videoLink.link !== '') {
                await addVideoLink({
                  subjectId: counterResponse.counterId,
                  title: videoLink.title,
                  link: videoLink.link,
                  userId: user.id,
                  username: user.username,
                });
              }
            }));
          }
        }
      } catch (err) {
        throw err;
      }

      toggle();
      reload();
    }
  };

  const closeBtn = <button className="close text-white" onClick={toggle}>&times;</button>;

  return (
    <ModalWrapper isOpen={isOpen} toggle={toggle}>
      <StyledModalHeader close={closeBtn}>Add Counter</StyledModalHeader>

      <StyledModalBody>
        <StyledForm>
        {/* Left-side squad top header */}
          {/* New squad form */}
          <FormLeftSide $isCompact>
            <div>
              {/* Opponent Squad details */}
              <h6 className="text-secondary pb-3">Opponent Squad Name</h6>
              <SquadDetailForm
                buildDefaultSquad={buildDefaultSquad}
                checkExistingSquad={checkExistingLeftSquad}
                defaultTempSquadInfo={defaultTempSquadInfo}
                isNewSquad={isNewLeftSquad}
                setGeneralStrategy={setGeneralStrategy}
                setDescription={setDescription}
                setIsNewCounter={setIsNewCounter}
                setIsNewSquad={setIsNewLeftSquad}
                setSourceGeneralStrategy={setSourceGeneralStrategy}
                setSourceDescription={setSourceDescription}
                setSquadNameMatch={setLeftSquadNameMatch}
                setTempSquadInfo={setTempLeftSquadInfo}
                setTempSquad={setTempLeftSquad}
                size={size}
                squadNameMatch={leftSquadNameMatch}
                squads={squads}
                tempSquadInfo={tempLeftSquadInfo}
              />
              <OpponentBox>
                <h6 className="text-secondary pt-3">Opponent Squad</h6>
                <LockBtn index={0}/>
                <NewSquadDisplay
                  hideLocks
                  isCompact
                  removeCharacter={removeLeftCharacter}
                  setTempSquad={setTempLeftSquad}
                  size={size}
                  tempSquad={tempLeftSquad}
                />
              </OpponentBox>
              <CharacterPool
                addCharacter={addLeftCharacter}
                characters={characters}
                isCompact
              />

              <div>
                {/* Opponent Squad Description Box */}
                <MiddleWrapper $hasMarginBottom={!sourceDescription}>
                  <Label for="squadDescriptionInput" className="text-secondary pb-3">Opponent Squad Description</Label>
                  <Input
                    name="squadDescriptionInput"
                    placeholder={'Please provide a brief description for the Opponent Squad.  This could include battle mechanics, the primary game mode in which they are used, or any stand-out details that would help players better grasp the purpose of this squad.'}
                    rows="5"
                    type="textarea"
                    value={description}
                    onChange={handleDescriptionInput}
                  />

                  {
                    sourceDescription && <EditMenu className="align-self-end">
                      <Button color="link" size="sm" className="mb-0" onClick={handleDescriptionReset}>reset</Button>
                    </EditMenu>
                  }
                </MiddleWrapper>

                {/* Opponent Squad General Strategy Box */}
                <MiddleWrapper $hasBorderBottom={!sourceGeneralStrategy} $hasPaddingBottom={!sourceGeneralStrategy}> {/* eslint-disable-line max-len */}
                  <Label for="generalStrategyInput" className="text-secondary pb-3">Opponent Squad General Strategy</Label>
                  <Input
                    name="generalStrategyInput"
                    placeholder={'Please provide any general strategies, mechanics, or techniques needed to beat the Opponent Squad.  This should not include any specific counter squads!'}
                    rows="10"
                    type="textarea"
                    value={generalStrategy}
                    onChange={handleGeneralStrategyInput}
                  />

                  {
                    sourceGeneralStrategy && <EditMenu className="align-self-end">
                      <Button color="link" size="sm" className="mb-0" onClick={handleGeneralStrategyReset}>reset</Button>
                    </EditMenu>
                  }
                </MiddleWrapper>
              </div>
            </div>
          </FormLeftSide>

          <FormRightSide>
            <div>
              {/* Counter Squad details */}
              <h6 className="text-secondary pb-3">Counter Squad Name</h6>
              {tempSquadInfo && <CounterDetailForm
                buildDefaultSquad={buildDefaultSquad}
                checkExistingSquad={checkExistingSquad}
                defaultTempSquadInfo={defaultTempSquadInfo}
                isHardCounter={isHardCounter}
                isNewCounter={isNewCounter}
                isNewSquad={isNewSquad}
                setIsHardCounter={setIsHardCounter}
                setIsNewCounter={setIsNewCounter}
                setIsNewSquad={setIsNewSquad}
                setSquadMatch={setSquadMatch}
                setSquadNameMatch={setSquadNameMatch}
                setTempSquad={setTempSquad}
                setTempSquadInfo={setTempSquadInfo}
                size={size}
                squadNameMatch={squadNameMatch}
                squads={squads}
                tempSquadInfo={tempSquadInfo}
              />}
              <OpponentBox>
                <h6 className="text-secondary pt-3">Counter Squad</h6>
                <NewSquadDisplay
                  color={isHardCounter ? colors.hardCounter : colors.softCounter}
                  isCompact
                  removeCharacter={removeCharacter}
                  setTempSquad={setTempSquad}
                  size={size}
                  tempSquad={tempSquad}
                />
              </OpponentBox>
              <CharacterPool
                addCharacter={addCharacter}
                characters={characters}
                isCompact
              />

            <div>
                {/* Counter Squad Zeta Box */}
                {<ZetaForm
                  characters={characters}
                  setTempSquad={setTempSquad}
                  tempSquad={tempSquad}
                />}

                {/* Counter Squad Counter Strategy Box */}
                {<FormStrategy>
                  <Label for="generalStrategyInput" className="text-secondary pb-3">Counter Strategy</Label>
                  <Input
                    name="generalStrategyInput"
                    placeholder={'Please explain how to beat the Opponent Squad with this Counter Squad'}
                    rows="10"
                    type="textarea"
                    {...strategy}
                  />
                </FormStrategy>}

                {<VideoForm
                checkIfVideoLinksAreValid={checkIfVideoLinksAreValid}
                setAreVideoTitlesTooLong={setAreVideoTitlesTooLong}
                setVideoLinks={setVideoLinks}
                videoLinks={videoLinks}
              />}
              </div>
            </div>
          </FormRightSide>
        </StyledForm>
      </StyledModalBody>

      <StyledModalFooter>
        {
          isNewSquad
            && isNewLeftSquad
            && tempSquadInfo.name !== ''
            && tempSquadInfo.name === tempLeftSquadInfo.name
            && <div className="alert alert-danger">Both new squads can't have the same name</div>
        }
        <Button color="primary" onClick={handleSubmitButton}
          disabled={
            areVideoTitlesTooLong
            || !areVideoLinksValid
            || !isNewCounter
            || !!squadNameMatch
            || tempSquadInfo.name === ''
            || tempLeftSquadInfo.name === ''
            || (isNewLeftSquad && tempSquadInfo.name === tempLeftSquadInfo.name)
            || tempSquad[0].id === 'BLANK'
            }>Submit</Button>
        <Button color="secondary" onClick={toggle}>Cancel</Button>
      </StyledModalFooter>
    </ModalWrapper>
  );
}
