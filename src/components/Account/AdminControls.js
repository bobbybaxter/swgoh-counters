import React, { useState } from 'react';
import {
  Button, Col, Form, FormGroup, Input, Label, Row,
} from 'reactstrap';

import {
  importCharacterData, importCounterData, importSquadData, getLeadersBySeason,
} from 'src/helpers/data';
import { AdminControlsWrapper, ControlsDiv } from './style';

export default function AccountButtons() {
  const [season, setSeason] = useState();

  const importCharacters = async () => {
    try {
      await importCharacterData();
    } catch (err) {
      console.error('importCharacters error :>>', err);
    }
  };

  const importSquads = async () => {
    try {
      await importSquadData();
    } catch (err) {
      console.error('importSquads error :>> ', err);
    }
  };

  const importCounters = async () => {
    try {
      await importCounterData();
    } catch (err) {
      console.error('importCounters error :>> ', err);
    }
  };

  const handleSeasonInput = (e) => {
    setSeason(e.target.value);
  };

  const handleGetLeadersBySeason = async () => {
    try {
      console.info(`Getting leaders for Season ${season}`);
      const response = await getLeadersBySeason(season);
      if (response === 'ok') {
        console.info(`Leaders for Season ${season} uploaded to Firebase `);
      }
    } catch (err) {
      console.error('getLeadersBySeason error :>>', err);
    }
  };

  return (
    <AdminControlsWrapper>
      <h4>Admin Controls</h4>
      <div className="d-flex flex-row">
        <ControlsDiv>
          <h5>Import Controls</h5>
          <div className="d-flex flex-row">
            <Button className="btn-sm ml-1" onClick={importCharacters}>Import Characters</Button>
            <Button className="btn-sm mx-1" onClick={importSquads} >Import Squads</Button>
            <Button className="btn-sm" onClick={importCounters} >Import Counters</Button>
          </div>
        </ControlsDiv>
        <ControlsDiv>
          <h5>SWGOH Controls</h5>
          <div className="w-100">
            <Form>
              <Col>
                <FormGroup>
                  <Label for="seasonNum" className="w-100 text-left m-1">Season #</Label>
                  <Row className="m-0">
                    <Input className="m-1 w-25" type="text" bsSize="sm" name="seasonNum" id="seasonNum" onChange={handleSeasonInput} />
                    <Button className="btn-sm m-1" onClick={handleGetLeadersBySeason}>Get Leaders By Season</Button>
                  </Row>
                </FormGroup>
              </Col>
            </Form>
          </div>
        </ControlsDiv>
      </div>
    </AdminControlsWrapper>
  );
}
