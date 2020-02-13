import React, { useEffect } from 'react';
import { Table } from 'reactstrap';
import {
  useSortBy,
  useTable,
} from 'react-table';

import './ProfileBody.scss';

function RosterTable({ columns, data }) {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({
    columns,
    data,
  },
  useSortBy);

  return (
    <Table dark hover size="sm" responsive {...getTableProps()}>
    <thead>
      {headerGroups.map(headerGroup => (
        <tr {...headerGroup.getHeaderGroupProps()}>
          {headerGroup.headers.map(column => (
            // adds sorting props
            <th {...column.getHeaderProps(column.getSortByToggleProps())}>
            {column.render('Header')}
            {/* adds sort direction indicator */}
            <span>
              {/* eslint-disable-next-line no-nested-ternary */}
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
      {rows.map(
        (row, i) => {
          prepareRow(row);
          return (
            <tr {...row.getRowProps()}>
              {row.cells.map(cell => <td {...cell.getCellProps()}>{cell.render('Cell')}</td>)}
            </tr>
          );
        },
      )}
    </tbody>
  </Table>
  );
}

function ProfileBody(props) {
  const userData = props.userInfo.data;
  const playerData = props.userInfo.units
    .filter(x => x.combat_type !== 2)
    .sort((a, b) => (a.name > b.name ? 1 : -1));
  const columns = React.useMemo(
    () => [
      {
        Header: 'Characters',
        columns: [
          {
            Header: 'Name',
            accessor: 'name',
          },
          {
            Header: 'Power',
            accessor: 'power',
          },
          {
            Header: 'Level',
            accessor: 'level',
          },
          {
            Header: 'Gear',
            accessor: 'gear_level',
          },
          {
            Header: 'Stars',
            accessor: 'rarity',
          },
          {
            Header: 'Relic',
            accessor: 'relic_tier',
          },
        ],
      },
    ],
    [],
  );
  const printRosterTable = playerData ? <RosterTable columns={columns} data={playerData}> /></RosterTable> : '';

  useEffect(() => {
    let mounted = true;
    return () => { mounted = false; };
  }, [props.userInfo]);

  return (
      <div className="ProfileBody mx-2">
        <div className="pbHead">
          <div className="align-items-center">
            <h6><strong className="text-secondary">Galactic Power: </strong>{userData.galactic_power.toLocaleString()}</h6>
            <h6><strong className="text-secondary">Guild: </strong>{userData.guild_name}</h6>
          </div>
        </div>
        <div>
          { printRosterTable }
        </div>
      </div>
  );
}

export default ProfileBody;
