import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'reactstrap';

import { importCharacterData, importCounterData, importSquadData } from 'src/helpers/data';
import { AccountButtonsWrapper, RefreshElements } from './style';

export default function AccountButtons(props) {
  AccountButtons.propTypes = {
    user: PropTypes.object,
    clearAllyCode: PropTypes.func,
  };

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
          props.user.allyCode
            && <Button
                className="btn-sm"
                onClick={props.clearAllyCode}
            >Clear Ally Code</Button>
        }
        {
          props.user.id === process.env.REACT_APP_ADMIN_ID
            && <Button
              className="btn-sm ml-1"
              onClick={importCharacters}
            >Import Characters</Button>
        }
        {
          props.user.id === process.env.REACT_APP_ADMIN_ID
            && <Button
              className="btn-sm mx-1"
              onClick={importSquads}
            >Import Squads</Button>
        }
        {
          props.user.id === process.env.REACT_APP_ADMIN_ID
            && <Button
              className="btn-sm"
              onClick={importCounters}
            >Import Counters</Button>
        }
      </RefreshElements>
    </AccountButtonsWrapper>
  );
}
