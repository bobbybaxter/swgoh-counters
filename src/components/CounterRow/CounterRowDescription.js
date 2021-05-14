import React, { memo, useContext } from 'react';
import PropTypes from 'prop-types';
import { Collapse } from 'reactstrap';

import CounterCard from 'src/components/DescriptionCards/CounterCard';

import { CounterCardWrapper } from 'src/styles/style';
import { AccordionContext } from 'src/contexts/accordionContext';

const CounterRowDescription = ({
  counterStubs,
  leftSquad,
  reload,
  rightSquadStub,
  size,
  view,
  ...props
}) => {
  CounterRowDescription.propTypes = {
    counterStubs: PropTypes.array.isRequired,
    leftSquad: PropTypes.object.isRequired,
    reload: PropTypes.func,
    rightSquadStub: PropTypes.object.isRequired,
    size: PropTypes.string.isRequired,
    view: PropTypes.string.isRequired,
  };

  const { collapse } = useContext(AccordionContext);

  const { id } = rightSquadStub;

  return (
    <CounterCardWrapper key={id}>
      <Collapse isOpen={id === collapse}>
        <CounterCard
          counter={rightSquadStub}
          counterStubs={counterStubs}
          leftSquad={leftSquad}
          reload={reload}
          size={size}
          view={view}
        />
      </Collapse>
    </CounterCardWrapper>
  );
};

export default CounterRowDescription;
