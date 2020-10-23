import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Collapse } from 'reactstrap';
import DescriptionCard from '../DescriptionCard/DescriptionCard';

import { getCounterById } from '../../helpers/data/countersData';
import { IDBService } from '../../setup/IndexedDB';

// TODO: Add tests
export default function CounterRowDescription(props) {
  CounterRowDescription.propTypes = {
    collapse: PropTypes.string,
    rightSquadStub: PropTypes.object,
    view: PropTypes.string,
  };

  const {
    collapse, rightSquadStub, view,
  } = props;

  const [counter, setCounter] = useState();

  const { counterId } = rightSquadStub;

  useEffect(() => {
    // abortController cleans up cancelled requests
    const abortController = new AbortController();
    const opts = { signal: abortController.signal };

    async function getCounter() {
      const storedCounter = await IDBService.get('counters', counterId);

      if (storedCounter) {
        setCounter(storedCounter);
      } else {
        try {
          const result = await getCounterById(counterId, opts);
          setCounter(result);
          IDBService.put('counters', result);
        } catch (e) {
          abortController.abort();
          if (!abortController.signal.aborted) {
            console.log('e :>> ', e);
          }
        }
      }
    }

    getCounter();

    return () => {
      abortController.abort();
    };
  }, [counterId]);

  return <div className="countersDetails my-2" key={counterId}>
          <Collapse isOpen={counterId === collapse}>
            <div className="d-flex flex-row">
              <DescriptionCard
                counter={counter}
                view={view}
              />
            </div>
          </Collapse>
        </div>;
}
