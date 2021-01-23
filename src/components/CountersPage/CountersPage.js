import React, { useEffect, useState } from 'react';
import { Button } from 'reactstrap';
import PropTypes from 'prop-types';

// import AdsenseAd from 'src/components/AdsenseAd/AdsenseAd';
import BlankCounterRow from 'src/components/CounterRow/BlankCounterRow';
import CounterRow from 'src/components/CounterRow/CounterRow';
import MetaTags from 'src/components/shared/MetaTags';
import PatreonButton from 'src/components/shared/PatreonButton';

import { ContainerColumn } from 'src/styles/style';
import { getSquadStubs } from 'src/helpers/data';

import ColorIndicator from './ColorIndicator';
import { CountersPageWrapper } from './style';

// const isSnap = navigator.userAgent === 'ReactSnap';

// TODO: Add tests
// TODO: turn ads back on before deployment
export default function CountersPage({
  authenticated, handleViewBtn, reload, size, user, view, ...props
}) {
  CountersPage.propTypes = {
    authenticated: PropTypes.bool,
    handleViewBtn: PropTypes.func,
    reload: PropTypes.func,
    size: PropTypes.string,
    user: PropTypes.shape({
      allyCode: PropTypes.string,
      email: PropTypes.string,
      id: PropTypes.string,
      patreonId: PropTypes.string,
      patronStatus: PropTypes.string,
      username: PropTypes.string,
    }).isRequired,
    view: PropTypes.string,
  };

  const [collapse, setCollapse] = useState(null);
  const [stubsNormal, setStubsNormal] = useState();
  const [stubsReverse, setStubsReverse] = useState();

  useEffect(() => {
    async function getStubs() {
      const { normal, reverse } = await getSquadStubs(size);
      await setStubsNormal(normal);
      await setStubsReverse(reverse);
    }

    getStubs();
  }, [size]);

  const { patreonId } = user;
  const selectedStubs = view === 'normal' ? stubsNormal : stubsReverse;
  const toggleCollapse = input => (setCollapse(collapse === input ? null : input));
  // const toggleAd = adSlot => (!isSnap && <AdsenseAd adSlot={adSlot}/>);

  const buildCounterRows = selectedStubs
    && selectedStubs.length
    && selectedStubs.map(stub => <CounterRow
        authenticated={authenticated}
        collapse={collapse}
        key={`${view}_${size}_${stub.id}`}
        leftSquadStub={stub}
        size={size}
        reload={reload}
        toggleCollapse={toggleCollapse}
        view={view}
        user={user}
      />);

  return (
    <ContainerColumn>
      <MetaTags
        title={`${size} Counters`}
        content={`${size} Counters for the mobile game Star Wars: Galaxy of Heroes`}
      />

      <CountersPageWrapper>
        {!patreonId && <PatreonButton/>}
        {/* {!patreonId && toggleAd('2779553573')} */}

        <div className="columnTitles">
          <h1 className="col-3 mb-0">{view === 'normal' ? 'Opponent' : 'Counter'}</h1>
          <div className="col-7">
            <h1 className="mb-0">{view === 'normal' ? `${size} Counters` : `${size} Opponents`}</h1>
            <small className="m-0 p-0 text-secondary">
              {
                view === 'normal'
                  ? 'Click on a counter squad to see more info.'
                  : 'Click on an opponent squad to see more info.'
              }
            </small>
          </div>
          <Button className="btn-sm col-2 reverseCounterButton" color="warning" onClick={handleViewBtn}>
            {view === 'normal' ? 'Normal View' : 'Reverse View'}
          </Button>
        </div>

        <div>
          {buildCounterRows || ''}
          {view === 'normal' && <BlankCounterRow
            reload={reload}
            size={size}
            user={user}
            view={view}
          />}
        </div>

        <footer>
          {!patreonId && <PatreonButton/>}
          {/* {!patreonId && toggleAd('7648736876')} */}
          <ColorIndicator />
          {/* <div className="offset-2 col-8 border-dark border-top"></div> */}
        </footer>
      </CountersPageWrapper>
    </ContainerColumn>
  );
}
