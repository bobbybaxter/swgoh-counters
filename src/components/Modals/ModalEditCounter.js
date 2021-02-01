import React, { useEffect, useState } from 'react';
import { Button, Input, Label } from 'reactstrap';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { isWebUri } from 'valid-url';

import SquadHeader from 'src/components/shared/SquadHeader';
import {
  addVideoLink, deleteVideoLink, updateCounter, updateSquad, updateVideoLink,
} from 'src/helpers/data';
import { colors } from 'src/styles/colors';
import { EditMenu } from 'src/styles/style';

import NewSquadDisplay from './NewSquadDisplay';
import CounterDetailForm from './CounterDetailForm';
import ZetaForm from './ZetaForm';
import VideoForm from './VideoForm';
import {
  FormLeftSide,
  FormRightSide,
  MiddleWrapper,
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

  const [areVideoLinksValid, setAreVideoLinksValid] = useState(true);
  const [areVideoTitlesTooLong, setAreVideoTitlesTooLong] = useState(false);
  const [characters] = useState(storedCharacters);
  const [doesTempMatchSource, setDoesTempMatchSource] = useState(false);
  const [isHardCounter, setIsHardCounter] = useState(counter.isHardCounter);
  const [isNewCounter, setIsNewCounter] = useState(true);
  const [leftSquad] = useState(leftSquadParam);
  const [sourceSquad, setSourceSquad] = useState();
  const [strategy, setStrategy] = useState(counter.counterStrategy);
  const [squads] = useState(storedSquads);
  const [squadMatch] = useState('');
  const [squadNameMatch, setSquadNameMatch] = useState('');
  const [tempSquad, setTempSquad] = useState(buildDefaultSquad());
  const [tempSquadInfo, setTempSquadInfo] = useState(defaultTempSquadInfo);
  const [videoLinks, setVideoLinks] = useState(counter.videoLinks);

  useEffect(() => {
    const squadToEdit = view === 'normal' ? { ...rightSquad } : { ...leftSquadParam };
    const {
      generalStrategy,
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
        generalStrategy,
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

  const checkIfVideoLinksAreValid = (updatedLinks) => {
    const isInvalid = updatedLinks.some(videoLink => !isWebUri(videoLink.link));
    setAreVideoLinksValid(!isInvalid);
  };

  const checkExistingCounter = (squadId) => {
    let counterExists;
    counterExists = !!counterStubs.rightSquadStubs.find(x => x.id === squadId);
    if (squadId === rightSquad.id) {
      counterExists = false;
    }
    return !counterExists;
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
        tempSquadInfo: {
          id: counter.counterSquadId,
          name: view === 'normal' ? rightSquad.name : leftSquad.name,
          description: view === 'normal' ? rightSquad.description : leftSquad.description,
          generalStrategy: view === 'normal' ? rightSquad.generalStrategy : leftSquad.generalStrategy,
          toon1Id: (characters.find(x => x.name === squadLeader)).id || 'BLANK',
          toon2Id: (characters.find(x => x.name === squadMembers[0])).id || 'BLANK',
          toon3Id: (characters.find(x => x.name === squadMembers[1])).id || 'BLANK',
          toon4Id: (characters.find(x => x.name === squadMembers[2])).id || 'BLANK',
          toon5Id: (characters.find(x => x.name === squadMembers[3])).id || 'BLANK',
        },
      };
    }

    return {
      squadMatch: matchedSquad.name === rightSquad.name ? '' : matchedSquad.name,
      isNewCounter: checkExistingCounter(matchedSquad.id),
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

  useEffect(() => {
    async function checkForSourceSquad() {
      // used to pre-populate fields when updating/editing squads and counters
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

  const handleStrategyInput = (e) => {
    e.preventDefault();
    setStrategy(e.target.value || e.target.innerText);
  };

  const handleStrategyReset = (e) => {
    e.preventDefault();
    setStrategy(counter.counterStrategy);
  };

  const handleSubmitButton = async (e) => {
    e.preventDefault();
    if (!isNewCounter
      || !!squadMatch
      || tempSquadInfo.name === ''
      || tempSquad[0].id === 'BLANK') {
      console.error('please add or correct squad name or members');
    } else {
      try {
        const updateSquadResponse = await updateSquad({
          name: tempSquadInfo.name || rightSquad.name,
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

        if (updateSquadResponse === 'ok') {
          await updateCounter({
            id: counter.id,
            opponentSquadId: view === 'normal' ? leftSquad.id : rightSquad.id,
            counterSquadId: view === 'normal' ? rightSquad.id : leftSquad.id,
            isHardCounter: isHardCounter ? 1 : 0,
            battleType: size,
            counterStrategy: strategy,
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

          videoLinks.forEach((videoLink) => {
            if (videoLink.id.length === 21 && videoLink.link !== '') {
              if (videoLink.deleteVideo) {
                deleteVideoLink({
                  id: videoLink.id,
                  subjectId: videoLink.subjectId,
                  userId: user.id,
                  username: user.username,
                });
              } else {
                updateVideoLink({
                  id: videoLink.id,
                  title: videoLink.title,
                  link: videoLink.link,
                  userId: user.id,
                  username: user.username,
                });
              }
            } else if (!videoLink.deleteVideo && videoLink.link !== '') {
              addVideoLink({
                subjectId: counter.id,
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
      } catch (err) {
        throw new Error(err);
      }
    }
  };

  const closeBtn = <button className="close text-white" onClick={toggle}>&times;</button>;

  return (
    <ModalWrapper isOpen={isOpen} toggle={toggle}>
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
                color={isHardCounter ? colors.hardCounter : colors.softCounter}
                setTempSquad={setTempSquad}
                size={size}
                tempSquad={tempSquad}
              />
            </OpponentBox>
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
              rightSquad={rightSquad}
              setIsHardCounter={setIsHardCounter}
              setSquadNameMatch={setSquadNameMatch}
              setIsNewCounter={setIsNewCounter}
              setTempSquadInfo={setTempSquadInfo}
              setTempSquad={setTempSquad}
              tempSquadInfo={tempSquadInfo}
              sourceSquad={sourceSquad}
              squadMatch={squadMatch}
              squadNameMatch={squadNameMatch}
              squads={squads}
            />

            <div>
              {/* Zetas */}
              <ZetaForm
                characters={characters}
                doesTempMatchSource={doesTempMatchSource}
                setTempSquad={setTempSquad}
                sourceSquad={sourceSquad}
                tempSquad={tempSquad}
              />

              {/* Counter Strategy Box */}
              <MiddleWrapper $hasBorderBottom>
                <Label for="generalStrategyInput" className="text-secondary pb-3">Counter Strategy</Label>
                <Input
                  name="generalStrategyInput"
                  placeholder={leftSquad && `Please explain how to beat ${leftSquad.name} with this counter.`}
                  rows="10"
                  type="textarea"
                  value={strategy}
                  onChange={handleStrategyInput}
                />

                {
                  sourceSquad && <EditMenu className="align-self-end">
                    <Button color="link" size="sm" className="mb-0" onClick={handleStrategyReset}>reset</Button>
                  </EditMenu>
                }
              </MiddleWrapper>

              <VideoForm
                checkIfVideoLinksAreValid={checkIfVideoLinksAreValid}
                setAreVideoTitlesTooLong={setAreVideoTitlesTooLong}
                setVideoLinks={setVideoLinks}
                videoLinks={videoLinks}
              />
            </div>
          </FormRightSide>
        </StyledForm>
      </StyledModalBody>

      <StyledModalFooter>
        <Button color="primary" onClick={handleSubmitButton}
          disabled={ areVideoTitlesTooLong
            || !areVideoLinksValid
            || !isNewCounter
            || !!squadMatch
            || !!squadNameMatch
            || tempSquadInfo.name === ''
            || tempSquad[0].id === 'BLANK' }>Submit</Button>
        <Button color="secondary" onClick={toggle}>Cancel</Button>
      </StyledModalFooter>
    </ModalWrapper>
  );
}
