import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import {
  Button, Form, FormGroup, Input, Label, UncontrolledCollapse,
} from 'reactstrap';

const SortBoxWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-height: 30vh;
  overflow: hidden;
  border: 1px grey solid;
`;

const FilterWrapper = styled.div`
  max-height: 30vh;
  overflow: scroll;
`;

const LeaderCheckboxWrapper = styled.div`
  font-size: .8rem;
  overflow: scroll;
  padding-bottom: 3rem;

  @media only screen and (min-width:768px) {
    font-size: 1rem;
  }
`;

// TODO: hide the Opponent Squad if there is no match
const SortBox = ({
  excludedCounters,
  excludedOpponents,
  leaderIds,
  leaders,
  selectedLeaders,
  setExcludedCounters,
  setExcludedOpponents,
  view,
}) => {
  SortBox.propTypes = {
    excludedCounters: PropTypes.array,
    excludedOpponents: PropTypes.array,
    leaderIds: PropTypes.array.isRequired,
    leaders: PropTypes.array.isRequired,
    selectedLeaders: PropTypes.array.isRequired,
    setExcludedCounters: PropTypes.func.isRequired,
    setExcludedOpponents: PropTypes.func.isRequired,
    view: PropTypes.string.isRequired,
  };

  function handleAddAllCounters() {
    setExcludedCounters([]);
  }

  function handleAddAllOpponents() {
    setExcludedOpponents([]);
  }

  function handleClearAllCounters() {
    setExcludedCounters(selectedLeaders.map(x => x.id));
  }

  function handleClearAllOpponents() {
    setExcludedOpponents(leaderIds);
  }

  function handleOpponentLeaderCheckbox(e) {
    const newStubs = [...excludedOpponents];
    const isChecked = e.target.checked;
    const leaderId = e.target.id.split('-')[0];
    if (isChecked) {
      setExcludedOpponents(newStubs.filter(x => x !== leaderId));
    } else {
      newStubs.push(leaderId);
      setExcludedOpponents(newStubs);
    }
  }

  function handleCounterLeaderCheckbox(e) {
    const newStubs = [...excludedCounters];
    const isChecked = e.target.checked;
    const leaderId = e.target.id.split('-')[0];
    if (isChecked) {
      setExcludedCounters(newStubs.filter(x => x !== leaderId));
    } else {
      newStubs.push(leaderId);
      setExcludedCounters(newStubs);
    }
  }

  const buildOpponentFilter = leaders.map((leader) => {
    const isChecked = !excludedOpponents.includes(leader.id);
    return (
      <FormGroup check key={`${leader.id}_opponentCheckBox`}>
        <Label check className="text-left">
          <Input
            checked={isChecked}
            id={`${leader.id}-opponentCheckBox`}
            onChange={handleOpponentLeaderCheckbox}
            type="checkbox"
          />
          <div className="p-0 m-0">{leader.name}</div>
        </Label>
      </FormGroup>
    );
  });

  const buildCounterFilter = selectedLeaders.map((counterLeader) => {
    const isChecked = !excludedCounters.includes(counterLeader.id);
    return (
      <FormGroup check key={`${counterLeader.id}_counterCheckBox`}>
      <Label check className="text-left">
        <Input
          checked={isChecked}
          id={`${counterLeader.id}-counterCheckBox`}
          onChange={handleCounterLeaderCheckbox}
          type="checkbox"
        />
        <div className="p-0 m-0">{counterLeader.name}</div>
      </Label>
    </FormGroup>
    );
  });

  return (
    <SortBoxWrapper>
      <Button outline size='sm' id="toggleSortBox">Filter</Button>
      <UncontrolledCollapse toggler='#toggleSortBox'>
        <FilterWrapper className="d-flex flex-row">
          <div className="d-flex flex-column align-items-center col-6 px-1">
            <h5 className="m-1">{view === 'normal' ? 'Opponent' : 'Counter'}</h5>
            <div className="d-flex flex-row mb-1">
              <Button size="sm" outline color="primary" className="mr-1" onClick={handleAddAllOpponents}>Show All</Button>
              <Button size="sm" outline color="danger" onClick={handleClearAllOpponents}>Hide All</Button>
            </div>
            <LeaderCheckboxWrapper>
              <Form>
                {buildOpponentFilter}
              </Form>
            </LeaderCheckboxWrapper>
          </div>

          <div className="d-flex flex-column align-items-center col-6 px-1">
            <h5 className="m-1">{view === 'normal' ? 'Counter' : 'Opponent'}</h5>
            <div className="d-flex flex-row mb-1">
              <Button size="sm" outline color="primary" className="mr-1" onClick={handleAddAllCounters}>Show All</Button>
              <Button size="sm" outline color="danger" onClick={handleClearAllCounters}>Hide All</Button>
            </div>
            <LeaderCheckboxWrapper>
              <Form>
                {buildCounterFilter}
              </Form>
            </LeaderCheckboxWrapper>
          </div>
        </FilterWrapper>
      </UncontrolledCollapse>
    </SortBoxWrapper>
  );
};

export default SortBox;
