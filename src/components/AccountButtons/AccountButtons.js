import React, { useEffect, useCallback, useState } from 'react';
import { Button } from 'reactstrap';

// import firebaseData from '../../helpers/data/firebaseData';

import convertToTwoDigits from '../../helpers/convertToTwoDigits';

import './AccountButtons.scss';

// TODO: Add proptypes
// TODO: Add tests
export default function AccountButtons(props) {
  const timeoutDateInStorage = JSON.parse(localStorage.getItem('timeoutDate'));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const calculateTimeLeft = useCallback(() => {
    // calculates difference between the two dates and returns difference
    const difference = +timeoutDateInStorage - +new Date();
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        // days: convertToTwoDigits(Math.floor(difference / (1000 * 60 * 60 * 24))),
        hr: convertToTwoDigits(Math.floor((difference / (1000 * 60 * 60)) % 24)),
        min: convertToTwoDigits(Math.floor((difference / 1000 / 60) % 60)),
        sec: convertToTwoDigits(Math.floor((difference / 1000) % 60)),
      };
    }

    return timeLeft;
  });

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
  }, [calculateTimeLeft]);

  const timerComponents = [];

  Object.keys(timeLeft).forEach((interval) => {
    if (!timeLeft[interval]) {
      return;
    }

    if (interval !== 'sec') {
      timerComponents.push(
        <span key={interval}>
          {timeLeft[interval]}{':'}
        </span>,
      );
    } else {
      timerComponents.push(
        <span key={interval}>
          {timeLeft[interval]}
        </span>,
      );
    }
  });

  useEffect(() => {
    if (!timerComponents.length) {
      props.enableRefreshButtons();
    } else {
      props.disableRefreshButtons();
    }
  }, [props, timerComponents.length]);

  return (
    <div className="AccountButtons">
      <div className="refreshElements mt-1">
        {
          !props.haveUserUnits
            ? ''
            : <Button
                className="btn-sm mr-1"
                onClick={props.refreshPlayerData}
                disabled={props.isRefreshDisabled}
              >Refresh Data</Button>
        }
        {
          !props.haveUserUnits
            ? ''
            : <Button
                className="btn-sm"
                onClick={props.clearAllyCode}
                disabled={props.isRefreshDisabled}
              >Clear Ally Code</Button>
        }
      </div>
      {
        !props.isRefreshDisabled
          ? ''
          : <div className="refreshElements">
              <span className="mr-1">reset data cooldown:</span>
              {timerComponents.length ? timerComponents : <span>Time's Up!</span>}
            </div>
      }

    </div>
  );
}
