/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */
/* eslint-disable max-len */
import React, {
  useState, Suspense, lazy,
} from 'react';
import {
  Button,
} from 'reactstrap';
import MetaTags from 'react-meta-tags';

import './Counters3v3.scss';

const CounterRow = lazy(() => import('../CounterRow/CounterRow'));

// TODO: consolidate shared code with Counters5v5
// TODO: Add proptypes
// TODO: Add tests
// TODO: Add react-meta-tags
const Counters3v3 = (props) => {
  const [collapse, setCollapse] = useState([]);
  const [view, setView] = useState('normal');

  const { countersNormal, countersReverse } = props;
  const selectedCounters = view === 'normal' ? countersNormal : countersReverse;

  const toggleCollapse = input => (setCollapse(collapse === input ? null : input));

  const buildCounterRows = selectedCounters.length
    ? selectedCounters.map(counter => <CounterRow
        collapse={collapse}
        counterTeams={counter.rightSideSquads}
        key={counter.leftSideSquad.id}
        squadWithCharData={counter.leftSideSquad}
        toggleCollapse={toggleCollapse}
        view={view}
      />)
    : '';

  const handleReverseCounter = () => {
    setView(view === 'normal' ? 'reverse' : 'normal');
  };

  const togglePatreonButton = props.user.patreonId
    ? ''
    : <div className="py-3">
        <a href="https://patreon.com/saiastrange" className="btn patreonBtn">SUPPORT US ON PATREON!</a>
      </div>;

  const toggleTopAd = props.user.patreonId
    ? ''
    : <div>
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>
        {/* <!-- 3v3 Top Ad --> */}
        <ins className="adsbygoogle"
            style={{ display: 'block' }}
            data-ad-client="ca-pub-9103583527998968"
            data-ad-slot="7848951384"
            data-ad-format="auto"
            data-full-width-responsive="true"></ins>
        <script>
            (adsbygoogle = window.adsbygoogle || []).push({});
        </script>
      </div>;

  const toggleBottomAd = props.user.patreonId
    ? ''
    : <div>
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>
        {/* <!-- 3v3 Bottom Ad --> */}
        <ins className="adsbygoogle"
            style={{ display: 'block' }}
            data-ad-client="ca-pub-9103583527998968"
            data-ad-slot="9162033056"
            data-ad-format="auto"
            data-full-width-responsive="true"></ins>
        <script>
            (adsbygoogle = window.adsbygoogle || []).push({});
        </script>
      </div>;

  return (
      <div className="Counters3v3">
        <MetaTags>
          <title>3v3 Counters</title>
          <meta name="description" content="3v3 counters for the mobile game Star Wars: Galaxy of Heroes"/>
          <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
        </MetaTags>
        <script data-ad-client="ca-pub-9103583527998968" async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>

        <div className="contentWrapper">

        {togglePatreonButton}
        {toggleTopAd}

          <div className="columnTitles">
            <h1 className="col-3 mb-0">{view === 'normal' ? 'Opponent' : 'Counter'}</h1>
            <div className="col-7">
              <h1 className="mb-0">{view === 'normal' ? '3v3 Counters' : '3v3 Opponents'}</h1>
              <small className="m-0 p-0 text-secondary">
                {
                  view === 'normal'
                    ? 'Click on a counter team to see more info.'
                    : 'Click on an opponent team to see more info.'
                }
              </small>
            </div>
            <Button className="btn-sm col-2 reverseCounterButton" onClick={handleReverseCounter}>
              {view === 'normal' ? 'Normal View' : 'Reverse View'}
            </Button>
          </div>
          <Suspense fallback={<div className="dark">Loading...</div>}>
            <div className="columnTeams">
              {buildCounterRows || ''}
            </div>
          </Suspense>
          <footer className="mt-3">
            {toggleBottomAd}

            <div className="d-flex flex-row justify-content-center align-items-center">
              <span className="hardCounterColorBox"></span>
                <h6 className="mb-0 mr-4">Hard Counter</h6>
              <span className="softCounterColorBox"></span>
                <h6 className="mb-0">Soft Counter</h6>
            </div>
            <div className="py-3">
              <strong>Note:</strong> Darth Revan (with or without Malak) is a hard counter unless it is listed as a soft counter<br/>
            </div>
            <div className="offset-2 col-8 border-dark border-top"></div>

            {togglePatreonButton}
          </footer>
        </div>
      </div>
  );
};

export default Counters3v3;
