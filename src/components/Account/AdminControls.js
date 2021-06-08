import React, { useState } from 'react';
import {
  Button, Col, Form, FormGroup, Input, Label, Row,
} from 'reactstrap';

import {
  importCharacterData,
  importCounterData,
  importSquadData,
  getCountersBySeason,
  getLeadersBySeason,
  getSquadsBySeason,
} from 'src/helpers/data';

import { AdminControlsWrapper, ControlsDiv } from './style';

export default function AccountButtons() {
  const [leaderSeason, setLeaderSeason] = useState();
  const [squadSeason, setSquadSeason] = useState();
  const [counterSeason, setCounterSeason] = useState();

  async function importCharacters() {
    try {
      await importCharacterData();
    } catch (err) {
      console.error('importCharacters error :>>', err);
    }
  }

  async function importSquads() {
    try {
      await importSquadData();
    } catch (err) {
      console.error('importSquads error :>> ', err);
    }
  }

  async function importCounters() {
    try {
      await importCounterData();
    } catch (err) {
      console.error('importCounters error :>> ', err);
    }
  }

  function handleLeaderSeasonInput(e) {
    setLeaderSeason(e.target.value);
  }

  function handleSquadSeasonInput(e) {
    setSquadSeason(e.target.value);
  }

  function handleCounterSeasonInput(e) {
    setCounterSeason(e.target.value);
  }

  async function handleGetLeadersBySeason() {
    try {
      console.info(`Getting leaders for Season ${leaderSeason}`);
      const response = await getLeadersBySeason(leaderSeason);
      if (response === 'ok') {
        console.info(`Leaders for Season ${leaderSeason} uploaded to Firebase `);
      }
    } catch (err) {
      console.error('getLeadersBySeason error :>>', err);
    }
  }

  async function handleGetSquadsBySeason() {
    try {
      console.info(`Getting squads for Season ${squadSeason}`);
      const response = await getSquadsBySeason(squadSeason);
      if (response === 'ok') {
        console.info(`Squads for Season ${squadSeason} uploaded to database `);
      }
    } catch (err) {
      console.error('getSquadsBySeason error :>>', err);
    }
  }

  async function handleGetCountersBySeason() {
    try {
      console.info(`Getting counters for Season ${counterSeason}`);
      const response = await getCountersBySeason(counterSeason);
      if (response === 'ok') {
        console.info(`Counters for Season ${counterSeason} uploaded to database `);
      }
    } catch (err) {
      console.error('getCountersBySeason error :>>', err);
    }
  }

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
                  <Label for="leaderSeasonNum" className="w-100 text-left m-1">Season #</Label>
                  <Row className="m-0">
                    <Input className="m-1 w-25" type="text" bsSize="sm" name="leaderSeasonNum" id="leaderSeasonNum" onChange={handleLeaderSeasonInput} />
                    <Button className="btn-sm m-1" onClick={handleGetLeadersBySeason}>Get Leaders By Season</Button>
                  </Row>
                </FormGroup>
              </Col>
            </Form>
            <Form>
              <Col>
                <FormGroup>
                  <Label for="squadSeasonNum" className="w-100 text-left m-1">Season #</Label>
                  <Row className="m-0">
                    <Input className="m-1 w-25" type="text" bsSize="sm" name="squadSeasonNum" id="squadSeasonNum" onChange={handleSquadSeasonInput} />
                    <Button className="btn-sm m-1" onClick={handleGetSquadsBySeason}>Get Squads By Season</Button>
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
