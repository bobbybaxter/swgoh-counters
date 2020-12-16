import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Collapse } from 'reactstrap';

import DescriptionCard from 'src/components/DescriptionCard/DescriptionCard';

import { getCounterById } from 'src/helpers/data';
import { IDBService } from 'src/setup/IndexedDB';

import { DescriptionCardWrapper } from 'src/styles/style';

// TODO: Add tests
export default function CounterRowDescription({
  collapse, counterStubs, reload, rightSquadStub, size, view, ...props
}) {
  CounterRowDescription.propTypes = {
    collapse: PropTypes.string,
    counterStubs: PropTypes.object.isRequired,
    reload: PropTypes.func,
    rightSquadStub: PropTypes.object.isRequired,
    size: PropTypes.string.isRequired,
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
          abortController.abort();
          if (!abortController.signal.aborted) {
            console.error('abortControler signal aborted :>> ', e);
          }
        }
      };

      if (storedCounter) {
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
    <DescriptionCardWrapper key={counterId}>
      <Collapse isOpen={counterId === collapse}>
          {counter && <DescriptionCard
            counter={counter}
            counterStubs={counterStubs}
            reload={reload}
            size={size}
            view={view}
          />}
      </Collapse>
    </DescriptionCardWrapper>
  );
}
