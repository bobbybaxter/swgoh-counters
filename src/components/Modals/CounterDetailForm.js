import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Input, Label } from 'reactstrap';

import { EditMenu } from 'src/styles/style';

import { FormCheckboxes, FormDetails, InputWrapper } from './style';

export default function CounterDetails({
  buildDefaultSquad,
  checkExistingSquad,
  defaultTempSquadInfo,
  isHardCounter,
  isNewCounter,
  isNewSquad,
  rightSquad,
  setIsHardCounter,
  setIsNewCounter,
  setIsNewSquad,
  setSquadNameMatch,
  setTempSquad,
  setTempSquadInfo,
  tempSquadInfo,
  sourceSquad,
  squadNameMatch,
  squads,
}) {
  CounterDetails.propTypes = {
    buildDefaultSquad: PropTypes.func.isRequired,
    checkExistingSquad: PropTypes.func.isRequired,
    defaultTempSquadInfo: PropTypes.object.isRequired,
    isHardCounter: PropTypes.bool.isRequired,
    isNewCounter: PropTypes.bool.isRequired,
    isNewSquad: PropTypes.bool,
    rightSquad: PropTypes.object,
    setIsHardCounter: PropTypes.func.isRequired,
    setIsNewCounter: PropTypes.func.isRequired,
    setIsNewSquad: PropTypes.func,
    setSquadNameMatch: PropTypes.func.isRequired,
    setTempSquad: PropTypes.func.isRequired,
    setTempSquadInfo: PropTypes.func.isRequired,
    squadMatch: PropTypes.string,
    tempSquadInfo: PropTypes.object.isRequired,
    sourceSquad: PropTypes.array,
    squadNameMatch: PropTypes.string.isRequired,
    squads: PropTypes.array.isRequired,
  };

  const [sourceSquadName] = useState(tempSquadInfo.name || 'Counter Squad Name');

  const buildSquadDropdown = squads.map(squad => <option id={squad.id} key={`dd_${squad.id}`}>{squad.name}</option>);

  const handleIsHardCounterCheckbox = () => setIsHardCounter(!isHardCounter);

  const handleIsNewSquadCheckbox = () => {
    setIsNewSquad && setIsNewSquad(!isNewSquad);
    setSquadNameMatch('');
    setIsNewCounter(true);
    setTempSquadInfo(defaultTempSquadInfo);
    setTempSquad(buildDefaultSquad());
  };

  const handleSquadNameInput = async (e) => {
    const newSquadName = e.target.value;

    if (!sourceSquad) {
      if (!isNewSquad) {
        const selectedSquad = squads.find(x => x.name === newSquadName) || '';
        setTempSquadInfo({
          id: selectedSquad.id,
          name: selectedSquad.name,
          description: selectedSquad.description,
          counterStrategy: selectedSquad.counterStrategy,
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
          } = squads.find(squad => squad.name === newSquadName);
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
          setSquadNameMatch(squadCheck.squadMatch);
          setIsNewCounter(squadCheck.isNewCounter);
          setIsNewSquad(squadCheck.isNewSquad);
          setTempSquadInfo(squadCheck.tempSquadInfo);
        }
        setSquadNameMatch('');
      }

      if (isNewSquad) {
        const matchingSquadName = (squads.find(x => x.name === newSquadName) || {}).name;
        newSquadName === matchingSquadName ? setSquadNameMatch(matchingSquadName) : setSquadNameMatch('');
        if (rightSquad && rightSquad.name === newSquadName) {
          setSquadNameMatch('');
        }
        setTempSquadInfo({
          id: tempSquadInfo.id,
          name: newSquadName,
          description: tempSquadInfo.description,
          counterStrategy: tempSquadInfo.counterStrategy,
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
      if (rightSquad && rightSquad.name === newSquadName) {
        setSquadNameMatch('');
      }
      setTempSquadInfo({
        id: tempSquadInfo.id,
        name: newSquadName,
        description: tempSquadInfo.description,
        counterStrategy: tempSquadInfo.counterStrategy,
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
      name: rightSquad.name,
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
        <FormCheckboxes className="col-5">
          {!sourceSquad && <Label check className="counterLabel p-0"><Input className="counterInput" type="checkbox" checked={isNewSquad} onChange={handleIsNewSquadCheckbox}/>New Squad?</Label>}
          <Label check className="counterLabel p-0"><Input className="counterInput" type="checkbox" checked={isHardCounter} onChange={handleIsHardCounterCheckbox}/>Hard Counter?</Label>
        </FormCheckboxes>

        {sourceSquad && <Input className="col-7" type="text" bsSize="sm" placeholder={sourceSquadName} value={tempSquadInfo.name} onChange={handleSquadNameInput}/>}

        {!sourceSquad && isNewSquad && <Input className="col-7" type="text" bsSize="sm" placeholder="Squad Name" onChange={handleSquadNameInput}/>}

        {!sourceSquad && !isNewSquad
          && <Input className="col-7" type="select" bsSize="sm" onChange={handleSquadNameInput} value={tempSquadInfo.name}>
            <option>Select squad</option>
            {buildSquadDropdown}
          </Input>
        }
      </InputWrapper>
      {squadNameMatch && <div className="alert alert-danger mt-3">Squad name is taken</div>}
      {!isNewCounter && <div className="alert alert-danger">This counter already exists</div>}
      {
        sourceSquad && <EditMenu className="align-self-end">
          <Button color="link" size="sm" className="mb-0" onClick={handleReset}>reset</Button>
        </EditMenu>
      }
    </FormDetails>
  );
}
