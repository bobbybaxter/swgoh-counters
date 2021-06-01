import React, {
  memo, useContext, useEffect, useState,
} from 'react';
import { Button, UncontrolledAlert } from 'reactstrap';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { useHistory } from 'react-router-dom';
import LazyLoad from 'react-lazyload';

import AdsenseAd from 'src/components/AdsenseAd/AdsenseAd';
import BlankCounterRow from 'src/components/CounterRow/BlankCounterRow';
import {
  MetaTags, PatreonButton, PatreonReverseButton, PatreonSortButton, ToonImg,
} from 'src/components/shared';

import { ContainerColumn, LeftDivSquad, SquadTitle } from 'src/styles/style';
import { getSquadStubs } from 'src/helpers/data';

import { getImage, usePrevious } from 'src/helpers';
import { AuthContext } from 'src/contexts/userContext';
import ColorIndicator from './ColorIndicator';
import CountersPageRow from './CountersPageRow';
import SortBox from './SortBox';
import { CountersPageWrapper } from './style';
import tips from './tips';

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

  const [excludedCounters, setExcludedCounters] = useState([]);
  const [excludedOpponents, setExcludedOpponents] = useState([]);
  const [stubsNormal, setStubsNormal] = useState();
  const [stubsReverse, setStubsReverse] = useState();
  const [counterLeadersNormal, setCounterLeadersNormal] = useState();
  const [counterLeadersReverse, setCounterLeadersReverse] = useState();
  const {
    isActivePatron, isRestricted, user,
  } = useContext(AuthContext);
  const history = useHistory();
  const anyExcludedLeaders = !_.isEmpty(excludedCounters) || !_.isEmpty(excludedOpponents);

  useEffect(() => {
    function checkForRedirect() {
      if (user && user.patreonId && !user.accessToken) {
        history.push('/patreonLink');
      }
      return '';
    }

    checkForRedirect();
  }, [history, user, user.accessToken, user.patreonId]);

  useEffect(() => {
    const abortController = new AbortController();
    const opts = { signal: abortController.signal };

    async function getStubs() {
      try {
        const response = await getSquadStubs(size, opts);
        if (!_.isEmpty(response)) {
          const {
            normal, reverse, leadersNormal, leadersReverse,
          } = response;
          setStubsNormal(normal);
          setStubsReverse(reverse);
          setCounterLeadersNormal(leadersNormal);
          setCounterLeadersReverse(leadersReverse);
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

  const allSquads = JSON.parse(sessionStorage.getItem('squads')) || [];
  const selectedStubs = view === 'normal' ? stubsNormal : stubsReverse;
  const selectedLeaders = view === 'normal' ? counterLeadersNormal : counterLeadersReverse;

  const toggleAd = adSlot => (!isSnap && <AdsenseAd adSlot={adSlot}/>);
  const leaderIds = selectedStubs && _.uniq(selectedStubs.map(x => x.toon1Id));
  const leaders = leaderIds && leaderIds.map(leaderId => characters.find(x => x.id === leaderId));
  const inFeedAdSlots = ['8612137902', '2722706345', '7380422067'];
  const amountOfAds = leaderIds && Math.round(leaderIds.length / 15);
  const randomAdRows = leaderIds && _.sampleSize(_.range(1, leaderIds.length), amountOfAds);
  const prevSize = usePrevious(size);
  const shouldBuildRows = prevSize === size
    && selectedStubs
    && selectedStubs.length;

  const buildCountersPageRows = shouldBuildRows && leaderIds
    .filter(x => !excludedOpponents.includes(x))
    .map((id, index) => {
      const isAdRow = randomAdRows.includes(index);
      const leader = characters.find(x => x.id === id);
      const leaderStubs = selectedStubs.filter(x => x.toon1Id === id);
      const leaderSquads = allSquads.filter(x => x.toon1Id === id);

      return (
        leaderStubs && <LazyLoad once key={`leaderRow_${id}`}>
          <div>
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
                <CountersPageRow
                  anyExcludedLeaders={anyExcludedLeaders}
                  excludedCounters={excludedCounters}
                  leaderId={leader.id}
                  leaderSquads={leaderSquads}
                  reload={reload}
                  size={size}
                  stubs={leaderStubs}
                  view={view}
                />
              </div>
            </div>
            {isRestricted && isAdRow && toggleAd(_.sample(inFeedAdSlots))}
          </div>
        </LazyLoad>
      );
    });

  function handleViewBtnSideAction() {
    setExcludedCounters([]);
    setExcludedOpponents([]);
    handleViewBtn();
  }

  return (
    selectedStubs && <ContainerColumn>
      <MetaTags
        title={`${size} Counters`}
        content={`${size} Counters for the mobile game Star Wars: Galaxy of Heroes`}
      />

      <CountersPageWrapper>
        {
          <UncontrolledAlert color="warning">
            {_.sample(tips)}
          </UncontrolledAlert>
        }
        {!isActivePatron && <PatreonButton />}
        {isRestricted && toggleAd('2779553573')}

        <div>
          {!isRestricted
            ? leaders && selectedLeaders && <SortBox
              excludedCounters={excludedCounters}
              excludedOpponents={excludedOpponents}
              leaderIds={leaderIds}
              leaders={leaders}
              selectedLeaders={selectedLeaders}
              setExcludedCounters={setExcludedCounters}
              setExcludedOpponents={setExcludedOpponents}
              view={view}
            />
            : <PatreonSortButton href="https://patreon.com/saiastrange" />
          }
          {anyExcludedLeaders && <div className="bg-success">Filters On</div>}
        </div>

        <div className="columnTitles">
          <div className="col-3 d-flex justify-content-center align-items-center">
            <h1 className="mb-0">{view === 'normal' ? 'Opponent' : 'Counter'}</h1>
          </div>
          <div className="col-7 d-flex justify-content-center align-items-center">
            <h1 className="mb-0">{view === 'normal' ? `${size} Counters` : `${size} Opponents`}</h1>
          </div>
          {!isRestricted
            ? <Button className="btn-sm col-2 reverseCounterButton" color="warning" onClick={handleViewBtnSideAction}>
                {view === 'normal' ? 'Normal View' : 'Reverse View'}
              </Button>
            : <PatreonReverseButton href="https://patreon.com/saiastrange" />
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
          {isActivePatron
          && user.allyCode
          && view === 'normal'
          && _.isEmpty(excludedCounters)
          && _.isEmpty(excludedOpponents)
          && <BlankCounterRow
            reload={reload}
            size={size}
            view={view}
          />}
          {buildCountersPageRows || ''}
        </div>

        <footer>
          <ColorIndicator />
          {!isActivePatron && <PatreonButton />}
        </footer>
      </CountersPageWrapper>
    </ContainerColumn>
  );
};

export default memo(CountersPage);
