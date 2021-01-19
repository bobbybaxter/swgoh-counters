/* eslint-disable max-len */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Collapse } from 'reactstrap';

import OpponentCard from 'src/components/DescriptionCards/OpponentCard';
import ModalAddCounter from 'src/components/Modals/ModalAddCounter';
import ModalPortal from 'src/components/ModalPortal/ModalPortal';
import ToonImg from 'src/components/shared/ToonImg';

import { getImage, useToggle } from 'src/helpers';
import { getCounterStubsBySquadId } from 'src/helpers/data';
import { IDBService } from 'src/setup/IndexedDB';
import { CounterCard } from 'src/styles/style';

import CounterRowDescription from './CounterRowDescription';
import CounterRowSquad from './CounterRowSquad';
import {
  CounterRowWrapper, Divider, LeftDiv, RightDiv, RightDivWrapper, SquadTitle,
} from './style';
import './CounterRow.scss';

// TODO: Add tests
const CounterRow = React.memo(({
  authenticated,
  collapse,
  leftSquadStub,
  reload,
  size,
  toggleCollapse,
  user,
  view,
  ...props
}) => {
  CounterRow.propTypes = {
    authenticated: PropTypes.bool,
    collapse: PropTypes.string,
    leftSquadStub: PropTypes.object.isRequired,
    reload: PropTypes.func,
    size: PropTypes.string.isRequired,
    toggleCollapse: PropTypes.func.isRequired,
    user: PropTypes.object.isRequired,
    view: PropTypes.string.isRequired,
  };

  const [counterStubs, setCounterStubs] = useState();
  const [isOpen, setIsOpen] = useToggle(false);

  const counterStubId = `${size}_${view}_${leftSquadStub.id}`;

  useEffect(() => {
    // abortController cleans up cancelled requests
    const abortController = new AbortController();
    const opts = { signal: abortController.signal };

    async function getCounterStubs() {
      const storedStubs = await IDBService.get('counterStubs', counterStubId);

      const removeStaleStubs = async (counterStub) => {
        const { id, counterVersion, rightSquadStubs } = counterStub;
        const staleStubs = rightSquadStubs.filter(x => x.counterCreatedOn > counterVersion);

        if (staleStubs && staleStubs.length > 0) {
          const freshStubs = rightSquadStubs.filter(x => x.counterCreatedOn <= counterVersion);
          const counterStubToStore = {
            id,
            counterVersion,
            rightSquadStubs: freshStubs,
          };
          IDBService.put('counterStubs', counterStubToStore);
          return counterStubToStore;
        }

        return counterStub;
      };

      const requestCounterStubs = async () => {
        try {
          const stubs = await getCounterStubsBySquadId(leftSquadStub.id, view, size, opts);
          setCounterStubs(stubs);
          const objectToStore = {
            id: counterStubId,
            counterVersion: stubs.counterVersion,
            rightSquadStubs: stubs.rightSquadStubs,
          };
          // FIXME: find out how to stop adding counters from the previous page
          // example: on 5v5, when i go to 3v3 this hook will pull in the 5v5
          // leftSideSquads pre-render and query the database for any 3v3 versions
          // then when the correct 3v3 squads are rendered, it'll query the database
          // for their counterStubs
          IDBService.put('counterStubs', objectToStore);
        } catch (e) {
          abortController.abort();
          if (!abortController.signal.aborted) {
            console.error('abortCountroller signal aborted :>> ', e);
          }
        }
      };

      if (storedStubs) {
        if (storedStubs.counterVersion !== leftSquadStub.latestCounterVersion) {
          await requestCounterStubs();
        } else {
          const freshStubs = await removeStaleStubs(storedStubs);
          setCounterStubs(freshStubs);
        }
      }

      if (!storedStubs) {
        await requestCounterStubs();
      }
    }

    getCounterStubs();
    return () => {
      abortController.abort();
    };
  }, [counterStubId, leftSquadStub, leftSquadStub.id, leftSquadStub.latestCounterVersion, size, view]);

  const toggle = (e) => { toggleCollapse(e.target.id); };
  const hardCounters = !_.isEmpty(counterStubs) ? counterStubs.rightSquadStubs.filter(x => x.isHardCounter === 1) : [];
  const softCounters = !_.isEmpty(counterStubs) ? counterStubs.rightSquadStubs.filter(x => x.isHardCounter === 0) : [];
  const divider = hardCounters.length > 0 && softCounters.length > 0 && <Divider/>;

  const buildCounters = (squads, type) => squads
    .map(squad => <CounterRowSquad
        key={`${view}_${size}_${squad.counterId}_row`}
        squad={squad}
        toggle={toggle}
        type={type}
        view={view}
      />);

  const buildCounterDescriptions = !_.isEmpty(counterStubs)
    && counterStubs.rightSquadStubs.map(rightSquadStub => (
        <CounterRowDescription
          authenticated={authenticated}
          collapse={collapse}
          counterStubs={counterStubs}
          key={`${view}_${size}_${rightSquadStub.counterId}_description`}
          reload={reload}
          rightSquadStub={rightSquadStub}
          size={size}
          user={user}
          view={view}
        />
    ));

  return (
    <CounterRowWrapper>
      <div className="d-flex flex-row">

        {/* Left Side Squad Div */}
        <LeftDiv className="col-3">
          <div>
            <ToonImg
              alt={leftSquadStub.name}
              id={leftSquadStub.id}
              onClick={toggle}
              src={getImage(leftSquadStub.toon1Id)}
              title={leftSquadStub.name}
            />
            <SquadTitle>{leftSquadStub.name}</SquadTitle>
          </div>
        </LeftDiv>

        {/* Right Side Counter Div */}
        <RightDiv className="col-9">
          <RightDivWrapper>
            {hardCounters ? buildCounters(hardCounters, 'hard') : []}
            {divider}
            {softCounters ? buildCounters(softCounters, 'soft') : []}
            {authenticated && user.patronStatus === 'active_patron' && user.username && view === 'normal'
              ? <>
                  <CounterCard key={`addCounterButton_${counterStubId}`}>
                    <ToonImg
                      alt="Add a new counter"
                      id={`addCounterButton_${counterStubId}`}
                      onClick={() => setIsOpen(true)}
                      src={require('../../assets/Plus.png')}
                      title="Add a new counter"
                    />
                  </CounterCard>
                  {isOpen && (
                    <ModalPortal>
                      <ModalAddCounter
                        counterStubs={counterStubs}
                        isOpen={isOpen}
                        leftSquadStub={leftSquadStub}
                        reload={reload}
                        size={size}
                        toggle={setIsOpen}
                        user={user}
                      />
                    </ModalPortal>
                  )}
              </>
              : ''}
          </RightDivWrapper>
        </RightDiv>
      </div>

      {/* Collapsable Opponent Card */}
      <div>
        <Collapse isOpen={leftSquadStub.id === collapse}>
          <OpponentCard
            authenticated={authenticated}
            leftSquadStub={leftSquadStub}
            reload={reload}
            size={size}
            user={user}
          />
        </Collapse>
      </div>

      {/* Collapsable Description Card */}
      <div>
        {buildCounterDescriptions}
      </div>
    </CounterRowWrapper>
  );
});

export default CounterRow;
