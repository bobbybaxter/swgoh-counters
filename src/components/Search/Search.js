import React, {
  useContext, useState,
} from 'react';
import styled from 'styled-components';

import {
  MetaTags, PatreonButton,
} from 'src/components/shared';

import { ContainerColumn } from 'src/styles/style';
import { AuthContext } from 'src/contexts/userContext';
import SearchBox from './SearchBox';
import SearchResults from './SearchResults';

const SearchWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 95%;
`;

export default function Search( {
  characters,
} ) {
  const [ loading, setLoading ] = useState( false );
  const [ searchResults, setSearchResults ] = useState( [] );
  const [ size, setSize ] = useState( '5v5' );
  const {
    isGuildTierMember,
    user,
  } = useContext( AuthContext );

  function handleLoading() {
    setLoading( true );
  }

  function handleSearchResults( results ) {
    setSearchResults( results );
    setLoading( false );
  }

  function handleSquadSize( squadSize ) {
    setSize( squadSize );
  }

  const {
    tier,
  } = user;

  const searchComponent = (
    <ContainerColumn className="Search">
      <MetaTags>
        <title>Search</title>
        <meta name="description" content="Search for SWGOH Counters"/>
        <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </MetaTags>
      <SearchWrapper>
        <h3>Counters Search</h3>
        <SearchBox
          characters={characters}
          handleLoading={handleLoading}
          handleSearchResults={handleSearchResults}
          handleSquadSize={handleSquadSize}
        />
      </SearchWrapper>
      <SearchWrapper>
        {
          !loading
            ? <SearchResults
                searchResults={searchResults}
                size={size}
              />
            : <ContainerColumn className="m-3">Loading...</ContainerColumn>
        }
      </SearchWrapper>
    </ContainerColumn>
  );

  return (
    <>
      {
        ( isGuildTierMember || ( tier === 'Aurodium' || tier === 'Chromium' || tier === 'Bronzium' ))
          ? searchComponent
          : <ContainerColumn className="m-3">
              <ContainerColumn>
                <div>
                  Are you looking for a counter that isn't listed?
                </div>

                <div>
                  Do you want more powerful counter data?
                </div>

                <div className={'mb-3'}>
                  About to try an experimental counter and want to see if others have used it?
                </div>

                <h3>
                  Become a Bronzium-Tier Patron today!
                </h3>

                <PatreonButton />

                <div>
                  Search by Counters, Squads, or Individual Characters!
                </div>

                <div>
                  Search across multiple Grand Arena Championships seasons!
                </div>

                <div>
                  See the
                    <em>number of battles seen</em>,
                    <em>average win percentage</em>, and
                    <em>average banners</em> for each counter!
                </div>
              </ContainerColumn>
          </ContainerColumn>
      }
    </>
  );
}
