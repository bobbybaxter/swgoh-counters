import React, {
  memo, useContext, useEffect, useState,
} from 'react';
import { Button, UncontrolledAlert } from 'reactstrap';
import LazyLoad from 'react-lazyload';
import PropTypes from 'prop-types';
import _ from 'lodash';

import AdsenseAd from 'src/components/AdsenseAd/AdsenseAd';
import BlankCounterRow from 'src/components/CounterRow/BlankCounterRow';
import CounterRow from 'src/components/CounterRow/CounterRow';
import {
  MetaTags, PatreonButton, PatreonReverseButton, ToonImg,
} from 'src/components/shared';

import { ContainerColumn, LeftDivSquad, SquadTitle } from 'src/styles/style';
import { getSquadStubs } from 'src/helpers/data';

import { getImage, usePrevious } from 'src/helpers';
import { AuthContext } from 'src/contexts/userContext';
import ColorIndicator from './ColorIndicator';
import { CountersPageWrapper } from './style';

const isSnap = navigator.userAgent === 'ReactSnap';

const CountersPage = ({
  characters,
  handleViewBtn,
  reload,
  size,
  view,
  ...props
}) => {
  CountersPage.propTypes = {
    characters: PropTypes.array,
    handleViewBtn: PropTypes.func,
    reload: PropTypes.func,
    size: PropTypes.string,
    view: PropTypes.string,
  };

  const [stubsNormal, setStubsNormal] = useState();
  const [stubsReverse, setStubsReverse] = useState();
  const { isRestricted, user } = useContext(AuthContext);

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
  const toggleAd = adSlot => (!isSnap && <AdsenseAd adSlot={adSlot}/>);

  const leaders = selectedStubs && _.uniq(selectedStubs.map(x => x.toon1Id));

  const inFeedAdSlots = ['8612137902', '2722706345', '7380422067'];
  const amountOfAds = leaders && Math.round(leaders.length / 15);
  const randomAdRows = leaders && _.sampleSize(_.range(1, leaders.length), amountOfAds);
  const prevSize = usePrevious(size);
  const buildCounterRows = prevSize === size
    && selectedStubs
    && selectedStubs.length
    && selectedStubs && leaders.map((id, index) => {
    const isAdRow = randomAdRows.includes(index);
    const leader = characters.find(x => x.id === id);
    const buildRows = selectedStubs
      .filter(x => x.toon1Id === id)
      .map(stub => (
        <LazyLoad once key={`CounterRow_${view}_${size}_${stub.id}`} placeholder={null}>
          <CounterRow
            leftSquadStub={stub}
            key={`CounterRow_${view}_${size}_${stub.id}`}
            size={size}
            reload={reload}
            view={view}
          />
        </LazyLoad>
      ));
    return (
      leader
      && <div key={`leaderRow_${id}`}>
        <div className="d-flex flex-row">
            <LeftDivSquad id={`leaderRow_${id}`} className="col-3">
          <div className="d-flex flex-column align-items-center">
              <ToonImg
                alt={leader.name}
                id={id}
                src={getImage(id)}
                title={leader.name}
              />
              <SquadTitle>{leader.name}</SquadTitle>
          </div>
            </LeftDivSquad>
          <div className="p-0 col-9">
            {buildRows}
          </div>
        </div>
        {!patreonId && isAdRow && toggleAd(_.sample(inFeedAdSlots))}
      </div>
    );
  });

  return (
    <ContainerColumn>
      <MetaTags
        title={`${size} Counters`}
        content={`${size} Counters for the mobile game Star Wars: Galaxy of Heroes`}
      />

      <CountersPageWrapper>
        {!patreonId && (
          <UncontrolledAlert color="warning" className="text-left">
            <small>
              Since our February update, SWGOH Counters has grown from around 400 counters to over 2000,
              and receives over 75k users a month!  Although this growth is wonderful, it has brought hefty data
              costs that will soon double the current income received through Adsense and Patreon.<br/><br/>

              To keep the site alive, some content restrictions have been enabled for users that aren't active Patrons.
              Specific details will be provided on Discord (link in the bar above).<br/><br/>

              Please consider supporting us on Patreon!  At the moment, for $1 per month you'll gain full access to the site.
              With enough of your support, we'll be able to keep the bones of this resource still useful for free members.
            </small>
          </UncontrolledAlert>
        )}
        {!patreonId && <PatreonButton/>}
        {!patreonId && toggleAd('2779553573')}

        <div className="columnTitles">
          <div className="col-3 d-flex justify-content-center align-items-center">
            <h1 className="mb-0">{view === 'normal' ? 'Opponent' : 'Counter'}</h1>
          </div>
          <div className="col-7 d-flex justify-content-center align-items-center">
            <h1 className="mb-0">{view === 'normal' ? `${size} Counters` : `${size} Opponents`}</h1>
          </div>
          {!isRestricted
            ? <Button className="btn-sm col-2 reverseCounterButton" color="warning" onClick={handleViewBtn}>
                {view === 'normal' ? 'Normal View' : 'Reverse View'}
              </Button>
            : <PatreonReverseButton href="https://patreon.com/saiastrange">
                Reverse View for Patrons
              </PatreonReverseButton>
          }
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
          {!isRestricted
          && user.allyCode
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
        </footer>
      </CountersPageWrapper>
    </ContainerColumn>
  );
};

export default memo(CountersPage);
