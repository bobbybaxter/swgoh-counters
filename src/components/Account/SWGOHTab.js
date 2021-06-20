import React, { useState } from 'react';
import {
  Button,
  Col,
  Form,
  FormGroup,
  Input,
  Label,
  Row,
  TabContent,
  TabPane,
} from 'reactstrap';

import {
  getCountersBySeason,
  getLeadersBySeason,
  getSeasonData,
  getSquadsBySeason,
} from 'src/helpers/data';

export default function SWGOHTab({ activeTab }) {
  const [seasonDataSeason, setSeasonDataSeason] = useState();
  const [leaderSeason, setLeaderSeason] = useState();
  const [squadSeason, setSquadSeason] = useState();
  const [counterSeason, setCounterSeason] = useState();

  function handleSeasonDataSeasonInput(e) {
    setSeasonDataSeason(e.target.value);
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

  async function handleGetSeasonData() {
    try {
      console.info(`Getting Season Data for Season ${seasonDataSeason}`);
      const jsonToWrite = await getSeasonData(seasonDataSeason);

      const blob = new Blob([JSON.parse(jsonToWrite)], { type: 'text/json' });
      const link = document.createElement('a');

      link.download = 'swgoh.json';
      link.href = window.URL.createObjectURL(blob);
      link.dataset.downloadurl = ['text/json', link.download, link.href].join(':');

      const evt = new MouseEvent('click', {
        view: window,
        bubbles: true,
        cancelable: true,
      });

      link.dispatchEvent(evt);
      link.remove();
    } catch (err) {
      console.error('getSeasonData error :>>', err);
    }
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
    <TabContent activeTab={activeTab}>
      <TabPane tabId="2">
        <div className="d-flex flex-row m-3 p-3">
          <div className="w-100">
            <Form>
              <Col>
                <FormGroup>
                  <Label for="getSeasonData" className="w-100 text-left m-1">Season #</Label>
                  <Row className="m-0">
                    <Input className="m-1 w-25" type="text" bsSize="sm" name="getSeasonData" id="leaderSeasonNum" onChange={handleSeasonDataSeasonInput} />
                    <Button className="btn-sm m-1" onClick={handleGetSeasonData}>Get Season Data for AWS</Button>
                  </Row>
                </FormGroup>
              </Col>
            </Form>
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
            <Form>
              <Col>
                <FormGroup>
                  <Label for="counterSeasonNum" className="w-100 text-left m-1">Season #</Label>
                  <Row className="m-0">
                    <Input className="m-1 w-25" type="text" bsSize="sm" name="counterSeasonNum" id="counterSeasonNum" onChange={handleCounterSeasonInput} />
                    <Button className="btn-sm m-1" onClick={handleGetCountersBySeason}>Get Counters By Season</Button>
                  </Row>
                </FormGroup>
              </Col>
            </Form>
          </div>
        </div>
      </TabPane>
    </TabContent>
  );
}
