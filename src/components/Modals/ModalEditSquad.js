import React, { useContext, useEffect, useState } from 'react';
import { Button, Input, Label } from 'reactstrap';
import PropTypes from 'prop-types';

import SquadHeader from 'src/components/shared/SquadHeader';
import { updateSquad } from 'src/helpers/data';
import { AuthContext } from 'src/contexts/userContext';
import { EditMenu } from 'src/styles/style';

import {
  FormCentered,
  FormStrategy,
  MiddleWrapper,
  ModalWrapper,
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

export default function ModalEditSquad({
  isOpen,
  squad,
  reload,
  size,
  toggle,
  ...props
}) {
  ModalEditSquad.propTypes = {
    isOpen: PropTypes.bool,
    squad: PropTypes.object,
    reload: PropTypes.func,
    size: PropTypes.string,
    toggle: PropTypes.func.isRequired,
  };

  const [sourceSquad, setSourceSquad] = useState();
  const [description, setDescription] = useState(squad.description);
  const [generalStrategy, setGeneralStrategy] = useState(squad.generalStrategy);
  const [tempSquad, setTempSquad] = useState(buildDefaultSquad());
  const [tempSquadInfo, setTempSquadInfo] = useState(defaultTempSquadInfo);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const squadToEdit = { ...squad };
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
  }, [squad]);

  const handleGeneralStrategyInput = e => {
    e.preventDefault();
    setGeneralStrategy(e.target.value || e.target.innerText);
  };

  const handleGeneralStrategyReset = e => {
    e.preventDefault();
    setGeneralStrategy(squad.generalStrategy);
  };

  const handleDescriptionInput = e => {
    e.preventDefault();
    setDescription(e.target.value || e.target.innerText);
  };

  const handleDescriptionReset = e => {
    e.preventDefault();
    setDescription(squad.description);
  };

  const handleSubmitButton = async e => {
    e.preventDefault();
    try {
      await updateSquad({
        name: tempSquadInfo.name || squad.name,
        id: tempSquadInfo.id,
        description,
        generalStrategy,
        toon1Id: tempSquad[0].id,
        toon2Id: tempSquad[1].id,
        toon3Id: tempSquad[2].id,
        toon4Id: tempSquad[3].id,
        toon5Id: tempSquad[4].id,
        userId: user.id,
        username: user.username,
      });
    } catch (err) {
      throw err;
    }

    toggle();
    reload();
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
            <SquadHeader size={size} squad={squad} />
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
                  value={generalStrategy}
                  onChange={handleGeneralStrategyInput}
                />

                {
                  sourceSquad && <EditMenu className="align-self-end">
                    <Button color="link" size="sm" className="mb-0" onClick={handleGeneralStrategyReset}>reset</Button>
                  </EditMenu>
                }
              </FormStrategy>
            </div>
          </FormCentered>
        </StyledForm>
      </StyledModalBody>

      <StyledModalFooter>
        <Button color="primary" onClick={handleSubmitButton}
          disabled={tempSquad[0].id === 'BLANK' }>Submit</Button>
        <Button color="secondary" onClick={toggle}>Cancel</Button>
      </StyledModalFooter>
    </ModalWrapper>
  );
}
