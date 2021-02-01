import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Collapse } from 'reactstrap';

import CounterCard from 'src/components/DescriptionCards/CounterCard';

import { IDBService } from 'src/setup/IndexedDB';

import { getCounterById } from 'src/helpers/data';
import { CounterCardWrapper } from 'src/styles/style';

export default function CounterRowDescription({
  authenticated,
  collapse,
  counterStubs,
  reload,
  rightSquadStub,
  size,
  view,
  user,
  ...props
}) {
  CounterRowDescription.propTypes = {
    authenticated: PropTypes.bool,
    collapse: PropTypes.string,
    counterStubs: PropTypes.object.isRequired,
    reload: PropTypes.func,
    rightSquadStub: PropTypes.object.isRequired,
    size: PropTypes.string.isRequired,
    user: PropTypes.object,
    view: PropTypes.string.isRequired,
  };

  const [counter, setCounter] = useState();

  const { counterId } = rightSquadStub;

  useEffect(() => {
    // abortController cleans up cancelled requests
    const abortController = new AbortController();
    const opts = { signal: abortController.signal };

    async function getCounter() {
      const storedCounter = await IDBService.get('counters', counterId);

      const requestCounter = async () => {
        try {
          const result = await getCounterById(counterId, opts);
          setCounter(result);
          IDBService.put('counters', result);
        } catch (e) {
          if (!abortController.signal.aborted) {
            console.error('getCounter aborted :>> ', e);
          }
        }
      };

      if (storedCounter && !abortController.signal.aborted) {
        if (storedCounter.createdOn !== rightSquadStub.counterCreatedOn) {
          await requestCounter();
        } else {
          setCounter(storedCounter);
        }
      }

      if (!storedCounter) {
        await requestCounter();
      }
    }

    getCounter();
    return () => {
      abortController.abort();
    };
  }, [counterId, rightSquadStub.counterCreatedOn]);

  return (
    <CounterCardWrapper key={counterId}>
      <Collapse isOpen={counterId === collapse}>
          {counter && <CounterCard
            authenticated={authenticated}
            counter={counter}
            counterStubs={counterStubs}
            reload={reload}
            size={size}
            user={user}
            view={view}
          />}
      </Collapse>
    </CounterCardWrapper>
  );
}
