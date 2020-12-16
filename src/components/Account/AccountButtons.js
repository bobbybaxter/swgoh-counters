import React, { useEffect, useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'reactstrap';

import { importCharacterData, importCounterData, importSquadData } from 'src/helpers/data';
import { convertToTwoDigits } from 'src/helpers';
import { AccountButtonsWrapper, RefreshElements } from './style';

// TODO: Add tests
export default function AccountButtons(props) {
  AccountButtons.propTypes = {
    user: PropTypes.object,
    timeoutCompletionDate: PropTypes.string,
    haveUserUnits: PropTypes.bool,
    refreshPlayerData: PropTypes.func,
    clearAllyCode: PropTypes.func,
    isRefreshDisabled: PropTypes.bool,
    enableRefreshButtons: PropTypes.func,
    disableRefreshButtons: PropTypes.func,
  };

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

  const importCharacters = async () => {
    await importCharacterData();
  };

  const importSquads = async () => {
    try {
      await importSquadData();
    } catch (err) {
      console.error('importSquads error :>> ', err);
    }
  };

  const importCounters = async () => {
    try {
      await importCounterData();
    } catch (err) {
      console.error('importCounters error :>> ', err);
    }
  };

  return (
    <AccountButtonsWrapper>
      <RefreshElements>
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
        {
          !props.haveUserUnits
            ? ''
            : <Button
                className="btn-sm ml-1"
                onClick={importCharacters}
              >Import Characters</Button>
        }
        {
          !props.haveUserUnits
            ? ''
            : <Button
                className="btn-sm mx-1"
                onClick={importSquads}
              >Import Squads</Button>
        }
        {
          !props.haveUserUnits
            ? ''
            : <Button
                className="btn-sm"
                onClick={importCounters}
              >Import Counters</Button>
        }
      </RefreshElements>
      {
        !props.isRefreshDisabled
          ? ''
          : <div className="refreshElements">
              <span className="mr-1">reset data cooldown:</span>
              {timerComponents.length ? timerComponents : <span>Time's Up!</span>}
            </div>
      }

    </AccountButtonsWrapper>
  );
}
