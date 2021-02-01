import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { format } from 'date-fns';
import { Button } from 'reactstrap';

import ModalEditSquad from 'src/components/Modals/ModalEditSquad';
import ModalPortal from 'src/components/ModalPortal/ModalPortal';
import SquadHeader from 'src/components/shared/SquadHeader';
import { useToggle } from 'src/helpers';
import { EditMenu } from 'src/styles/style';

import {
  BottomWrapper,
  DescriptionText,
  DetailsDivCenter,
  TopWrapper,
} from './style';

const defaultSquad = {
  id: '',
  name: '',
  toon1Id: '',
  toon1Name: '',
  toon2Id: '',
  toon2Name: '',
  toon3Id: '',
  toon3Name: '',
  toon4Id: '',
  toon4Name: '',
  toon5Id: '',
  toon5Name: '',
  description: '',
  generalStrategy: '',
  latestVersionId: '',
  createdOn: '',
  createdById: '',
  createdByName: '',
};

const OpponentCard = ({
  authenticated,
  leftSquadStub,
  reload,
  size,
  toggleCollapse,
  user,
}) => {
  OpponentCard.propTypes = {
    authenticated: PropTypes.bool,
    leftSquadStub: PropTypes.object,
    reload: PropTypes.func,
    size: PropTypes.string,
    toggleCollapse: PropTypes.func,
    user: PropTypes.object,
  };

  const [squad, setSquad] = useState(defaultSquad);
  const [isOpen, setIsOpen] = useToggle(false);

  const { generalStrategy, description } = squad;

  useEffect(() => {
    async function getSquad() {
      const squads = JSON.parse(sessionStorage.getItem('squads')) || [];
      const matchedSquad = squads.find(x => x.id === (leftSquadStub.id)) || defaultSquad;
      await setSquad(matchedSquad);
    }

    getSquad();
  }, [leftSquadStub.id, leftSquadStub.name]);

  return (
    <>
      <TopWrapper>
        <DetailsDivCenter>
          <h6 className="text-secondary mb-1">Opponent Squad</h6>
          { squad && <SquadHeader size={size} squad={squad} /> }
          <DescriptionText className="text-left"><strong className="text-secondary">Details: </strong>{description}</DescriptionText>
          <DescriptionText className="text-left"><strong className="text-secondary">General Strategy: </strong>{generalStrategy}</DescriptionText>
        </DetailsDivCenter>
      </TopWrapper>

      <BottomWrapper>
        <EditMenu>
          {/* only users that have signed in, are active patrons, and have a allyCode can update counters */}
          {authenticated && user.patronStatus === 'active_patron' && user.username && <p><Button className="p-0 m-0" size="sm" color="link" onClick={() => setIsOpen(true)}><small>edit squad</small></Button></p>}
          {/* TODO: make the date a link that goes to a History page for the counter */}
          {squad.createdOn && <p><small>updated on: {format(new Date(squad.createdOn), 'MMM d, yyyy')}</small></p>}
          {/* TODO: make the username a link that goes to a page for the user */}
          <p><small>by: {squad.createdByName}</small></p>
        </EditMenu>
      </BottomWrapper>

      {isOpen && (
        <ModalPortal>
          <ModalEditSquad
            isOpen={isOpen}
            squad={squad}
            reload={reload}
            size={size}
            toggle={setIsOpen}
            user={user}
          />
        </ModalPortal>
      )}
    </>
  );
};

export default React.memo(OpponentCard);
