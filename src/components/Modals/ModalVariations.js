import React, { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/macro';
import { colors } from 'src/styles/colors';
import _ from 'lodash';
import { NavLink as RRNavLink } from 'react-router-dom';
import { Button, NavLink } from 'reactstrap';

import { AuthContext } from 'src/contexts/userContext';
import ToonImg from 'src/components/shared/ToonImg';
import { getImage } from 'src/helpers';
import { getCounterVariations } from 'src/helpers/data';
import {
  ModalWrapper,
  StyledModalHeader,
} from './style';

export const CharCard = styled.div`
  display: flex;
  flex-direction: column;
`;

export const NewSquadChar = styled.div`
  display: flex;
  flex-direction: column;
  width: 32px;
  align-items: center;
  justify-content: evenly
  word-break: break-word;

  @media only screen and (min-width:768px) {
    width: 50px;
  }

  @media only screen and (min-width:992px) {
    width: 60px;
  }

  @media only screen and (min-width:1200px) {
    width: 70px;
  }
`;

export const VariationRow = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: space-evenly;
  align-items: center;
  padding: .5rem;
  background-color: ${ props => (( props.index && props.index % 2 ) ? '#FFFFFF10' : '' ) };
`;

export const VariationTypeWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-top: 1px solid #343a40;
  background-color: ${ props => `${ props.color }20` };
`;

export const VariationSquad = styled.div`
  display: flex;
  flex-direciton: row;
  width: 100%;
  justify-content: ${ props => {
    if ( props.left ) { return 'flex-end'; }
    if ( props.right ) { return 'flex-start'; }
    return 'space-evenly';
  } };
  align-items: center;
`;

const StyledLinkButton = styled( NavLink )`
  display: inline-block;
  background: rgba(255, 0, 0, 0.863);
  color: whitesmoke;
  text-align: center;
  align-items: center;
  justify-content: center;
  margin: 0 2.5px;
  font-weight: 500;
  font-size: .8rem;
  padding: .25rem;

  @media only screen and (min-width:768px) {
    font-size: .9rem;
  }

  @media only screen and (min-width:992px) {
    font-size: 1rem;
  }

  @media only screen and (min-width:1200px) {
    font-size: 1.2rem;
  }
`;

export default function ModalVariations( {
  counter,
  isOpen,
  leftSquad,
  rightSquad,
  size,
  toggle,
  view,
  ...props
} ) {
  ModalVariations.propTypes = {
    counter: PropTypes.object.isRequired,
    isOpen: PropTypes.bool.isRequired,
    leftSquad: PropTypes.object.isRequired,
    rightSquad: PropTypes.object.isRequired,
    size: PropTypes.string.isRequired,
    toggle: PropTypes.func.isRequired,
    view: PropTypes.string.isRequired,
  };

  const closeBtn = <button className="close text-white" onClick={toggle}>&times;</button>;
  const [ variations, setVariations ] = useState();
  const { isRestricted } = useContext( AuthContext );

  useEffect(() => {
    // abortController cleans up cancelled requests
    const abortController = new AbortController();
    const opts = { signal: abortController.signal };

    async function getVariations() {
      const res = await getCounterVariations(
        view === 'normal' ? leftSquad.toon1Id : rightSquad.toon1Id,
        view === 'normal' ? rightSquad.toon1Id : leftSquad.toon1Id,
        size,
        opts,
      );
      setVariations( res );
    }

    getVariations();
    return () => {
      abortController.abort();
    };
  }, [ leftSquad.toon1Id, rightSquad.toon1Id, size, view ] );

  function buildSquadImages( squad, counterType ) {
    return squad && squad.map(( toon, i ) => ( i < size.charAt( 0 )
      && <CharCard key={`Variation_${ counter.id }_${ toon.name }_${ i }`}>
        <NewSquadChar>
          <ToonImg
            isVariation
            src={ getImage( toon.id ) }
            title={toon.name}
            alt={toon.name}
            color={ counterType && ( counterType === 'hard' ? colors.hardCounter : colors.softCounter ) }
          />
        </NewSquadChar>
      </CharCard> ));
  }

  function buildSquads( counters, counterType ) {
    const PatreonButton = <StyledLinkButton tag={RRNavLink} exact to="/login" className="btn w-100">
        Log In
      </StyledLinkButton>;

    return counters && counters.map(( x, i ) => {
      const { opponentSquad, counterSquad } = x;
      return <VariationRow key={`Variation_${ counter.id }_${ i }`} index={i}>
        <VariationSquad left>
          {buildSquadImages(
            view === 'normal' ? opponentSquad : counterSquad,
            view === 'normal' ? counterType : '',
          )}
        </VariationSquad>
        <div className="d-flex flex-row justify-content-center col-1">
          vs
        </div>
        <VariationSquad right>
        {isRestricted
          ? PatreonButton
          : buildSquadImages(
            view === 'normal' ? counterSquad : opponentSquad,
            view === 'normal' ? '' : counterType,
          )
        }
        </VariationSquad>
      </VariationRow>;
    } );
  }

  function sortByPopularity() {
    setVariations( [ ...variations ].sort(( a, b ) => ( a.totalSeen > b.totalSeen ? -1 : 1 )));
  }

  function sortByStrength() {
    setVariations( [ ...variations ].sort(( a, b ) => ( a.avgWin > b.avgWin ? -1 : 1 )));
  }

  function sortByOpponentSquad() {
    setVariations( [ ...variations ]
      .sort(( a, b ) => ( a.opponentSquad[ 4 ].id > b.opponentSquad[ 4 ].id ? -1 : 1 ))
      .sort(( a, b ) => ( a.opponentSquad[ 3 ].id > b.opponentSquad[ 3 ].id ? -1 : 1 ))
      .sort(( a, b ) => ( a.opponentSquad[ 2 ].id > b.opponentSquad[ 2 ].id ? -1 : 1 ))
      .sort(( a, b ) => ( a.opponentSquad[ 1 ].id > b.opponentSquad[ 1 ].id ? -1 : 1 )));
  }

  function sortByCounterSquad() {
    setVariations( [ ...variations ]
      .sort(( a, b ) => ( a.counterSquad[ 4 ].id > b.counterSquad[ 4 ].id ? -1 : 1 ))
      .sort(( a, b ) => ( a.counterSquad[ 3 ].id > b.counterSquad[ 3 ].id ? -1 : 1 ))
      .sort(( a, b ) => ( a.counterSquad[ 2 ].id > b.counterSquad[ 2 ].id ? -1 : 1 ))
      .sort(( a, b ) => ( a.counterSquad[ 1 ].id > b.counterSquad[ 1 ].id ? -1 : 1 )));
  }

  const squadHeaders = (
    <VariationRow>
      <VariationSquad left>
        <h6 className="text-secondary m-0">{view === 'normal' ? 'Opponent Squad' : 'Counter Squad'}</h6>
      </VariationSquad>
      <div className="col-1"></div>
      <VariationSquad right>
        <h6 className="text-secondary m-0">{view === 'normal' ? 'Counter Squad' : 'Opponent Squad'}</h6>
      </VariationSquad>
    </VariationRow>
  );
  const hardCounters = variations && buildSquads( variations.filter( x => x.avgWin >= 0.90 ), 'hard' );
  const softCounters = variations && buildSquads( variations.filter( x => ( x.avgWin >= 0.75 && x.avgWin < 0.90 )), 'soft' );
  const avoidCounters = variations && buildSquads( variations.filter( x => x.avgWin < 0.75 ));

  return <ModalWrapper isOpen={isOpen} toggle={toggle}>
    <StyledModalHeader close={closeBtn}>
      <Button outline size="sm" className="mr-1" onClick={sortByPopularity}>Popularity</Button>
      <Button outline size="sm" className="mr-1" onClick={sortByStrength}>Strength</Button>
      {view === 'normal'
        ? <>
          <Button outline size="sm" className="mr-1" onClick={sortByOpponentSquad}>Opponent</Button>
          <Button outline size="sm" className="mr-1" onClick={sortByCounterSquad}>Counter</Button>
        </>
        : <>
          <Button outline size="sm" className="mr-1" onClick={sortByCounterSquad}>Counter</Button>
          <Button outline size="sm" className="mr-1" onClick={sortByOpponentSquad}>Opponent</Button>
        </>
      }
    </StyledModalHeader>

    { !_.isEmpty( hardCounters )
      && <VariationTypeWrapper color={colors.hardCounter}>
        <h6 className="m-0 pt-3">Hard</h6>
        {squadHeaders}
        {hardCounters}
      </VariationTypeWrapper>
    }

    { !_.isEmpty( softCounters )
      && <VariationTypeWrapper color={colors.softCounter}>
        <h6 className="m-0 pt-3">Soft</h6>
        {squadHeaders}
        {softCounters}
      </VariationTypeWrapper>
    }

    { !_.isEmpty( avoidCounters )
      && <VariationTypeWrapper color={colors.black}>
        <h6 className="m-0 pt-3">Avoid</h6>
        {squadHeaders}
        {avoidCounters}
      </VariationTypeWrapper>
    }
  </ModalWrapper>;
}
