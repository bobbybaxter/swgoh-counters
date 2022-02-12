import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import {
  Button, ButtonGroup, Input, UncontrolledCollapse,
} from 'reactstrap';

import NewSquadDisplay from 'src/components/shared/NewSquadDisplay';
import { searchCharacter, searchCounter, searchSquad } from 'src/helpers/data';
import CharacterPool from './CharacterPool';

const SeasonNums5v5 = [ 'All', 11, 13, 15, 17, 19, 21, 23 ];
const SeasonNums3v3 = [ 'All', 12, 14, 16, 18, 20, 22 ];

const defaultToon = {
  id: 'BLANK',
  name: 'Blank',
};

function buildDefaultSquad() {
  const defaultSquad = [];
  for ( let i = 0; i < 5; i += 1 ) {
    defaultSquad.push( defaultToon );
  }
  return defaultSquad;
}

const SearchBoxWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  overflow: hidden;
  border: 1px grey solid;
  padding: 0;
  align-items: normal;
`;

const SearchOptionsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  text-align: left;
`;

const FilterWrapper = styled.div`
  display: block;
  flex-direction: column;
  width: 100%;
  overflow: scroll;
  justify-content: center;

  @media only screen and (min-width:768px) {
    max-height: calc(100vh - 300px);
    min-height: 400px;
    display: flex;
    flex-direction: row;
    overflow: hidden;
  }
`;

const FormHalf = styled.div`
  display: flex;
  flex-direction: column;
  overflow: initial;
  width: 100%;
  padding-right: 15px;
  padding-left: 15px;

  @media only screen and (min-width:768px) {
    overflow: scroll;
    flex: 0 0 50%;
    max-width: 50%;
  }
`;

const OpponentBox = styled.div`
  display: flex;
  flex-direction: column;
  padding-bottom: 1rem;
  width: 100%;
  border-bottom: 1px solid #343a40;
`;

// TODO: add a dropdown for the most common squads for each leader
const SearchBox = ( {
  characters,
  handleLoading,
  handleSearchResults,
  handleSquadSize,
} ) => {
  SearchBox.propTypes = {
    characters: PropTypes.array.isRequired,
    handleLoading: PropTypes.func,
    handleSearchResults: PropTypes.func,
    handleSquadSize: PropTypes.func,
  };

  const [ tempLeftSquad, setTempLeftSquad ] = useState( buildDefaultSquad());
  const [ tempRightSquad, setTempRightSquad ] = useState( buildDefaultSquad());
  const [ tempSoloSquad, setTempSoloSquad ] = useState( buildDefaultSquad());
  const [ tempSoloCharacter, setTempSoloCharacter ] = useState( buildDefaultSquad());
  const [ searchType, setSearchType ] = useState( 'counter' );
  const [ seasonNums, setSeasonNums ] = useState( SeasonNums5v5 );
  const [ selectedSeason, setSelectedSeason ] = useState( SeasonNums5v5[ 0 ] );
  const [ size, setSize ] = useState( '5v5' );
  const [ squadPosition, setSquadPosition ] = useState( 'offense' );

  function returnBoxType( e ) {
    const parentNodeClass = e.currentTarget.parentNode.className;
    if ( parentNodeClass.includes( 'opponentBox' )) { return 'opponentBox'; }
    if ( parentNodeClass.includes( 'counterBox' )) { return 'counterBox'; }
    if ( parentNodeClass.includes( 'soloSquadBox' )) { return 'soloSquadBox'; }
    return 'soloBox';
  }

  function returnTempSquad( boxType ) {
    if ( boxType === 'opponentBox' ) { return [ ...tempLeftSquad ]; }
    if ( boxType === 'counterBox' ) { return [ ...tempRightSquad ]; }
    if ( boxType === 'soloSquadBox' ) { return [ ...tempSoloSquad ]; }
    return [ ...tempSoloCharacter ];
  }

  function setTempSquad( boxType, temp ) {
    if ( boxType === 'opponentBox' ) { return setTempLeftSquad( temp ); }
    if ( boxType === 'counterBox' ) { return setTempRightSquad( temp ); }
    if ( boxType === 'soloSquadBox' ) { return setTempSoloSquad( temp ); }
    return setTempSoloCharacter( temp );
  }

  async function addCharacter( e ) {
    e.preventDefault();
    const boxType = returnBoxType( e );

    const addedToon = {
      id: e.currentTarget.id,
      name: e.currentTarget.title,
    };

    const tempSquadCopy = returnTempSquad( boxType );
    const tempSquadIds = tempSquadCopy.map( x => x.id );

    if ( !tempSquadIds.includes( addedToon.id )) {
      const indexToFill = await tempSquadCopy.findIndex( x => x.id === 'BLANK' );
      if ( indexToFill < size.charAt( 0 )) {
        tempSquadCopy[ indexToFill ] = addedToon;
      }
      setTempSquad( boxType, tempSquadCopy );
    }
  }

  function handleSeasonSelect( e ) {
    e.preventDefault();
    const { value } = e.target;
    const seasonToAdd = value === 'All' ? 'All' : parseInt( value, 10 );
    setSelectedSeason( seasonToAdd );
  }

  async function removeCharacter( e ) {
    e.preventDefault();
    const boxType = returnBoxType( e );

    const { id } = e.target;
    const buttonIndex = id[ id.length - 1 ];
    const tempSquadCopy = returnTempSquad( boxType );
    tempSquadCopy[ buttonIndex ] = defaultToon;
    setTempSquad( boxType, tempSquadCopy );
  }

  function selectSize( e ) {
    const selectedSize = e.target.value;
    setSize( selectedSize );

    if ( selectedSize === '5v5' ) {
      setSeasonNums( SeasonNums5v5 );
      setSelectedSeason( SeasonNums5v5[ 0 ] );
    }

    if ( selectedSize === '3v3' ) {
      setSeasonNums( SeasonNums3v3 );
      setSelectedSeason( SeasonNums3v3[ 0 ] );
    }
  }

  function selectSearchType( e ) {
    const selectedSearchType = e.target.value;
    setSearchType( selectedSearchType );
  }

  function selectSquadPosition( e ) {
    const selectedSquadPosition = e.target.value;
    setSquadPosition( selectedSquadPosition );
  }

  async function submitSearch() {
    let parsedSeason, searchResults;
    if ( selectedSeason === 'All' ) {
      parsedSeason = size === '5v5' ? 10 : 9;
    } else {
      parsedSeason = selectedSeason;
    }

    await handleLoading();
    if ( searchType === 'counter' ) {
      searchResults = await searchCounter( {
        battleType: size,
        selectedSeason: parsedSeason,
        opponentSquad: tempLeftSquad,
        counterSquad: tempRightSquad,
      } );
    } else if ( searchType === 'squad' ) {
      searchResults = await searchSquad( {
        battleType: size,
        selectedSeason: parsedSeason,
        squadPosition,
        squad: tempSoloSquad,
      } );
    } else if ( searchType === 'character' ) {
      searchResults = await searchCharacter( {
        battleType: size,
        selectedSeason: parsedSeason,
        squadPosition,
        characterId: tempSoloCharacter[ 0 ].id,
      } );
    }

    await handleSearchResults( searchResults );
    await handleSquadSize( size );
  }

  function determineBoxLayout() {
    function buildBox( position, boxType, tempSquad, setter ) {
      return (
        <FormHalf $isCompact>
        <OpponentBox>
          <h5 className="m-1">{position === 'opponent' ? 'Opponent' : 'Counter'}</h5>
          <NewSquadDisplay
            hideLocks
            isCompact
            removeCharacter={removeCharacter}
            setTempSquad={setter}
            size={boxType === 'soloBox' ? '1' : size}
            tempSquad={tempSquad}
            type={boxType}
          />
        </OpponentBox>
        <CharacterPool
          addCharacter={addCharacter}
          isCounter={position === 'counter'}
          characters={characters}
          type={boxType}
        />
      </FormHalf>
      );
    }

    if ( searchType === 'counter' ) {
      return <>
        {buildBox( 'opponent', 'opponentBox', tempLeftSquad, setTempLeftSquad )}
        {buildBox( 'counter', 'counterBox', tempRightSquad, setTempRightSquad )}
      </>;
    }

    if ( searchType === 'squad' ) {
      const position = squadPosition === 'defense' ? 'opponent' : 'counter';
      return <>
        { buildBox( position, 'soloSquadBox', tempSoloSquad, setTempSoloSquad ) }
        </>;
    }

    if ( searchType === 'character' ) {
      const position = squadPosition === 'defense' ? 'opponent' : 'counter';
      return <>
        { buildBox( position, 'soloBox', tempSoloCharacter, setTempSoloCharacter ) }
        </>;
    }

    return '';
  }

  function disableSubmitButton() {
    if ( searchType === 'counter' && ( tempLeftSquad[ 0 ].id === 'BLANK' || tempRightSquad[ 0 ].id === 'BLANK' )) { return true; }
    if ( searchType === 'squad' && tempSoloSquad[ 0 ].id === 'BLANK' ) { return true; }
    if ( searchType === 'character' && tempSoloCharacter[ 0 ].id === 'BLANK' ) { return true; }

    return false;
  }

  return (
    <SearchBoxWrapper>
      <Button outline size='sm' id='toggleOptionBox'>Search Options</Button>
      <UncontrolledCollapse toggler='#toggleOptionBox'>
        <SearchOptionsWrapper>
          <div className="d-flex flex-row align-items-center">
            <div className="col-3">Battle Type</div>
            <ButtonGroup>
              <Button
                className="border border-dark"
                color='primary'
                value='5v5'
                active={size === '5v5'}
                onClick={selectSize}>5v5</Button>
              <Button
                className="border border-dark"
                color='primary'
                value='3v3'
                active={size === '3v3'}
                onClick={selectSize}>3v3</Button>
            </ButtonGroup>
          </div>

          <div className="d-flex flex-row align-items-center">
            <div className="col-3">Search Type</div>
            <ButtonGroup>
              <Button
                className="border border-dark"
                color='primary'
                value='counter'
                active={searchType === 'counter'}
                onClick={selectSearchType}>Counter</Button>
              <Button
                className="border border-dark"
                color='primary'
                value='squad'
                active={searchType === 'squad'}
                onClick={selectSearchType}>Squad</Button>
              <Button
                className="border border-dark"
                color='primary'
                value='character'
                active={searchType === 'character'}
                onClick={selectSearchType}>Character</Button>
            </ButtonGroup>
          </div>

          <div className="d-flex flex-row align-items-center">
            <div className="col-3">Squad Position</div>
            <ButtonGroup>
              <Button
                className="border border-dark"
                color='primary'
                value='defense'
                active={squadPosition === 'defense'}
                disabled={searchType === 'counter'}
                onClick={selectSquadPosition}>Defense</Button>
              <Button
                className="border border-dark"
                color='primary'
                value='offense'
                active={squadPosition === 'offense'}
                disabled={searchType === 'counter'}
                onClick={selectSquadPosition}>Offense</Button>
            </ButtonGroup>
          </div>

          <div className="d-flex flex-row align-items-center">
            <div className="col-3">Season to Start from</div>
            <Input type="select" value={selectedSeason} className="col-2" onChange={handleSeasonSelect}>
              { seasonNums.map( x => <option key={`season_${ x }`}>{ x }</option> ) }
            </Input>
          </div>
        </SearchOptionsWrapper>
      </UncontrolledCollapse>

      <Button outline size='sm' id="toggleSearchBox">Squad Selection</Button>
      <UncontrolledCollapse toggler='#toggleSearchBox'>
        <FilterWrapper>
          {determineBoxLayout()}
        </FilterWrapper>
      </UncontrolledCollapse>

      <Button
        disabled={disableSubmitButton()}
        color="primary"
        size="sm"
        onClick={submitSearch}
      >Submit</Button>
    </SearchBoxWrapper>
  );
};

export default SearchBox;
