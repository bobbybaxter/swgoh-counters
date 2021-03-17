import React, {
  useCallback, useContext, useEffect, useState,
} from 'react';
import { Button } from 'reactstrap';
import LazyLoad from 'react-lazyload';
import PropTypes from 'prop-types';
import _ from 'lodash';

import AdsenseAd from 'src/components/AdsenseAd/AdsenseAd';
import BlankCounterRow from 'src/components/CounterRow/BlankCounterRow';
import CounterRow from 'src/components/CounterRow/CounterRow';
import MetaTags from 'src/components/shared/MetaTags';
import PatreonButton from 'src/components/shared/PatreonButton';

import { ContainerColumn } from 'src/styles/style';
import { getSquadStubs } from 'src/helpers/data';

import { usePrevious } from 'src/helpers';
import { AuthContext } from 'src/userContext';
import ColorIndicator from './ColorIndicator';
import { CountersPageWrapper } from './style';

const isSnap = navigator.userAgent === 'ReactSnap';

const CountersPage = ({
  handleViewBtn,
  reload,
  size,
  view,
  ...props
}) => {
  CountersPage.propTypes = {
    handleViewBtn: PropTypes.func,
    reload: PropTypes.func,
    size: PropTypes.string,
    view: PropTypes.string,
  };

  const [collapse, setCollapse] = useState(null);
  const [stubsNormal, setStubsNormal] = useState();
  const [stubsReverse, setStubsReverse] = useState();
  const { authenticated, user } = useContext(AuthContext);

  useEffect(() => {
    const abortController = new AbortController();
    const opts = { signal: abortController.signal };

    async function getStubs() {
      try {
        const response = await getSquadStubs(size, opts);
        if (!_.isEmpty(response)) {
          const { normal, reverse } = response;
          setStubsNormal(normal);
          setStubsReverse(reverse);
        }
      } catch (err) {
        if (!abortController.signal.aborted) {
          console.error('getStubs aborted', err);
        }
      }
    }

    getStubs();
    return () => {
      abortController.abort();
    };
  }, [size]);

  const { patreonId } = user;
  const selectedStubs = view === 'normal' ? stubsNormal : stubsReverse;
  const toggleCollapse = useCallback(
    input => setCollapse(collapse === input ? null : input),
    [collapse],
  );
  const toggleAd = adSlot => (!isSnap && <AdsenseAd adSlot={adSlot}/>);

  const prevSize = usePrevious(size);

  const buildCounterRows = prevSize === size
    && selectedStubs
    && selectedStubs.length
    && selectedStubs.map(stub => (<LazyLoad once key={`CounterRow_${view}_${size}_${stub.id}`} placeholder={null}>
        <CounterRow
          collapse={collapse}
          leftSquadStub={stub}
          size={size}
          reload={reload}
          toggleCollapse={toggleCollapse}
          view={view}
        />
      </LazyLoad>));

  return (
    <ContainerColumn>
      <MetaTags
        title={`${size} Counters`}
        content={`${size} Counters for the mobile game Star Wars: Galaxy of Heroes`}
      />

      <CountersPageWrapper>
        {!patreonId && <PatreonButton/>}
        {!patreonId && toggleAd('2779553573')}

        <div className="columnTitles">
          <div className="col-3 d-flex justify-content-center align-items-center">
            <h1 className="mb-0">{view === 'normal' ? 'Opponent' : 'Counter'}</h1>
          </div>
          <div className="col-7 d-flex justify-content-center align-items-center">
            <h1 className="mb-0">{view === 'normal' ? `${size} Counters` : `${size} Opponents`}</h1>
          </div>
          <Button className="btn-sm col-2 reverseCounterButton" color="warning" onClick={handleViewBtn}>
            {view === 'normal' ? 'Normal View' : 'Reverse View'}
          </Button>
        </div>
        <div>
        <small className="m-0 p-0 text-secondary">
              {
                view === 'normal'
                  ? 'Click on an opponent or counter squad below to see more info.'
                  : 'Click on an opponent squad to see more info.'
              }
            </small>
        </div>
        <div>
          {authenticated
          && user.patronStatus === 'active_patron'
          && user.username
          && view === 'normal'
          && <BlankCounterRow
            reload={reload}
            size={size}
            view={view}
          />}
          {buildCounterRows || ''}
        </div>

        <footer>
          <ColorIndicator />
          {!patreonId && <PatreonButton/>}
          {!patreonId && toggleAd('7648736876')}
        </footer>
      </CountersPageWrapper>
    </ContainerColumn>
  );
};

export default React.memo(CountersPage);
