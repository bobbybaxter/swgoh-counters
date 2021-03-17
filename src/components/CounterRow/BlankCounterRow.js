import React from 'react';
import PropTypes from 'prop-types';

import ModalAddSquad from 'src/components/Modals/ModalAddSquad';
import ModalPortal from 'src/components/ModalPortal/ModalPortal';
import ToonImg from 'src/components/shared/ToonImg';
import { useToggle } from 'src/helpers';

import {
  CounterRowWrapper, LeftDiv, RightDiv, RightDivWrapper, SquadTitle,
} from './style';


export default function BlankCounterRow({
  reload,
  size,
  view,
  ...props
}) {
  BlankCounterRow.propTypes = {
    reload: PropTypes.func,
    size: PropTypes.string,
  };

  const [isOpen, setIsOpen] = useToggle(false);

  return (
    <CounterRowWrapper>
      <div className="d-flex flex-row">

        {/* Left Side Squad Div */}
        <LeftDiv className="col-3">
          <div>
            <ToonImg
              alt="Add a new opponent"
              id={'addSquadButton'}
              onClick={() => setIsOpen(true)}
              src={require('../../assets/Plus.png')}
              title="Add a new opponent"
            />
            <SquadTitle>Add a new opponent</SquadTitle>
          </div>
          {isOpen && (
            <ModalPortal>
              <ModalAddSquad
                isOpen={isOpen}
                reload={reload}
                size={size}
                toggle={setIsOpen}
                view={view}
              />
            </ModalPortal>
          )}
        </LeftDiv>

        {/* Right Side Counter Div */}
        <RightDiv className="col-9">
          <RightDivWrapper></RightDivWrapper>
        </RightDiv>
        </div>
    </CounterRowWrapper>
  );
}
