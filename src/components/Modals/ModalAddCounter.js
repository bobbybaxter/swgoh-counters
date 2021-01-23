import React, { useEffect, useState } from 'react';
import { Button, Input, Label } from 'reactstrap';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { isWebUri } from 'valid-url';

import SquadHeader from 'src/components/shared/SquadHeader';
import { useInputValue } from 'src/helpers/';
import { addCounter, addSquad, addVideoLink } from 'src/helpers/data';

import { colors } from 'src/styles/colors';
import CharacterPool from './CharacterPool';
import NewSquadDisplay from './NewSquadDisplay';
import CounterDetailForm from './CounterDetailForm';
import ZetaForm from './ZetaForm';
import VideoForm from './VideoForm';
import {
  FormLeftSide,
  FormRightSide,
  FormStrategy,
  ModalWrapper,
  OpponentBox,
  StyledForm,
  StyledModalBody,
  StyledModalFooter,
  StyledModalHeader,
} from './style';

const defaultTempSquadInfo = {
  id: '',
  name: '',
  description: '',
  generalStrategy: '',
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

// TODO: Add tests
export default function ModalAddCounter({
  counterStubs,
  isOpen,
  leftSquadStub,
  reload,
  size,
  toggle,
  user,
  ...props
}) {
  ModalAddCounter.propTypes = {
    counterStubs: PropTypes.object.isRequired,
    isOpen: PropTypes.bool.isRequired,
    leftSquadStub: PropTypes.object,
    reload: PropTypes.func,
    size: PropTypes.string,
    toggle: PropTypes.func.isRequired,
    user: PropTypes.object,
  };

  const storedCharacters = JSON.parse(sessionStorage.getItem('characters')) || [];
  const storedSquads = JSON.parse(sessionStorage.getItem('squads')) || [];

  const [areVideoLinksValid, setAreVideoLinksValid] = useState(true);
  const [areVideoTitlesTooLong, setAreVideoTitlesTooLong] = useState(false);
  const [characters] = useState(storedCharacters);
  const [isHardCounter, setIsHardCounter] = useState(false);
  const [isNewCounter, setIsNewCounter] = useState(true);
  const [isNewSquad, setIsNewSquad] = useState(true);
  const [leftSquad, setLeftSquad] = useState();
  const strategy = useInputValue('');
  const [squads] = useState(storedSquads);
  const [squadMatch, setSquadMatch] = useState('');
  const [squadNameMatch, setSquadNameMatch] = useState('');
  const [tempSquad, setTempSquad] = useState(buildDefaultSquad());
  const [tempSquadInfo, setTempSquadInfo] = useState(defaultTempSquadInfo);
  const [videoLinks, setVideoLinks] = useState([]);

  useEffect(() => {
    async function getLeftSquad() {
      const matchedLeftSquad = squads.find(x => x.id === leftSquadStub.id);
      await setLeftSquad(matchedLeftSquad);
    }

    getLeftSquad();
  }, [leftSquadStub.id, squads]);

  const checkIfVideoLinksAreValid = (updatedLinks) => {
    const isInvalid = updatedLinks.some(videoLink => !isWebUri(videoLink.link));
    setAreVideoLinksValid(!isInvalid);
  };

  const checkExistingSquad = async (squadToCheck) => {
    const squadLeader = squadToCheck.shift();
    const squadMembers = squadToCheck.slice(0);
    const matchedSquad = await squads.find(squad => squad.toon1Name === squadLeader
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

    return {
      squadMatch: matchedSquad.name,
      isNewCounter: !counterStubs.rightSquadStubs.find(x => x.id === matchedSquad.id),
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
      setSquadMatch(squadCheck.squadMatch);
      setIsNewCounter(squadCheck.isNewCounter);
      setIsNewSquad(squadCheck.isNewSquad);
      setTempSquadInfo(squadCheck.tempSquadInfo);
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
    setSquadMatch(squadCheck.squadMatch);
    setIsNewCounter(squadCheck.isNewCounter);
    setIsNewSquad(squadCheck.isNewSquad);
    setTempSquadInfo(squadCheck.tempSquadInfo);
  };

  const handleSubmitButton = async (e) => {
    e.preventDefault();
    // blocks submission if this counter already exists, if the squad name is in use,
    // the squad name is blank, or the squad leader is blank
    if (!isNewCounter
      || !!squadMatch
      || tempSquadInfo.name === ''
      || tempSquad[0].id === 'BLANK') {
      console.error('please add or correct squad name or members');
    } else {
      if (!tempSquadInfo.id) {
        try {
          // if this is a new squad, create a new squad then add counter
          const addSquadResponse = await addSquad({
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

          if (addSquadResponse.status === 'ok') {
            const counterResponse = await addCounter({
              opponentSquadId: leftSquadStub.id,
              counterSquadId: addSquadResponse.squadId,
              isHardCounter: isHardCounter ? 1 : 0,
              battleType: size,
              description: strategy.value,
              isToon2Req: tempSquad[1].isReq ? 1 : 0,
              isToon3Req: tempSquad[2].isReq ? 1 : 0,
              isToon4Req: tempSquad[3].isReq ? 1 : 0,
              isToon5Req: tempSquad[4].isReq ? 1 : 0,
              toon1Zetas: tempSquad[0].zetas.toString(),
              toon2Zetas: tempSquad[1].zetas.toString(),
              toon3Zetas: tempSquad[2].zetas.toString(),
              toon4Zetas: tempSquad[3].zetas.toString(),
              toon5Zetas: tempSquad[4].zetas.toString(),
              userId: user.id,
              username: user.username,
            });

            if (counterResponse.status === 'ok') {
              videoLinks.forEach((videoLink) => {
                if (!videoLink.deleteVideo && videoLink.link !== '') {
                  addVideoLink({
                    subjectId: counterResponse.counterId,
                    title: videoLink.title,
                    link: videoLink.link,
                    userId: user.id,
                    username: user.username,
                  });
                }
              });

              toggle();
              reload();
            }
          }
        } catch (err) {
          throw new Error(err);
        }
      }

      if (tempSquadInfo.id) {
        try {
        // if this is an existing squad, just add the counter
          await addCounter({
            opponentSquadId: leftSquadStub.id,
            counterSquadId: tempSquadInfo.id,
            isHardCounter: isHardCounter ? 1 : 0,
            battleType: size,
            description: strategy.value,
            isToon2Req: tempSquad[1].isReq ? 1 : 0,
            isToon3Req: tempSquad[2].isReq ? 1 : 0,
            isToon4Req: tempSquad[3].isReq ? 1 : 0,
            isToon5Req: tempSquad[4].isReq ? 1 : 0,
            toon1Zetas: tempSquad[0].zetas.toString(),
            toon2Zetas: tempSquad[1].zetas.toString(),
            toon3Zetas: tempSquad[2].zetas.toString(),
            toon4Zetas: tempSquad[3].zetas.toString(),
            toon5Zetas: tempSquad[4].zetas.toString(),
          });
          toggle();
          reload();
        } catch (err) {
          throw new Error(err);
        }
      }
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
          <FormLeftSide>
            <OpponentBox>
              {leftSquad && <SquadHeader size={size} squad={leftSquad} />}
              <h6 className="text-secondary mb-1">vs</h6>
              <NewSquadDisplay
                color={isHardCounter ? colors.hardCounter : colors.softCounter}
                removeCharacter={removeCharacter}
                setTempSquad={setTempSquad}
                size={size}
                tempSquad={tempSquad}
              />
            </OpponentBox>
            <CharacterPool
              addCharacter={addCharacter}
              characters={characters}
            />
          </FormLeftSide>

          <FormRightSide>
              {/* Squad details */}
            <h6 className="text-secondary pb-3">Counter Squad Name</h6>
            <CounterDetailForm
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
              tempSquadInfo={tempSquadInfo}
              squadNameMatch={squadNameMatch}
              squads={squads}
            />

            <div>
              {/* Zetas */}
              {isNewCounter && <ZetaForm
                characters={characters}
                setTempSquad={setTempSquad}
                tempSquad={tempSquad}
              />}

              {/* Counter Strategy Box */}
              {isNewCounter && <FormStrategy>
                <Label for="counterStrategyInput" className="text-secondary pb-3">Counter Strategy</Label>
                <Input
                  name="counterStrategyInput"
                  placeholder={leftSquad && `Please explain how to beat ${leftSquad.name} with this counter.`}
                  rows="10"
                  type="textarea"
                  {...strategy}
                />
              </FormStrategy>}

              {isNewCounter && <VideoForm
                checkIfVideoLinksAreValid={checkIfVideoLinksAreValid}
                setAreVideoTitlesTooLong={setAreVideoTitlesTooLong}
                setVideoLinks={setVideoLinks}
                videoLinks={videoLinks}
              />}
            </div>
          </FormRightSide>
        </StyledForm>
      </StyledModalBody>

      <StyledModalFooter>
        <Button color="primary" onClick={handleSubmitButton}
          disabled={ areVideoTitlesTooLong
            || !areVideoLinksValid
            || !isNewCounter
            || !!squadNameMatch
            || tempSquadInfo.name === ''
            || tempSquad[0].id === 'BLANK' }>Submit</Button>
        <Button color="secondary" onClick={toggle}>Cancel</Button>
      </StyledModalFooter>
    </ModalWrapper>
  );
}
