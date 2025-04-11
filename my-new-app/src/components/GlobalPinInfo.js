import React, { useState } from 'react';
import { useTable } from 'react-table';
import './GlobalPinInfo.css';
import { FaPlus, FaMinus } from 'react-icons/fa';

const GlobalPinInfo = () => {
  const [data, setData] = useState([
    { globalPins: 'Vdd', Width: 4, selfSpacing: 0.3, spaceToNext: 0.1, Repetitions: 2, Clubbing: 2 },
    { globalPins: 'Vss', Width: 5, selfSpacing: 0.4, spaceToNext: 0.5, Repetitions: 2, Clubbing: 1 },
    { globalPins: 'Vddp', Width: 6, selfSpacing: 1.2, spaceToNext: 10, Repetitions: 10, Clubbing: 4 },
  ]);


  const [columns, setColumns] = useState([
    {
      Header: 'GlobalPins',
      accessor: 'globalPins',
      Cell: ({ value, row, column }) => (
        <input
          type="text"
          value={value}
          onChange={(e) => handleInputChange(e, row.index, column.id)}
          className="input-cell"
        />
      ),

    },
    {
      Header: 'Width',
      accessor: 'Width',
      Cell: ({ value, row, column }) => (
        <input
          type="number"
          value={value}
          onChange={(e) => handleInputChange(e, row.index, column.id)}
          className="input-cell"
        />
      ),
    },
    {
      Header: 'SelfSpacing',
      accessor: 'selfSpacing',
      Cell: ({ value, row, column }) => (
        <input
          type="number"
          value={value}
          onChange={(e) => handleInputChange(e, row.index, column.id)}
          className="input-cell"
        />
      ),
    },
    {
      Header: 'SpaceToNext',
      accessor: 'spaceToNext',
      Cell: ({ value, row, column }) => (
        <input
          type="number"
          value={value}
          onChange={(e) => handleInputChange(e, row.index, column.id)}
          className="input-cell"
        />
      ),
    },
    {
      Header: 'Repetitions',
      accessor: 'Repetitions',
      Cell: ({ value, row, column }) => (
        <input
          type="number"
          value={value}
          onChange={(e) => handleInputChange(e, row.index, column.id)}
          className="input-cell"
        />
      ),
    },
    {
      Header: 'Clubbing',
      accessor: 'Clubbing',
      Cell: ({ value, row, column }) => (
        <input
          type="number"
          value={value}
          onChange={(e) => handleInputChange(e, row.index, column.id)}
          className="input-cell"
        />
      ),
    },
  ]);

  const handleInputChange = (e, rowIndex, columnId) => {
    const newData = [...data];
    newData[rowIndex][columnId] = e.target.value;
    setData(newData);
  };

  const addRow = () => {
    const newRow = {};
    columns.forEach((col) => {
      newRow[col.accessor] = col.accessor === 'globalPins' ? '' : 0; // Default values
    });
    setData([...data, newRow]);
  };

  const deleteRow = () => {
    if (data.length > 0) {
      const newData = [...data];
      newData.pop();
      setData(newData);
    }
  };

  const addColumn = () => {
    const newColId = `col${columns.length + 1}`;
    setColumns([
      ...columns,
      {
        Header: `New Column ${columns.length + 1}`,
        accessor: newColId,
        Cell: ({ value, row, column }) => (
          <input
            type="text"
            value={value}
            onChange={(e) => handleInputChange(e, row.index, column.id)}
            className="input-cell"
          />
        ),
      },
    ]);

    const updatedData = data.map(row => ({ ...row, [newColId]: '' }));
    setData(updatedData);
  };

  const deleteColumn = () => {
    if (columns.length > 1) { // Ensure at least one column remains
      const newColumns = [...columns];
      const lastColumnId = newColumns[newColumns.length - 1].accessor;
      newColumns.pop();
      setColumns(newColumns);

      const updatedData = data.map(row => {
        const newRow = { ...row };
        delete newRow[lastColumnId];
        return newRow;
      });
      setData(updatedData);
    }
  };

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({ columns, data });

  return (
    <div className="container">
      <div className="button-container">
        <button onClick={addRow}>ADD ROW
          {/* <FaPlus size={10} /> */}
        </button>
        <button onClick={deleteRow}>DELETE ROW
          {/* <FaMinus size={10} /> */}
        </button>
        {/* <button onClick={addColumn}>ADD COLUMN</button>
        <button onClick={deleteColumn}>DELETE LAST COLUMN</button> */}
      </div>

      <table
        {...getTableProps()}
        className="global-pin-table"
        style={{ color: 'white', backgroundColor: 'rgb(36, 37, 43)' }}
      >
        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <th
                  {...column.getHeaderProps()}
                  style={{ backgroundColor: 'rgb(36, 37, 43)', color: 'white' }}
                >
                  {column.render('Header')}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map(row => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map(cell => (
                  <td
                    {...cell.getCellProps()}
                    style={{ backgroundColor: 'rgb(36, 37, 43)', color: 'white' }}
                  >
                    {cell.render('Cell')}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default GlobalPinInfo;
