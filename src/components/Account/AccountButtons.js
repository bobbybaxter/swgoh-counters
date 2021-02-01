import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'reactstrap';

import { importCharacterData, importCounterData, importSquadData } from 'src/helpers/data';
import { AccountButtonsWrapper, RefreshElements } from './style';

export default function AccountButtons({
  user,
  clearAllyCode,
}) {
  AccountButtons.propTypes = {
    user: PropTypes.object,
    clearAllyCode: PropTypes.func,
  };

  const importCharacters = async () => {
    try {
      await importCharacterData();
    } catch (err) {
      console.error('importCharacters error :>>', err);
    }
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
          user.username
            && <Button
                className="btn-sm"
                onClick={clearAllyCode}
            >Clear Ally Code</Button>
        }
        {
          user.id === process.env.REACT_APP_ADMIN_ID
            && <Button
              className="btn-sm ml-1"
              onClick={importCharacters}
            >Import Characters</Button>
        }
        {
          user.id === process.env.REACT_APP_ADMIN_ID
            && <Button
              className="btn-sm mx-1"
              onClick={importSquads}
            >Import Squads</Button>
        }
        {
          user.id === process.env.REACT_APP_ADMIN_ID
            && <Button
              className="btn-sm"
              onClick={importCounters}
            >Import Counters</Button>
        }
      </RefreshElements>
    </AccountButtonsWrapper>
  );
}
