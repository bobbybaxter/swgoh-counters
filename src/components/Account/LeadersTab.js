import React, { useEffect, useState } from 'react';
import _ from 'lodash';
import {
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
} from 'reactstrap';
import { getLeaders } from 'src/helpers/data';
import LeaderRows from './LeaderRows';

const LeadersTab = ( { activeTab } ) => {
  const [ normal5v5, setNormal5v5 ] = useState();
  const [ normal3v3, setNormal3v3 ] = useState();
  const [ reverse5v5, setReverse5v5 ] = useState();
  const [ reverse3v3, setReverse3v3 ] = useState();
  const [ activeLeaderTab, setActiveLeaderTab ] = useState( '1' );

  function toggle( tab ) {
    if ( activeLeaderTab !== tab ) {
      setActiveLeaderTab( tab );
    }
  }

  function selectSquadInfo() {
    const tabSubject = {
      1: { view: 'normal', battleType: '5v5', squads: normal5v5 },
      2: { view: 'reverse', battleType: '5v5', squads: reverse5v5 },
      3: { view: 'normal', battleType: '3v3', squads: normal3v3 },
      4: { view: 'reverse', battleType: '3v3', squads: reverse3v3 },
    };
    return tabSubject[ activeLeaderTab ];
  }

  useEffect(() => {
    const abortController = new AbortController();
    const opts = { signal: abortController.signal };

    async function getStubs() {
      try {
        const response = await getLeaders( opts );
        if ( !_.isEmpty( response )) {
          const {
            n5v5, r5v5, n3v3, r3v3,
          } = response;
          setNormal5v5( n5v5 );
          setNormal3v3( n3v3 );
          setReverse5v5( r5v5 );
          setReverse3v3( r3v3 );
        }
      } catch ( err ) {
        if ( !abortController.signal.aborted ) {
          console.error( 'getStubs aborted', err );
        }
      }
    }

    getStubs();
    return () => {
      abortController.abort();
    };
  }, [] );

  function buildNavItems() {
    const tabs = [
      { 1: '5v5 Normal' },
      { 2: '5v5 Reverse' },
      { 3: '3v3 Normal' },
      { 4: '3v3 Reverse' },
    ];
    return tabs.map( tab => {
      const tabInfo = Object.entries( tab )[ 0 ];
      const tabNumber = tabInfo[ 0 ];
      const tabName = tabInfo[ 1 ];
      return (
        <NavItem key={`leader_tab_${ tabName }`}>
          <NavLink className={`cursor-pointer ${ activeLeaderTab === tabNumber ? 'active' : '' }`} onClick={() => { toggle( tabNumber ); }}>
            {tabName}
          </NavLink>
        </NavItem>
      );
    } );
  }

  return (
    <TabContent activeTab={activeTab}>
      <TabPane tabId="1">
        <Nav tabs>
          {buildNavItems()}
        </Nav>

        {
          normal5v5 && <LeaderRows
            activeTab={activeLeaderTab}
            squadInfo={selectSquadInfo()}
          />
        }

      </TabPane>
    </TabContent>
  );
};

export default LeadersTab;
