import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Input, Label } from 'reactstrap';

import { EditMenu } from 'src/styles/style';

import { FormCheckboxes, FormDetails, InputWrapper } from './style';

export default function SquadDetails({
  buildDefaultSquad,
  checkExistingSquad,
  defaultTempSquadInfo,
  isNewSquad,
  setCounterStrategy,
  setDescription,
  setIsNewCounter,
  setIsNewSquad,
  setSourceCounterStrategy,
  setSourceDescription,
  setSquadNameMatch,
  setTempSquadInfo,
  setTempSquad,
  tempSquadInfo,
  sourceSquad,
  squad,
  squadNameMatch,
  squads,
}) {
  SquadDetails.propTypes = {
    buildDefaultSquad: PropTypes.func.isRequired,
    checkExistingSquad: PropTypes.func.isRequired,
    defaultTempSquadInfo: PropTypes.object.isRequired,
    isNewSquad: PropTypes.bool,
    setCounterStrategy: PropTypes.func,
    setDescription: PropTypes.func,
    setIsNewCounter: PropTypes.func,
    setIsNewSquad: PropTypes.func,
    setSourceCounterStrategy: PropTypes.func,
    setSourceDescription: PropTypes.func,
    setSquadNameMatch: PropTypes.func.isRequired,
    setTempSquadInfo: PropTypes.func.isRequired,
    setTempSquad: PropTypes.func.isRequired,
    tempSquadInfo: PropTypes.object.isRequired,
    sourceSquad: PropTypes.array,
    squad: PropTypes.object,
    squadNameMatch: PropTypes.string.isRequired,
    squads: PropTypes.array.isRequired,
  };

  const [sourceSquadName] = useState(tempSquadInfo.name || 'Squad Name');

  const buildSquadDropdown = squads.map(x => <option id={x.id} key={`squadDropDown_${x.id}`}>{x.name}</option>);

  const handleIsNewSquadCheckbox = () => {
    setIsNewSquad && setIsNewSquad(!isNewSquad);
    setSquadNameMatch('');
    setIsNewCounter(true);
    setTempSquadInfo(defaultTempSquadInfo);
    setTempSquad(buildDefaultSquad());
    setDescription('');
    setCounterStrategy('');
    setSourceDescription('');
    setSourceCounterStrategy('');
  };

  const handleSquadNameInput = async (e) => {
    const newSquadName = e.target.value;

    if (!sourceSquad) {
      if (!isNewSquad) {
        const selectedSquad = squads.find(x => x.name === newSquadName) || '';
        setCounterStrategy(selectedSquad.counterStrategy);
        setSourceCounterStrategy(selectedSquad.counterStrategy);
        setDescription(selectedSquad.description);
        setSourceDescription(selectedSquad.description);
        setTempSquadInfo({
          id: selectedSquad.id,
          name: selectedSquad.name,
          toon1Id: selectedSquad.toon1Id,
          toon2Id: selectedSquad.toon2Id,
          toon3Id: selectedSquad.toon3Id,
          toon4Id: selectedSquad.toon4Id,
          toon5Id: selectedSquad.toon5Id,
        });

        if (newSquadName === 'Select squad') {
          setTempSquad(buildDefaultSquad());
        }

        if (newSquadName !== 'Select squad') {
          const {
            toon1Id, toon1Name,
            toon2Id, toon2Name,
            toon3Id, toon3Name,
            toon4Id, toon4Name,
            toon5Id, toon5Name,
          } = squads.find(x => x.name === newSquadName);
          setTempSquad([
            {
              id: toon1Id, name: toon1Name, isReq: false, zetas: [],
            },
            {
              id: toon2Id, name: toon2Name, isReq: false, zetas: [],
            },
            {
              id: toon3Id, name: toon3Name, isReq: false, zetas: [],
            },
            {
              id: toon4Id, name: toon4Name, isReq: false, zetas: [],
            },
            {
              id: toon5Id, name: toon5Name, isReq: false, zetas: [],
            },
          ]);
          const squadCheck = await checkExistingSquad([
            toon1Name,
            toon2Name,
            toon3Name,
            toon4Name,
            toon5Name,
          ]);
          setIsNewCounter(squadCheck.isNewCounter);
          setIsNewSquad(squadCheck.isNewSquad);
          setTempSquadInfo(squadCheck.tempSquadInfo);
        }
        setSquadNameMatch('');
      }

      if (isNewSquad) {
        const matchingSquadName = (squads.find(x => x.name === newSquadName) || {}).name;
        newSquadName === matchingSquadName ? setSquadNameMatch(matchingSquadName) : setSquadNameMatch('');
        if (squad && squad.name === newSquadName) {
          setSquadNameMatch('');
        }
        setCounterStrategy('');
        setSourceCounterStrategy('');
        setDescription('');
        setSourceDescription('');
        setTempSquadInfo({
          id: tempSquadInfo.id,
          name: newSquadName,
          toon1Id: tempSquadInfo.toon1Id,
          toon2Id: tempSquadInfo.toon2Id,
          toon3Id: tempSquadInfo.toon3Id,
          toon4Id: tempSquadInfo.toon4Id,
          toon5Id: tempSquadInfo.toon5Id,
        });
      }
    } else {
      const matchingSquadName = (squads.find(x => x.name === newSquadName) || {}).name;
      newSquadName === matchingSquadName ? setSquadNameMatch(matchingSquadName) : setSquadNameMatch('');
      if (squad && squad.name === newSquadName) {
        setSquadNameMatch('');
      }
      setTempSquadInfo({
        id: tempSquadInfo.id,
        name: newSquadName,
        toon1Id: tempSquadInfo.toon1Id,
        toon2Id: tempSquadInfo.toon2Id,
        toon3Id: tempSquadInfo.toon3Id,
        toon4Id: tempSquadInfo.toon4Id,
        toon5Id: tempSquadInfo.toon5Id,
      });
    }
  };

  const handleReset = () => {
    setSquadNameMatch('');
    setTempSquadInfo({
      id: tempSquadInfo.id,
      name: squad.name,
      toon1Id: tempSquadInfo.toon1Id,
      toon2Id: tempSquadInfo.toon2Id,
      toon3Id: tempSquadInfo.toon3Id,
      toon4Id: tempSquadInfo.toon4Id,
      toon5Id: tempSquadInfo.toon5Id,
    });
  };

  return (
    <FormDetails $hasMarginBottom={!sourceSquad}>
      <InputWrapper className="col-12">
        { !squad
          && <FormCheckboxes className="col-5">
            {!sourceSquad && <Label check className="counterLabel p-0"><Input className="counterInput" type="checkbox" checked={isNewSquad} onChange={handleIsNewSquadCheckbox}/>New Squad?</Label>}
          </FormCheckboxes>
        }

        {sourceSquad && <Input className="col-7" type="text" bsSize="sm" placeholder={sourceSquadName} value={tempSquadInfo.name} onChange={handleSquadNameInput}/>}

        {squad && !sourceSquad && isNewSquad && <Input className="col-7" type="text" bsSize="sm" placeholder={sourceSquadName} value={tempSquadInfo.name} onChange={handleSquadNameInput}/>}
        {!sourceSquad && isNewSquad && <Input className="col-7" type="text" bsSize="sm" placeholder="Squad Name" onChange={handleSquadNameInput}/>}

        {!sourceSquad && !isNewSquad
          && <Input className="col-7" type="select" bsSize="sm" onChange={handleSquadNameInput} value={tempSquadInfo.name}>
            <option>Select squad</option>
            {buildSquadDropdown}
          </Input>
        }
      </InputWrapper>
      {squadNameMatch && <div className="alert alert-danger mt-3 mb-0">Squad name is taken</div>}
      {
        sourceSquad && <EditMenu className="align-self-end">
          <Button color="link" size="sm" className="mb-0" onClick={handleReset}>reset</Button>
        </EditMenu>
      }
    </FormDetails>
  );
}
