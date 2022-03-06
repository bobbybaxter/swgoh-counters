import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  Input,
  Table,
} from 'reactstrap';
import { usePagination, useSortBy, useTable } from 'react-table';
import styled from 'styled-components';
import { colors } from 'src/styles/colors';
import { getImage } from 'src/helpers';
import ToonImg from 'src/components/shared/ToonImg';

const CharacterTable = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  text-align: center;
  margin-top: 1rem;
  font-size: .6rem;

  .table, .table td {
    background-color: transparent;
    vertical-align: middle;
    padding-left: 0;
    padding-right: 0;
  }

  .table th {
    font-weight: 400;
  }

  .table thead {
    background-color: #9B47E433;
    box-shadow: inset 4px 4px 15px rgba(255, 255, 255, 0.1), inset -4px -4px 15px rgba(255, 255, 255, 0.1);
  }

  @media only screen and (min-width:768px) {
    font-size: .8rem;
  }

  @media only screen and (min-width:992px) {
    font-size: .9rem;
  }

  @media only screen and (min-width:1200px) {
    font-size: 1rem;
  }

`;

const PaginationMenu = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

// TODO: also in ModalVariations - add to shared
export const CharCard = styled.div`
  display: flex;
  flex-direction: column;
`;

// TODO: also in ModalVariations - add to shared
export const NewSquadChar = styled.div`
  display: flex;
  flex-direction: column;
  width: 23px;
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

export const VariationSquad = styled.div`
  display: flex;
  flex-direciton: row;
  width: 100%;
  justify-content: center;
  align-items: center;
`;

function buildSquadImages( id, size, squad, counterType ) {
  return squad && squad.map(( toon, i ) => ( i < size.charAt( 0 )
    && <CharCard key={`Variation_${ id }_${ toon.name }_${ i }`}>
      <NewSquadChar>
        <ToonImg
          isSearchResult
          src={ getImage( toon.id ) }
          title={toon.name}
          alt={toon.name}
          color={ counterType && ( counterType === 'hard' ? colors.hardCounter : colors.softCounter ) }
        />
      </NewSquadChar>
    </CharCard> ));
}

function determineCounterType( avg ) {
  if ( avg >= 0.90 ) { return 'hard'; }
  if ( avg >= 0.75 && avg < 0.90 ) { return 'soft'; }
  return 'avoid';
}

const SearchResults = ( { searchResults, size } ) => {
  SearchResults.propTypes = {
    searchResults: PropTypes.array.isRequired,
    size: PropTypes.string.isRequired,
  };

  const columns = useMemo(
    () => [
      // accessor is the "key" from the data
      {
        Header: 'Battles',
        accessor: 'totalSeen',
        Cell: props => <div>{props.row.original.totalSeen.toLocaleString()}</div>,
      },
      {
        Header: 'Avg Win %',
        accessor: 'avgWin',
        Cell: props => <div>{`${ Math.round( props.row.original.avgWin * 100 ) }%`}</div>,
        sortType: 'basic',
      },
      { Header: 'Avg 🚩', accessor: 'avgBanners' },
      {
        Header: 'Opponent Squad',
        accessor: 'opponentSquad',
        Cell: props => {
          const { id } = props.row.original;
          const { opponentSquad } = props.row.original;
          const counterType = '';
          return (
            <VariationSquad left>
              {buildSquadImages( id, size, opponentSquad, counterType )}
            </VariationSquad>
          );
        },
      },
      {
        Header: 'Counter Squad',
        accessor: 'counterSquad',
        Cell: props => {
          const { id } = props.row.original;
          const { counterSquad } = props.row.original;
          const counterType = determineCounterType( props.row.original.avgWin );
          return (
            <VariationSquad right>
              {buildSquadImages( id, size, counterSquad, counterType )}
            </VariationSquad>
          );
        },
      },
    ],
    [ size ],
  );

  const {
    canNextPage,
    canPreviousPage,
    getTableProps,
    getTableBodyProps,
    gotoPage,
    headerGroups,
    nextPage,
    page,
    pageCount,
    pageOptions,
    prepareRow,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data: searchResults,
      initialState: {
        pageSize: 10,
      },
    },
    useSortBy,
    usePagination,
  );

  function selectDynamicRowClassName( row ) {
    const { avgWin } = row.original;
    if ( avgWin >= 0.90 ) { return `${ colors.hardCounter }20`; }
    if ( avgWin >= 0.75 && avgWin < 0.90 ) { return `${ colors.softCounter }20`; }
    return 'transparent';
  }

  const mainTable = (
    <Table hover dark size="sm" responsive className="mainTable"{...getTableProps()}>
      <thead>
        {headerGroups.map( headerGroup => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map( column => (
              // adds sorting props
              <th
                {...column.getHeaderProps( column.getSortByToggleProps())}
              >
                {column.render( 'Header' )}
                {/* adds sort direction indicator */}
                <span>
                  {column.isSorted // eslint-disable-line no-nested-ternary
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
        {page.map( row => {
          prepareRow( row );
          return (
            <tr {...row.getRowProps(
              { style: { backgroundColor: selectDynamicRowClassName( row ) } },
            )}>
              {
                row.cells.map( cell => (
                  <td {...cell.getCellProps()}>
                    {cell.render( 'Cell' )}
                  </td>
                ))
              }
            </tr>
          );
        } )}
      </tbody>
    </Table>
  );

  const pagination = <PaginationMenu>
    <PaginationMenu className="mr-3">
      <Button size="sm" color="primary" className={'border border-dark'} onClick={() => gotoPage( 0 )} disabled={!canPreviousPage}>
        {'<<'}
      </Button>
      <Button size="sm" color="primary" className={'border border-dark'} onClick={() => previousPage()} disabled={!canPreviousPage}>
        {'<'}
      </Button>
      <Button size="sm" color="primary" className={'border border-dark'} onClick={() => nextPage()} disabled={!canNextPage}>
        {'>'}
      </Button>
      <Button size="sm" color="primary" className={'border border-dark'} onClick={() => gotoPage( pageCount - 1 )} disabled={!canNextPage}>
        {'>>'}
      </Button>
    </PaginationMenu>

    <PaginationMenu className='mr-3'>
      {`Page ${ pageIndex + 1 }/${ pageOptions.length }`}
    </PaginationMenu>

    <PaginationMenu className='mr-3'>・</PaginationMenu>

    <PaginationMenu className='d-flex flex-row mr-3'>
      <div className="mr-3">Go to page:</div>
      <Input
        bsSize="sm"
        type="number"
        defaultValue={pageIndex + 1}
        onChange={e => {
          const pageToGoTo = e.target.value ? Number( e.target.value ) - 1 : 0;
          gotoPage( pageToGoTo );
        }}
        style={{
          width: '100px',
        }}
      />
    </PaginationMenu>

    <PaginationMenu className='mr-1'>
      <Input
        bsSize="sm"
        type="select"
        value={pageSize}
        onChange={e => {
          setPageSize( Number( e.target.value ));
        }}
      >
        {[ 10, 25, 50, 100 ].map( pSize => (
          <option key={pSize} value={pSize}>
            Show {pSize}
          </option>
        ))}
      </Input>
    </PaginationMenu>
  </PaginationMenu>;

  return (
    <CharacterTable>
      {searchResults.length > 0 ? mainTable : 'No Results'}
      {pagination}
    </CharacterTable>
  );
};

export default SearchResults;
