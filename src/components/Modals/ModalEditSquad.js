import React, { useEffect, useState } from 'react';
import { Button, Input, Label } from 'reactstrap';
import PropTypes from 'prop-types';
import _ from 'lodash';

import SquadHeader from 'src/components/shared/SquadHeader';
import { updateSquad } from 'src/helpers/data';
import { EditMenu } from 'src/styles/style';

// import CharacterPool from './CharacterPool';
// import NewSquadDisplay from './NewSquadDisplay';
import SquadDetailForm from './SquadDetailForm';
import {
  FormCentered,
  // FormLeftSide,
  // FormRightSide,
  FormStrategy,
  MiddleWrapper,
  ModalWrapper,
  // OpponentBox,
  StyledForm,
  StyledModalBody,
  StyledModalFooter,
  StyledModalHeader,
} from './style';

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
};

const buildDefaultSquad = () => {
  const defaultSquad = [];
  for (let i = 0; i < 5; i += 1) {
    defaultSquad.push(defaultToon);
  }
  return defaultSquad;
};

// TODO: Add tests
export default function ModalEditSquad({
  isOpen,
  squad: squadParam,
  reload,
  size,
  toggle,
  user,
  ...props
}) {
  ModalEditSquad.propTypes = {
    isOpen: PropTypes.bool,
    squad: PropTypes.object,
    reload: PropTypes.func,
    size: PropTypes.string,
    toggle: PropTypes.func.isRequired,
    user: PropTypes.object,
  };

  const storedCharacters = JSON.parse(sessionStorage.getItem('characters')) || [];
  const storedSquads = JSON.parse(sessionStorage.getItem('squads')) || [];

  const [characters] = useState(storedCharacters);
  // const [doesTempMatchSource, setDoesTempMatchSource] = useState(false);
  const [squad] = useState(squadParam);
  const [sourceSquad, setSourceSquad] = useState();
  const [description, setDescription] = useState(squad.description);
  const [counterStrategy, setCounterStrategy] = useState(squad.counterStrategy);
  const [squads] = useState(storedSquads);
  // const [squadMatch, setSquadMatch] = useState('');
  const [squadNameMatch, setSquadNameMatch] = useState('');
  const [tempSquad, setTempSquad] = useState(buildDefaultSquad());
  const [tempSquadInfo, setTempSquadInfo] = useState(defaultTempSquadInfo);

  useEffect(() => {
    const squadToEdit = { ...squadParam };
    const {
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

    async function buildTempSquad() {
      const toon1 = {
        id: toon1Id,
        name: toon1Name,
      };
      const toon2 = {
        id: toon2Id,
        name: toon2Name,
      };
      const toon3 = {
        id: toon3Id,
        name: toon3Name,
      };
      const toon4 = {
        id: toon4Id,
        name: toon4Name,
      };
      const toon5 = {
        id: toon5Id,
        name: toon5Name,
      };

      const sourceSquadToSet = [toon1, toon2, toon3, toon4, toon5];
      await setTempSquadInfo({
        id,
        name,
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
  }, [squadParam]);

  const checkExistingSquad = async (squadToCheck) => {
    const squadLeader = squadToCheck.shift();
    const squadMembers = squadToCheck.slice(0);
    const matchedSquad = await squads.find(x => x.toon1Name === squadLeader
      && _.isEqual(
        squadMembers.sort(),
        [x.toon2Name, x.toon3Name, x.toon4Name, x.toon5Name].sort(),
      ));

    if (!matchedSquad) {
      return {
        squadMatch: '',
        tempSquadInfo: {
          id: squad.id,
          name: tempSquadInfo.name,
          toon1Id: (characters.find(x => x.name === squadLeader)).id || 'BLANK',
          toon2Id: (characters.find(x => x.name === squadMembers[0])).id || 'BLANK',
          toon3Id: (characters.find(x => x.name === squadMembers[1])).id || 'BLANK',
          toon4Id: (characters.find(x => x.name === squadMembers[2])).id || 'BLANK',
          toon5Id: (characters.find(x => x.name === squadMembers[3])).id || 'BLANK',
        },
      };
    }

    return {
      squadMatch: matchedSquad.name === squad.name ? '' : matchedSquad.name,
      tempSquadInfo: {
        id: matchedSquad.id,
        name: tempSquadInfo.name,
        toon1Id: matchedSquad.toon1Id,
        toon2Id: matchedSquad.toon2Id,
        toon3Id: matchedSquad.toon3Id,
        toon4Id: matchedSquad.toon4Id,
        toon5Id: matchedSquad.toon5Id,
      },
    };
  };

  // useEffect(() => {
  //   async function checkForSourceSquad() {
  //     if (sourceSquad) {
  //       const tempIds = tempSquad.map(x => x.id).toString();
  //       const sourceIds = sourceSquad.map(x => x.id).toString();
  //       tempIds === sourceIds
  //         ? await setDoesTempMatchSource(true)
  //         : await setDoesTempMatchSource(false);
  //     }
  //   }

  //   checkForSourceSquad();
  // }, [sourceSquad, tempSquad]);

  // const addCharacter = async (e) => {
  //   e.preventDefault();
  //   const addedToon = {
  //     id: e.currentTarget.id,
  //     name: e.currentTarget.title,
  //   };

  //   const tempSquadCopy = [...tempSquad];
  //   const tempSquadIds = tempSquadCopy.map(x => x.id);

  //   if (!tempSquadIds.includes(addedToon.id)) {
  //     const indexToFill = await tempSquadCopy.findIndex(x => x.id === 'BLANK');
  //     tempSquadCopy[indexToFill] = addedToon;
  //     setTempSquad(tempSquadCopy);

  //     const currentSquadNames = await tempSquadCopy.map(x => x.name);
  //     const squadCheck = await checkExistingSquad(currentSquadNames);
  //     if (!squadCheck.squadMatch) {
  //       setSquadMatch(squadCheck.squadMatch);
  //       setTempSquadInfo(squadCheck.tempSquadInfo);
  //     } else {
  //       setSquadMatch(squadCheck.squadMatch);
  //       setTempSquadInfo(squadCheck.tempSquadInfo);
  //     }
  //   }
  // };

  // const removeCharacter = async (e) => {
  //   e.preventDefault();
  //   const { id, title } = e.target;
  //   const buttonIndex = id[id.length - 1];
  //   const tempSquadCopy = [...tempSquad];
  //   tempSquadCopy[buttonIndex] = defaultToon;
  //   setTempSquad(tempSquadCopy);

  //   const currentSquadNames = tempSquad.map(x => x.name);
  //   const index = currentSquadNames.indexOf(title);
  //   index !== -1 ? currentSquadNames[index] = 'Blank' : ''; // eslint-disable-line no-unused-expressions
  //   const squadCheck = await checkExistingSquad(currentSquadNames);
  //   if (!squadCheck.squadMatch) {
  //     setSquadMatch(squadCheck.squadMatch);
  //     setTempSquadInfo(squadCheck.tempSquadInfo);
  //   } else {
  //     setSquadMatch(squadCheck.squadMatch);
  //     setTempSquadInfo(squadCheck.tempSquadInfo);
  //   }
  // };

  const handleCounterStrategyInput = (e) => {
    e.preventDefault();
    setCounterStrategy(e.target.value || e.target.innerText);
  };

  const handleCounterStrategyReset = (e) => {
    e.preventDefault();
    setCounterStrategy(squad.counterStrategy);
  };

  const handleDescriptionInput = (e) => {
    e.preventDefault();
    setDescription(e.target.value || e.target.innerText);
  };

  const handleDescriptionReset = (e) => {
    e.preventDefault();
    setDescription(squad.description);
  };

  const handleSubmitButton = async (e) => {
    e.preventDefault();
    // if (!!squadMatch
    //   || tempSquad[0].id === 'BLANK') {
    //   console.error('please add or correct squad members');
    // } else {
    try {
      await updateSquad({
        name: tempSquadInfo.name || squad.name,
        id: tempSquadInfo.id,
        description,
        counterStrategy,
        toon1Id: tempSquad[0].id,
        toon2Id: tempSquad[1].id,
        toon3Id: tempSquad[2].id,
        toon4Id: tempSquad[3].id,
        toon5Id: tempSquad[4].id,
        userId: user.id,
        username: user.username,
      });

      toggle();
      reload();
    } catch (err) {
      throw new Error(err);
    }
    // }
  };

  const closeBtn = <button className="close text-white" onClick={toggle}>&times;</button>;

  return (
    <ModalWrapper isOpen={isOpen} toggle={toggle}>
      <StyledModalHeader close={closeBtn}>Edit Squad</StyledModalHeader>

      <StyledModalBody>
        <StyledForm>
        {/* Left-side squad top header */}
          {/* New squad form */}
          <FormCentered>
          {/* <FormLeftSide> */}
            <SquadHeader size={size} squad={squad} />
            {/* <OpponentBox>
              <NewSquadDisplay
                doesTempMatchSource={doesTempMatchSource}
                hideLocks
                removeCharacter={removeCharacter}
                setTempSquad={setTempSquad}
                size={size}
                sourceSquad={sourceSquad}
                squadMatch={squadMatch}
                tempSquad={tempSquad}
              />
            </OpponentBox>
            <CharacterPool
              addCharacter={addCharacter}
              characters={characters}
            /> */}
          {/* </FormLeftSide> */}

          {/* <FormRightSide> */}
            {/* Squad details */}
            <h6 className="text-secondary pt-3">Squad Name</h6>
            <SquadDetailForm
              buildDefaultSquad={buildDefaultSquad}
              checkExistingSquad={checkExistingSquad}
              defaultTempSquadInfo={defaultTempSquadInfo}
              setSquadNameMatch={setSquadNameMatch}
              setTempSquadInfo={setTempSquadInfo}
              setTempSquad={setTempSquad}
              sourceSquad={sourceSquad}
              squad={squad}
              squadNameMatch={squadNameMatch}
              squads={squads}
              tempSquadInfo={tempSquadInfo}
            />

            <div>
              {/* Description Box */}
              <MiddleWrapper $hasBorderBottom>
                <Label for="squadDescriptionInput" className="text-secondary pb-3">Description</Label>
                <Input
                  name="squadDescriptionInput"
                  placeholder={squad && `Please provide a brief description for ${squad.name}.  This could include battle mechanics, the primary game mode in which they are used, or any stand-out details that would help players better grasp the purpose of this squad.`}
                  rows="5"
                  type="textarea"
                  value={description}
                  onChange={handleDescriptionInput}
                />

                {
                  sourceSquad && <EditMenu className="align-self-end">
                    <Button color="link" size="sm" className="mb-0" onClick={handleDescriptionReset}>reset</Button>
                  </EditMenu>
                }
              </MiddleWrapper>

              {/* General Strategy Box */}
              <FormStrategy>
                <Label for="generalStrategyInput" className="text-secondary pb-3">General Strategy</Label>
                <Input
                  name="generalStrategyInput"
                  placeholder={squad && `Please provide any general strategies, mechanics, or techniques needed to beat ${squad.name}.  This should not include any specific counter squads!`}
                  rows="10"
                  type="textarea"
                  value={counterStrategy}
                  onChange={handleCounterStrategyInput}
                />

                {
                  sourceSquad && <EditMenu className="align-self-end">
                    <Button color="link" size="sm" className="mb-0" onClick={handleCounterStrategyReset}>reset</Button>
                  </EditMenu>
                }
              </FormStrategy>
            </div>
          {/* </FormRightSide> */}
          </FormCentered>
        </StyledForm>
      </StyledModalBody>

      <StyledModalFooter>
        <Button color="primary" onClick={handleSubmitButton}
          // disabled={ !!squadMatch
          disabled={!!squadNameMatch
            || tempSquad[0].id === 'BLANK' }>Submit</Button>
        <Button color="secondary" onClick={toggle}>Cancel</Button>
      </StyledModalFooter>
    </ModalWrapper>
  );
}
