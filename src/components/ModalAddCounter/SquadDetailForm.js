import React from 'react';
import styled from 'styled-components';
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
  isHardCounter,
  isNewCounter,
  isNewSquad,
  setIsHardCounter,
  setIsNewSquad,
  setSquadMatch,
  setIsNewCounter,
  setTempSquadInfo,
  setTempSquad,
  tempSquadInfo,
  squadMatch,
  squads,
  view,
}) {
  const buildSquadDropdown = squads.map(squad => <option id={squad.id} key={`dd_${squad.id}`}>{squad.name}</option>);

  const handleIsHardCounterCheckbox = () => setIsHardCounter(!isHardCounter);

  const handleIsNewSquadCheckbox = () => {
    setIsNewSquad(!isNewSquad);
    setSquadMatch('');
    setIsNewCounter(true);
    setTempSquadInfo({ id: '', name: '' });
    setTempSquad(buildDefaultSquad());
  };

  const handleSquadNameInput = (e) => {
    const selectedSquadName = e.target.value;
    const selectedSquadId = (squads.find(x => x.name === selectedSquadName) || {}).id || '';
    setTempSquadInfo({ id: selectedSquadId, name: selectedSquadName });
    if (selectedSquadName === 'Select squad') {
      setTempSquad(buildDefaultSquad());
    }

    if (!isNewSquad) {
      if (selectedSquadName !== 'Select squad') {
        const {
          toon1Id, toon1Name,
          toon2Id, toon2Name,
          toon3Id, toon3Name,
          toon4Id, toon4Name,
          toon5Id, toon5Name,
        } = squads.find(squad => squad.name === selectedSquadName);
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
      const matchingSquadName = (squads.find(x => x.name === selectedSquadName) || {}).name;
      if (selectedSquadName === matchingSquadName) {
        setSquadMatch(matchingSquadName);
      } else {
        setSquadMatch('');
      }
    }
  };

  return (
    <FormSquadDetails>
      <h6 className="text-secondary">{view === 'normal' ? 'Counter Team Details' : 'Opponent Team Details'}</h6>
      <InputWrapper className="col-12">
        <FormCheckboxes className="col-5">
          <Label check className="counterLabel p-0"><Input className="counterInput" type="checkbox" checked={isNewSquad} onChange={handleIsNewSquadCheckbox}/>New Squad?</Label>
          <Label check className="counterLabel p-0"><Input className="counterInput" type="checkbox" checked={isHardCounter} onChange={handleIsHardCounterCheckbox}/>Hard Counter?</Label>
        </FormCheckboxes>

        {isNewSquad && <Input className="col-7" type="text" bsSize="sm" placeholder="Squad Name" onChange={handleSquadNameInput}/>}

        {!isNewSquad
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
