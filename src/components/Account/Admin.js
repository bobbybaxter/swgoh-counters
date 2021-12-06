import React, { useState } from 'react';
import {
  Nav,
  NavItem,
  NavLink,
} from 'reactstrap';

import ImportTab from './ImportTab';
import SWGOHTab from './SWGOHTab';
import LeadersTab from './LeadersTab';
import PlayerDataTab from './PlayerDataTab';

export default function Admin() {
  const [ activeTab, setActiveTab ] = useState( '1' );

  const toggle = tab => {
    if ( activeTab !== tab ) {
      setActiveTab( tab );
    }
  };

  return (
    <div>
      <Nav tabs>
      <NavItem>
          <NavLink className={`cursor-pointer ${ activeTab === '1' ? 'active' : '' }`} onClick={() => { toggle( '1' ); }}>
            Leaders
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink className={`cursor-pointer ${ activeTab === '2' ? 'active' : '' }`} onClick={() => { toggle( '2' ); }}>
            Import
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink className={`cursor-pointer ${ activeTab === '3' ? 'active' : '' }`} onClick={() => { toggle( '3' ); }}>
            SWGOH
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink className={`cursor-pointer ${ activeTab === '4' ? 'active' : '' }`} onClick={() => { toggle( '4' ); }}>
            Player Data
          </NavLink>
        </NavItem>
      </Nav>

      <ImportTab activeTab={activeTab} />

      <SWGOHTab activeTab={activeTab} />

      <LeadersTab activeTab={activeTab} />

      <PlayerDataTab activeTab={activeTab} />

    </div>
  );
}
