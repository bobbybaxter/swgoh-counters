import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Collapse } from 'reactstrap';
import DescriptionCard from '../DescriptionCard/DescriptionCard';

import { getCounterById } from '../../helpers/data/countersData';
import { IDBService } from '../../setup/IndexedDB';
import { DescriptionCardWrapper } from './style';

// TODO: Add tests
export default function CounterRowDescription({
  collapse, rightSquadStub, size, view, ...props
}) {
  CounterRowDescription.propTypes = {
    collapse: PropTypes.string,
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

  // TODO: test later to see if you prefer collapse first (showing a gap between rows)
  // or description first (no gap between rows)
  return (
    <DescriptionCardWrapper key={counterId}>
      <Collapse isOpen={counterId === collapse}>
        <div className="d-flex flex-row">
          <DescriptionCard
            counter={counter}
            size={size}
            view={view}
          />
        </div>
      </Collapse>
    </DescriptionCardWrapper>
  );
}
