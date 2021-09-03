import React, { useState } from 'react';
import {
  Button,
  Form,
  Input,
  TabContent,
  Table,
  TabPane,
} from 'reactstrap';
import styled from 'styled-components';
import { addLeader, deleteLeader } from 'src/helpers/data';

export const StyledForm = styled( Form )`
  display: flex;
  flex-direction: row;
`;

export const StyledTd = styled.td`
  vertical-align: middle !important;
`;

export default function LeaderRows( {
  activeTab,
  squadInfo,
} ) {
  const { view, battleType, squads } = squadInfo;
  const [ newId, setNewId ] = useState();

  async function deleteRow( e ) {
    const squadId = e.target.value;
    await deleteLeader( { squadId, view, battleType } );
    window.location.reload();
  }

  async function addRow( e ) {
    const id = e.target.value;
    await addLeader( { id, view, battleType } );
    window.location.reload();
  }

  function handleInputId( e ) {
    e.preventDefault();
    const id = e.target.value;
    setNewId( id );
  }

  function generateRows() {
    return squads.map( squad => (
      <tr key={`squadRow_${ squad.id }`}>
          <StyledTd>{squad.id}</StyledTd>
          <StyledTd>{squad.toon1Name}</StyledTd>
          <StyledTd>{squad.toon1Id}</StyledTd>
          <StyledTd>{squad.toon2Id}</StyledTd>
          <StyledTd>{squad.toon3Id}</StyledTd>
          <StyledTd>{squad.toon4Id}</StyledTd>
          <StyledTd>{squad.toon5Id}</StyledTd>
          <StyledTd><Button size="sm" onClick={deleteRow} value={squad.id}>Delete</Button></StyledTd>
        </tr>
    ));
  }

  return (
    <TabContent activeTab={activeTab}>
      <TabPane tabId={activeTab}>
        <Table striped size="sm" className="text-secondary">
          <thead>
            <tr>
              <th>id</th>
              <th>toon1Name</th>
              <th>toon1Id</th>
              <th>toon2Id</th>
              <th>toon3Id</th>
              <th>toon4Id</th>
              <th>toon5Id</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <StyledTd><Input type="text" onChange={handleInputId}/></StyledTd>
              <StyledTd><Button size="sm" onClick={addRow} value={newId}>Add</Button></StyledTd>
              <th></th>
              <th></th>
              <th></th>
              <th></th>
              <th></th>
              <th></th>
            </tr>

            {generateRows()}
          </tbody>
        </Table>
      </TabPane>
    </TabContent>
  );
}
