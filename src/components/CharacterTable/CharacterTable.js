/* eslint-disable no-nested-ternary */
import React, { useState, useEffect } from 'react';
import {
  Table,
  Form, FormGroup, Input,
} from 'reactstrap';
import {
  useTable,
  useSortBy,
} from 'react-table';


import './CharacterTable.scss';

// TODO: Add proptypes
// TODO: Add tests
export default function CharacterTable(props) {
  const [characters, setCharacters] = useState([]);
  const [filteredCharacters, setFilteredCharacters] = useState([]);

  let searchInput = '';

  useEffect(() => {
    if (props.userUnits) {
      const unflattenedCharacters = props.userUnits;
      setCharacters(unflattenedCharacters);
      setFilteredCharacters(unflattenedCharacters);
    }
  }, [props.userUnits]);

  const columns = React.useMemo(
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

  const handleSearch = (e) => {
    searchInput = e.target.value;
    const filteredResults = characters.filter(value => (
      value.categories.join().toLowerCase().includes(searchInput.toLowerCase())
      || value.name.toLowerCase().includes(searchInput.toLowerCase())
    ));
    if (filteredResults === []) {
      setFilteredCharacters(characters);
    } else {
      setFilteredCharacters(filteredResults);
    }
  };

  const searchBar = (
    <Form className="align-self-end w-25">
      <FormGroup>
        <Input
          type="text"
          name="search"
          id="characterSearchBar"
          placeholder="search"
          onChange={handleSearch}
        />
      </FormGroup>
    </Form>
  );

  const selectDynamicCellClassName = (cell) => {
    switch (cell.column.Header) {
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

  const pickColumnSize = (column) => {
    switch (column.Header) {
      case 'Name':
        return 'nameColumn';
      default: return 'dataColumn';
    }
  };

  const mainTable = (
    <Table hover dark size="sm" responsive className="mainTable"{...getTableProps()}>
      <thead>
        {headerGroups.map(headerGroup => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map(column => (
              // adds sorting props
              <th
                {...column.getHeaderProps(column.getSortByToggleProps())}
                {...column.getHeaderProps({ className: pickColumnSize(column) })}
              >
                {column.render('Header')}
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
        {rows.map((row) => {
          prepareRow(row);
          return (
            <tr {...row.getRowProps()}>
              {row.cells.map(cell => <td {...cell.getCellProps(
                { className: selectDynamicCellClassName(cell) },
              )}>{cell.render('Cell')}</td>)}
            </tr>
          );
        })}
      </tbody>
    </Table>
  );

  return (
    <div className="CharacterTable">
      {searchBar}
      {props.userUnits ? mainTable : ''}
    </div>
  );
}
