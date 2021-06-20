import React from 'react';
import {
  Button,
  TabContent,
  TabPane,
} from 'reactstrap';

import {
  importCharacterData,
  importCounterData,
  importSquadData,
} from 'src/helpers/data';

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

export default function ImportTab({ activeTab }) {
  return (
    <TabContent activeTab={activeTab}>
      <TabPane tabId="1">
        <div className="d-flex flex-row m-3 p-3">
          <Button className="btn-sm ml-1" onClick={importCharacters}>Import Characters</Button>
          <Button className="btn-sm mx-1" onClick={importSquads} >Import Squads</Button>
          <Button className="btn-sm" onClick={importCounters} >Import Counters</Button>
        </div>
      </TabPane>
    </TabContent>
  );
}
