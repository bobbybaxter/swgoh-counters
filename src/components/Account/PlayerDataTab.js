/* eslint-disable no-nested-ternary */
import React, {
  memo, useEffect, useMemo, useState,
} from 'react';
import {
  TabContent,
  Table,
  TabPane,
} from 'reactstrap';
import { useSortBy, useTable } from 'react-table';
import { flatten, mergeCharacterAndPlayerData } from 'src/helpers';
import { getPlayerDataFromSwgoh } from 'src/helpers/data';
import styled from 'styled-components';

const CharacterTable = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  text-align: center;
`;

const defaultCharacters = JSON.parse( sessionStorage.getItem( 'characters' )) || [];

const PlayerDataTab = ( { activeTab } ) => {
  const [ characters, setCharacters ] = useState( [] );
  const [ filteredCharacters, setFilteredCharacters ] = useState( [] );

  useEffect(() => {
    const abortController = new AbortController();
    const opts = { signal: abortController.signal };

    function fixRelicTierLevels( res ) {
      return res.units.map( char => {
        const flatChar = flatten( char );
        switch ( flatChar.relic_tier ) {
          case 1:
            flatChar.relic_tier = 0;
            break;
          case 2:
            flatChar.relic_tier = 1;
            break;
          default:
            flatChar.relic_tier -= 2;
        }
        return flatChar;
      } );
    }

    function transformPlayerData( res ) {
      const charsFixedRelics = fixRelicTierLevels( res ).filter( char => char.combat_type !== 2 );
      return mergeCharacterAndPlayerData( defaultCharacters, charsFixedRelics );
    }

    async function getPlayerInfo() {
      try {
        const response = await getPlayerDataFromSwgoh( '492912899', opts );
        const res = JSON.parse( response.contents );
        const transformedPlayerData = transformPlayerData( res );
        setCharacters( transformedPlayerData );
        setFilteredCharacters( transformedPlayerData );
      } catch ( err ) {
        if ( !abortController.signal.aborted ) {
          console.error( 'getPlayerData aborted', err );
        }
      }
    }

    getPlayerInfo();
    return () => {
      abortController.abort();
    };
  }, [] );

  const columns = useMemo(
    () => [
      // accessor is the "key" in the data
      { Header: 'Name', accessor: 'name' },
      { Header: 'Power', accessor: 'power' },
      { Header: 'Rarity', accessor: 'rarity' },
      { Header: 'Level', accessor: 'level' },
      { Header: 'Gear', accessor: 'gear_level' },
      { Header: 'Relic', accessor: 'relic_tier' },
    ],
    [],
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable(
    {
      columns,
      data: filteredCharacters,
    },
    useSortBy,
  );

  const selectDynamicCellClassName = cell => {
    switch ( cell.column.Header ) {
      case 'Power':
        return 'cellFinished';
      case 'Rarity':
        return cell.value === 7 ? 'cellFinished' : 'cellUnfinished';
      case 'Level':
        return cell.value === 85 ? 'cellFinished' : 'cellUnfinished';
      case 'Gear':
        return cell.value === 13 ? 'cellFinished' : 'cellUnfinished';
      case 'Relic':
        return cell.value === 7 ? 'cellFinished' : 'cellUnfinished';
      default: return '';
    }
  };

  const pickColumnSize = column => {
    switch ( column.Header ) {
      case 'Name':
        return 'nameColumn';
      default: return 'dataColumn';
    }
  };

  const mainTable = (
    <Table hover dark size="sm" responsive className="mainTable"{...getTableProps()}>
      <thead>
        {headerGroups.map( headerGroup => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map( column => (
              // adds sorting props
              <th
                {...column.getHeaderProps( column.getSortByToggleProps())}
                {...column.getHeaderProps( { className: pickColumnSize( column ) } )}
              >
                {column.render( 'Header' )}
                {/* adds sort direction indicator */}
                <span>
                  {column.isSorted
                    ? column.isSortedDesc
                      ? ' 🔽'
                      : ' 🔼'
                    : ''}
                </span>
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map( row => {
          prepareRow( row );
          return (
            <tr {...row.getRowProps()}>
              {row.cells.map( cell => <td {...cell.getCellProps(
                { className: selectDynamicCellClassName( cell ) },
              )}>{cell.render( 'Cell' )}</td> )}
            </tr>
          );
        } )}
      </tbody>
    </Table>
  );

  return (
    <TabContent activeTab={activeTab}>
      <TabPane tabId="4">
        <div className="d-flex flex-row m-3 p-3">
          <CharacterTable>
            {/* {searchBar} */}
            {characters ? mainTable : ''}
          </CharacterTable>
        </div>
      </TabPane>
    </TabContent>
  );
};

export default memo( PlayerDataTab );
