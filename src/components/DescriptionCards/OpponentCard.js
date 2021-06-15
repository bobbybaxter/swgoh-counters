import React, {
  memo, useContext,
} from 'react';
import PropTypes from 'prop-types';
import { format } from 'date-fns';
import { Button, Collapse } from 'reactstrap';

import ModalEditSquad from 'src/components/Modals/ModalEditSquad';
import ModalPortal from 'src/components/ModalPortal/ModalPortal';
import SquadHeader from 'src/components/shared/SquadHeader';
import { useToggle } from 'src/helpers';
import { AuthContext } from 'src/contexts/userContext';
import { AccordionContext } from 'src/contexts/accordionContext';
import { EditMenu } from 'src/styles/style';

import {
  BottomWrapper,
  DescriptionText,
  DetailsDivCenter,
  TopWrapper,
} from './style';

const OpponentCard = ({
  leftSquadStub,
  reload,
  size,
}) => {
  OpponentCard.propTypes = {
    leftSquadStub: PropTypes.object.isRequired,
    reload: PropTypes.func.isRequired,
    size: PropTypes.string.isRequired,
  };

  const [isOpen, setIsOpen] = useToggle(false);
  const { isActivePatron, user } = useContext(AuthContext);
  const { collapse } = useContext(AccordionContext);

  const {
    id,
    createdByName,
    createdOn,
    description,
    generalStrategy,
  } = leftSquadStub;

  return (
    <Collapse isOpen={id === collapse}>
      <TopWrapper>
        <DetailsDivCenter>
          <h6 className="text-secondary mb-1">Opponent Squad</h6>
          <SquadHeader size={size} squad={leftSquadStub} />
          <DescriptionText className="text-left"><strong className="text-secondary">Details: </strong>{description}</DescriptionText>
          <DescriptionText className="text-left"><strong className="text-secondary">General Strategy: </strong>{generalStrategy}</DescriptionText>
        </DetailsDivCenter>
      </TopWrapper>

      <BottomWrapper>
        <EditMenu>
          {/* only users that have signed in, are active patrons,
          and have a allyCode can update counters */}
          {isActivePatron && user.username && <p><Button className="p-0 m-0" size="sm" color="link" onClick={() => setIsOpen(true)}><small>edit squad</small></Button></p>}
          {createdOn && <p><small>updated on: {format(new Date(createdOn), 'MMM d, yyyy')}</small></p>}
          <p><small>by: {createdByName}</small></p>
        </EditMenu>
      </BottomWrapper>

      {isOpen && (
        <ModalPortal>
          <ModalEditSquad
            isOpen={isOpen}
            squad={leftSquadStub}
            reload={reload}
            size={size}
            toggle={setIsOpen}
          />
        </ModalPortal>
      )}
    </Collapse>
  );
};

export default memo(OpponentCard);
