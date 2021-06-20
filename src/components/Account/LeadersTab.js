import React from 'react';
import {
  TabContent,
  TabPane,
} from 'reactstrap';

// TODO: add endpoints to make sql queries for my squad selections

export default function ImportTab({ activeTab }) {
  return (
    <TabContent activeTab={activeTab}>
      <TabPane tabId="3">
        <div className="d-flex flex-row m-3 p-3">
          Leader Tab
        </div>
      </TabPane>
    </TabContent>
  );
}
