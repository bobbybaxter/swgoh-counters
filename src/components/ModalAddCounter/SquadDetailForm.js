import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/macro';
import { FormGroup, Input, Label } from 'reactstrap';

export const FormCheckboxes = styled.div`
  display: flex;
  flex-flow: column nowrap;
  align-items: flex-start;
  justify-content: center;
  font-size: .7rem;
  font-weight: 300;

  @media only screen and (min-width:768px) {
    font-size: .9rem;
  }

  @media only screen and (min-width:992px) {
    font-size: 1rem;
  }
`;

export const FormSquadDetails = styled(FormGroup)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 0 0 1rem 0;
`;

export const InputWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-bottom: 1rem;
  padding-left: 0;
  padding-right: 0;
`;

export default function SquadDetails({
  buildDefaultSquad,
  checkExistingSquad,
  defaultTempSquadInfo,
  isHardCounter,
  isNewCounter,
  isNewSquad,
  rightSquad,
  setIsHardCounter,
  setIsNewSquad,
  setSquadMatch,
  setIsNewCounter,
  setTempSquadInfo,
  setTempSquad,
  tempSquadInfo,
  sourceSquad,
  squadMatch,
  squads,
}) {
  SquadDetails.propTypes = {
    buildDefaultSquad: PropTypes.func.isRequired,
    checkExistingSquad: PropTypes.func.isRequired,
    defaultTempSquadInfo: PropTypes.object.isRequired,
    isHardCounter: PropTypes.bool.isRequired,
    isNewCounter: PropTypes.bool.isRequired,
    isNewSquad: PropTypes.bool,
    rightSquad: PropTypes.object,
    setIsHardCounter: PropTypes.func.isRequired,
    setIsNewSquad: PropTypes.func,
    setSquadMatch: PropTypes.func.isRequired,
    setIsNewCounter: PropTypes.func.isRequired,
    setTempSquadInfo: PropTypes.func.isRequired,
    setTempSquad: PropTypes.func.isRequired,
    tempSquadInfo: PropTypes.object.isRequired,
    sourceSquad: PropTypes.array,
    squadMatch: PropTypes.string.isRequired,
    squads: PropTypes.array.isRequired,
  };

  const [sourceSquadName] = useState(tempSquadInfo.name);

  const buildSquadDropdown = squads.map(squad => <option id={squad.id} key={`dd_${squad.id}`}>{squad.name}</option>);

  const handleIsHardCounterCheckbox = () => setIsHardCounter(!isHardCounter);

  const handleIsNewSquadCheckbox = () => {
    setIsNewSquad && setIsNewSquad(!isNewSquad);
    setSquadMatch('');
    setIsNewCounter(true);
    setTempSquadInfo(defaultTempSquadInfo);
    setTempSquad(buildDefaultSquad());
  };

  const handleSquadNameInput = (e) => {
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
          checkExistingSquad([toon1Name, toon2Name, toon3Name, toon4Name, toon5Name]);
        }
        setSquadMatch('');
      }

      if (isNewSquad) {
        const matchingSquadName = (squads.find(x => x.name === newSquadName) || {}).name;
        newSquadName === matchingSquadName ? setSquadMatch(matchingSquadName) : setSquadMatch('');
        if (rightSquad && rightSquad.name === newSquadName) {
          setSquadMatch('');
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
      newSquadName === matchingSquadName ? setSquadMatch(matchingSquadName) : setSquadMatch('');
      if (rightSquad && rightSquad.name === newSquadName) {
        setSquadMatch('');
      }
      setTempSquadInfo({
        id: tempSquadInfo.id,
        name: newSquadName || sourceSquadName,
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

  return (
    <FormSquadDetails>
      <h6 className="text-secondary">Counter Team Details</h6>
      <InputWrapper className="col-12">
        <FormCheckboxes className="col-5">
          {!sourceSquad && <Label check className="counterLabel p-0"><Input className="counterInput" type="checkbox" checked={isNewSquad} onChange={handleIsNewSquadCheckbox}/>New Squad?</Label>}
          <Label check className="counterLabel p-0"><Input className="counterInput" type="checkbox" checked={isHardCounter} onChange={handleIsHardCounterCheckbox}/>Hard Counter?</Label>
        </FormCheckboxes>

        {sourceSquad && !squadMatch && <Input className="col-7" type="text" bsSize="sm" placeholder={sourceSquadName} value={tempSquadInfo.name} onChange={handleSquadNameInput}/>}
        {sourceSquad && squadMatch && <h6 className="m-0 p-0">{tempSquadInfo.name}</h6>}

        {!sourceSquad && isNewSquad && <Input className="col-7" type="text" bsSize="sm" placeholder="Squad Name" onChange={handleSquadNameInput}/>}

        {!sourceSquad && !isNewSquad
          && <Input className="col-7" type="select" bsSize="sm" onChange={handleSquadNameInput} value={tempSquadInfo.name}>
            <option>Select squad</option>
            {buildSquadDropdown}
          </Input>
        }
      </InputWrapper>
      {squadMatch && <div className="alert alert-danger">Squad name is taken</div>}
      {!isNewCounter && <div className="alert alert-danger">This counter already exists</div>}
    </FormSquadDetails>
  );
}
