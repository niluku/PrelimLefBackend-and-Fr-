import React, { useEffect, useState } from 'react';
import { FcDeleteRow, FcDeleteColumn, FcAddRow, FcAddColumn } from "react-icons/fc";
import './MatrixInput.css';
import { MdCopyAll } from "react-icons/md";
import OutlinedInput from '@mui/material/OutlinedInput';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
// import { BsFiletypeJson } from "react-icons/bs";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 3 + ITEM_PADDING_TOP,
      width: 120,
      backgroundColor: '#2D2D2D',
      color: 'white',
    },
  },
};


function MatrixInput({ matrixData, setMatrixData, direction = "vertical", tableData, setupData, LocalData, columns, setColumns, topCell, setTopCell, firstRowSelectValues, setFirstRowSelectValues, setupGif, setSetupGif, toggleSetupGif, setLocalStorage, getLocalStorage }) {
  const [error, setError] = useState([]);
  const [hoveredButton, setHoveredButton] = useState('');

  const [global_net, setGlobalNet] = useState([]);

  const handleMouseHover = (button) => setHoveredButton(button);

  const handleInputChange = (rowIndex, colId, value, isNumeric) => {
    if (isNumeric && !/^\d*\.?\d*$/.test(value)) return;
    const updatedData = matrixData.map((row, i) => {
      const newValue = value;
      return i === rowIndex ? { ...row, [colId]: newValue } : row;
    });
    setMatrixData(updatedData);

    // Log all data after update
    // console.log("Updated Matrix Data:", JSON.stringify(updatedData, null, 2));

    // Update global_net if value includes "none"
    if (value.includes("none")) {
      setGlobalNet([]);
    }
  };


  useEffect(() => {
    let totalValues = []
    for (let i = 0; i < matrixData.length; i++) {
      let valueArray = Object.values(matrixData[i]);
      // console.log(valueArray);
      for (let j = 0; j < valueArray.length; j++) {
        if (valueArray[j].length !== 0) {
          totalValues.push(valueArray[j])
        }
      }
    }
    // console.log(totalValues)
    let repeated = []
    for (let i = 0; i < totalValues.length; i++) {
      for (let j = i + 1; j < totalValues.length; j++) {
        if (totalValues[i] === totalValues[j]) {
          //   setError(totalValues[j])
          // console.log(totalValues[j])
          repeated.push(totalValues[j])
        }
      }
    }
    setError(repeated);
    //console.log(repeated.includes("ab"))
  }, [matrixData])
  //console.log(error)
  // console.log(matrixData)

  const modifyRow = (action) => {
    if (action === 'add') {
      setMatrixData([...matrixData, { layerName: '', dataTypes: '', labelLayer: '', blockageLayer: '', newCol1: [], newCol2: [] }]);
    } else if (action === 'delete' && matrixData.length > 2) {
      setMatrixData(matrixData.slice(0, -1));
    }
  };
  //console.log(matrixData, "55")

  const modifyColumn = (action) => {
    if (action === 'add') {
      const newColumnId = `newColumn${columns.length + 1}`;
      setColumns([...columns, { id: newColumnId }]);
      setMatrixData(matrixData.map(row => ({ ...row, [newColumnId]: [] })));
      setFirstRowSelectValues({ ...firstRowSelectValues, [newColumnId]: [] });

    } else if (action === 'delete' && columns.length > 3) {
      const columnToRemove = columns[columns.length - 1].id;
      const updatedColumns = columns.slice(0, -1);
      setColumns(updatedColumns);
      setMatrixData(matrixData.map(row => {
        const newRow = { ...row };
        delete newRow[columnToRemove];
        return newRow;
      }));
      const { [columnToRemove]: _, ...updatedFirstRowSelectValues } = firstRowSelectValues;
      setFirstRowSelectValues(updatedFirstRowSelectValues);
    }
  };

  const copyToClipboard = () => {
    const header = columns
      .map(col => col.id.charAt(0).toUpperCase() + col.id.slice(1))
      .join('\t');

    const colRow = columns
      .map(colObj => {
        const matchingCol = columns.find(c => c.id === colObj.id);
        return matchingCol ? matchingCol.width : '';
      })
      .join('\t');

    const firstRowData = columns
      .map(colObj => {
        return Array.isArray(firstRowSelectValues[colObj.id]) ? firstRowSelectValues[colObj.id].join(', ') : '';
      });

    // Override the first column of the first row with topCell
    firstRowData[0] = topCell;

    const rows = matrixData
      .map(row => {
        return columns
          .map(colObj => {
            if (Array.isArray(row[colObj.id])) {
              return row[colObj.id].join(', ');
            } else {
              return row[colObj.id] || '';
            }
          })
          .join('\t');
      })
      .join('\n');

    // Join the firstRowData after modifying the first element
    const firstRowString = firstRowData.join('\t');

    // Include the topCell at the beginning of the first row of data
    //const textToCopy = `${header}\n${firstRowString}\n${colRow}\n${rows}`;
    const textToCopy = `${firstRowString}\n${colRow}\n${rows}`;
    navigator.clipboard
      .writeText(textToCopy)
      .then(() => alert('Data copied to clipboard!'))
      .catch(err => console.error('Error copying to clipboard: ', err));
  };

  // const handlePaste = (rowIndex, e) => {
  //   console.log(`Pasting at Row: ${rowIndex}`);
  //   e.preventDefault();

  //   const clipboardData = e.clipboardData.getData('text');
  //   const pastedRows = clipboardData.trim().split('\n').map(row => row.split('\t'));

  //   // Clean pasted data by removing carriage returns
  //   const cleanedRows = pastedRows.map(row => row.map(cell => cell.replace(/\r/g, '')));

  //   // Determine the start column index based on the row and input type
  //   let startColIndex;
  //   if (rowIndex === 1) {
  //     // Row 1: Always alphanumeric input
  //     startColIndex = 2;  // Alphanumeric input starts at column 2
  //   } else {
  //     // Check if we are pasting numeric data or alphanumeric
  //     const isNumeric = pastedRows.every(row => row.every(cell => !isNaN(parseFloat(cell))));
  //     startColIndex = isNumeric ? 1 : 2; // Numeric data -> column 1, Alphanumeric -> column 2
  //   }

  //   // Check if the matrix is empty
  //   const matrixIsEmpty = matrixData.every(row => Object.values(row).every(val => !val));
  //   const numericColumns = [/* List of numeric column indices */];

  //   // Ensure the matrix is large enough to handle the pasted data
  //   const requiredRows = rowIndex + pastedRows.length - 1;
  //   const requiredCols = startColIndex + Math.max(...pastedRows.map(row => row.length)) - 1;

  //   // Resize matrix rows if needed
  //   while (matrixData.length <= requiredRows) {
  //     matrixData.push({});
  //   }

  //   // Resize matrix columns if needed (assuming 'columns' defines the column IDs)
  //   while (columns.length <= requiredCols) {
  //     columns.push({ id: `col${columns.length}`, label: `Column ${columns.length + 1}` });
  //   }

  //   if (matrixIsEmpty) {
  //     // If the matrix is empty, fill it with pasted data starting from column 2
  //     const newMatrixData = pastedRows.map((row, rowIdx) => {
  //       let newRow = {};
  //       row.forEach((cell, cellIdx) => {
  //         // Adjust column index for the paste operation
  //         const targetColIndex = startColIndex + cellIdx;
  //         const colId = columns[targetColIndex] ? columns[targetColIndex].id : null;
  //         if (colId) {
  //           // Check if it's a numeric column and parse the cell data accordingly
  //           newRow[colId] = numericColumns.includes(targetColIndex)
  //             ? (isNaN(parseFloat(cell)) ? "" : parseFloat(cell)) // Handle numeric data
  //             : cell;
  //         }
  //       });
  //       return newRow;
  //     });
  //     setMatrixData(newMatrixData);
  //   } else {
  //     // Handle case when matrix already has data, paste into specific columns starting from column 2
  //     const updatedMatrixData = matrixData.slice();

  //     pastedRows.forEach((row, i) => {
  //       const targetRowIndex = rowIndex - 2 + i; // Adjust target row index accordingly

  //       // Ensure the targetRowIndex exists in the matrix, create it if needed
  //       if (!updatedMatrixData[targetRowIndex]) updatedMatrixData[targetRowIndex] = {};

  //       row.forEach((cell, j) => {
  //         const targetColIndex = startColIndex + j; // Start from dynamic column index
  //         const colId = columns[targetColIndex] ? columns[targetColIndex].id : null;
  //         if (colId) {
  //           // Check if it's a numeric column and parse the cell data accordingly
  //           updatedMatrixData[targetRowIndex][colId] = numericColumns.includes(targetColIndex)
  //             ? (isNaN(parseFloat(cell)) ? "" : parseFloat(cell)) // Handle numeric data
  //             : cell;
  //         }
  //       });
  //     });

  //     // Debugging: Log the updated matrix data
  //     console.log('Updated Matrix Data:', updatedMatrixData);

  //     setMatrixData(updatedMatrixData);
  //   }

  //   console.log(pastedRows, columns);
  // };

  const handlePaste = (rowIndex, e) => {
    //console.log(`Pasting at Row: ${rowIndex}`);
    e.preventDefault();

    const clipboardData = e.clipboardData.getData('text');
    const pastedRows = clipboardData.trim().split('\n').map(row => row.split('\t'));

    // Clean pasted data by removing carriage returns
    const cleanedRows = pastedRows.map(row => row.map(cell => cell.replace(/\r/g, '')));

    let startColIndex;
    if (rowIndex === 1) {
      let col = [...columns];
      for (let i = 0; i < cleanedRows.length; i++) {
        if (i < 1) {
          let width = [...cleanedRows[i]];
          width.unshift(""); width.unshift("");  // Adjust the width as necessary
          for (let j = 0; j < width.length; j++) {
            if (col[j]) {
              col[j].width = width[j];
            } else {
              // If column doesn't exist, add it
              col.push({ id: `col${col.length}`, label: `Column ${col.length + 1}`, width: width[j] });
            }
          }
        }
      }
      setColumns(col);
      pastedRows.shift();  // Remove the first row for data matrix processing
      startColIndex = 1;  // Alphanumeric input starts at column 2
    } else {
      // Determine if the pasted data is numeric or alphanumeric
      const isNumeric = pastedRows.every(row => row.every(cell => !isNaN(parseFloat(cell))));
      startColIndex = isNumeric ? 1 : 2; // Numeric data -> column 1, Alphanumeric -> column 2
    }

    // Check if the matrix is empty (all rows are empty)
    const matrixIsEmpty = matrixData.every(row => Object.values(row).every(val => !val));
    const numericColumns = [/* List of numeric column indices */];

    // Determine the required number of rows and columns
    const requiredRows = rowIndex + pastedRows.length - 1;
    const requiredCols = startColIndex + Math.max(...pastedRows.map(row => row.length)) - 1;

    // Ensure the matrix has enough rows
    while (matrixData.length <= requiredRows) {
      matrixData.push({});
    }

    // Ensure the columns array has enough columns
    while (columns.length <= requiredCols) {
      columns.push({ id: `col${columns.length}`, label: `Column ${columns.length + 1}` });
    }

    if (matrixIsEmpty) {
      // If the matrix is empty, fill it with pasted data starting from column 2
      const newMatrixData = pastedRows.map((row, rowIdx) => {
        let newRow = {};
        row.forEach((cell, cellIdx) => {
          const targetColIndex = startColIndex + cellIdx;
          const colId = columns[targetColIndex] ? columns[targetColIndex].id : null;
          if (colId) {
            newRow[colId] = numericColumns.includes(targetColIndex)
              ? (isNaN(parseFloat(cell)) ? "" : parseFloat(cell))  // Handle numeric data
              : cell;
          }
        });
        return newRow;
      });
      setMatrixData(newMatrixData);
    } else {
      // Handle case when matrix already has data, paste into specific columns starting from column 2
      const updatedMatrixData = matrixData.slice();

      pastedRows.forEach((row, i) => {
        const targetRowIndex = rowIndex - 3 + i; // Adjust target row index accordingly

        // Ensure the target row exists in the matrix, create it if needed
        if (!updatedMatrixData[targetRowIndex]) updatedMatrixData[targetRowIndex] = {};

        row.forEach((cell, j) => {
          const targetColIndex = startColIndex + j; // Start from dynamic column index
          const colId = columns[targetColIndex] ? columns[targetColIndex].id : null;
          if (colId) {
            updatedMatrixData[targetRowIndex][colId] = numericColumns.includes(targetColIndex)
              ? (isNaN(parseFloat(cell)) ? "" : parseFloat(cell)) // Handle numeric data
              : cell;
          }
        });
      });

      setMatrixData(updatedMatrixData);
    }
  };


  const handleExecute = () => {
    const jsonData = {
      setupData,
      matrixData,
      global_net,
    };
    // console.log("Generated JSON:", JSON.stringify(jsonData, null, 2));
    const blob = new Blob([JSON.stringify(jsonData, null, 2)], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'data.json';
    link.click();
  };

  const renderButton = (icon, action, tooltip) => (
    <button
      className='buttonSize'
      onMouseEnter={() => handleMouseHover(action)}
      onMouseLeave={() => handleMouseHover('')}
      onClick={() => {
        if (action.includes('Row')) modifyRow(action === 'Add Row' ? 'add' : 'delete');
        if (action.includes('Column')) modifyColumn(action === 'Add Column' ? 'add' : 'delete');
        if (action === 'copy') copyToClipboard();
        if (action === 'Execute') handleExecute();
      }}
      style={{
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgb(65, 105, 121)',
        color: 'white',
        width: '60px',
        height: '35px',
        borderRadius: '5px',
      }}
    >
      {icon}
      {hoveredButton === action && (
        <span className="hoverText" style={{
          visibility: 'visible',
          backgroundColor: '#ffffff',
          color: '#000000',
          textAlign: 'center',
          padding: '5px',
          position: 'absolute',
          bottom: '-30px',
          left: '50%',
          transform: 'translateX(-50%)',
          opacity: 1,
          transition: 'opacity 0.3s',
          whiteSpace: 'nowrap',
          zIndex: 1,
        }}>
          {tooltip}
        </span>
      )}
    </button>
  );

  //console.log(firstRowSelectValues);
  // console.log(matrixData)
  console.log(columns)
  return (
    <> <div className="table-container" style={{ padding: '0px' }}>
      <div className='mt-10 ml-10' style={{ display: 'flex', marginBottom: '10px' }}>
        {renderButton(<FcAddRow size={25} />, 'Add Row', 'Add Row')}
        {renderButton(<FcDeleteRow size={25} />, 'Delete Row', 'Delete Row')}
        {renderButton(<FcAddColumn size={25} />, 'Add Column', 'Add Column')}
        {renderButton(<FcDeleteColumn size={25} />, 'Delete Column', 'Delete Column')}
        <div style={{ display: 'inline-block', position: 'relative' }}>
          {renderButton(<MdCopyAll size={20} />, 'copy', 'Copy to Clipboard')}
        </div>
      </div>
      <div style={{ overflowX: 'auto', maxWidth: '120%' }}>
        <table border="1" style={{ minWidth: `${columns.length * 120}px` }}>
          <tbody>
            <tr>
              {columns.map((col, colIndex) => (
                <td key={colIndex} style={{ width: col.width }}>
                  {colIndex === 0 ? (
                    <div>
                      <input type="text"
                        //placeholder='Top_Alpha_numeric'
                        style={{ width: '91%', padding: '5px' }}
                        value={topCell}
                        onChange={(e) => setTopCell(e.target.value)}
                        onClick={() => { toggleSetupGif("top") }}
                      // onPaste={(e) => handlePaste(1, e)}
                      />
                    </div>
                  ) : colIndex === 1 ? (
                    <div style={{ width: '110px' }}>

                    </div>
                  ) : (
                    <Select
                      multiple
                      disabled={direction === "horizontal"}
                      id="demo-single-checkbox"
                      value={Array.isArray(firstRowSelectValues[col.id]) ? firstRowSelectValues[col.id] : []}
                      onClick={() => { toggleSetupGif("GlobalHorPinsdroupdown") }}
                      onChange={(e) => {
                        const { value } = e.target;
                        if (value.includes("all")) {
                          const allValues = tableData.map(item => item.globalPins);
                          setFirstRowSelectValues((prev) => ({
                            ...prev,
                            [col.id]: allValues,
                          }));
                          setGlobalNet(allValues);
                        } else if (value.includes("none")) {
                          setFirstRowSelectValues((prev) => ({
                            ...prev,
                            [col.id]: [],
                          }));
                          setGlobalNet([]);
                        } else {
                          const newValue = Array.isArray(value) ? value : [value];
                          setFirstRowSelectValues((prev) => ({
                            ...prev,
                            [col.id]: newValue,
                          }));
                          setGlobalNet(newValue);
                        }
                      }}
                      displayEmpty
                      renderValue={(selected) => {
                        if (!Array.isArray(selected)) {
                          console.warn('Expected an array for selected:', selected);
                          return <span style={{ color: 'white' }}>Invalid Selection</span>;
                        }
                        return selected.length === 0 ? <span style={{ color: 'white' }}>None</span> : selected.join(', ');
                      }}
                      input={<OutlinedInput />}
                      MenuProps={MenuProps}
                      sx={{
                        width: 120,
                        backgroundColor: '#2D2D2D',
                        color: 'white',
                        height: 30,
                        fontSize: '14px',
                        '.MuiOutlinedInput-notchedOutline': {
                          borderColor: '#4A4A4A',
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#949494',
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#949494',
                        },
                        '.MuiSvgIcon-root': {
                          color: 'white',
                        },
                        '.MuiSelect-select': {
                          padding: '6px 12px',
                        },
                      }}
                    >
                      <MenuItem value="all" sx={{ fontSize: '14px' }}>All</MenuItem>
                      <MenuItem value="none" sx={{ fontSize: '14px' }}>None</MenuItem>
                      {[...new Set(tableData
                        .filter(item => item.globalPins.length > 0) // Filter out items with empty globalPins
                        .map(item => item.globalPins)) // Map to get unique globalPins
                      ].map((globalPin, index) => (
                        <MenuItem
                          key={globalPin + index} // Use globalPin as the key
                          value={globalPin}
                          style={{ backgroundColor: '#2D2D2D', color: 'white', fontSize: '14px' }}
                        >
                          <Checkbox
                            checked={Array.isArray(firstRowSelectValues[col.id]) && firstRowSelectValues[col.id]?.includes(globalPin)}
                            sx={{
                              color: 'white',
                              padding: 0,
                              margin: "0 10px 0 0",
                              '&.Mui-checked': {
                                color: '#4A90E2',
                              },
                            }}
                          />
                          <span>{globalPin}</span>
                        </MenuItem>
                      ))}


                    </Select>
                  )}
                </td>
              ))}
            </tr>

            <tr>
              {columns.map((col, colIndex) => (
                <td key={colIndex} style={{ width: col.width }}>
                  {colIndex === 0 ? null : colIndex === 1 ? (
                    <label style={{ display: 'block', marginBottom: '5px', color: 'rgb(94, 156, 179)', textAlign: 'center', fontWeight: 'bold' }}>Width / Height</label>
                  ) : (
                    <input
                      type="text"
                      //placeholder='Numric1'
                      style={{
                        width: '89%',
                        padding: '5px',
                        borderColor: 'rgb(94, 156, 179)',
                        borderWidth: '2px',
                        borderStyle: 'solid',
                        outline: 'none',
                        color: 'rgb(94, 156, 179)',
                        fontWeight: 'bold',
                      }}
                      value={col.width}
                      onClick={() => { toggleSetupGif("WidthNumric") }}
                      onChange={(e) => {
                        const newWidthValue = e.target.value;
                        if (/^\d*\.?\d*$/.test(newWidthValue)) {
                          setColumns(columns.map((currentCol, index) =>
                            index === colIndex ? { ...currentCol, width: newWidthValue } : currentCol
                          ));
                        }
                      }}
                      onPaste={(e) => handlePaste(1, e)} //2 to 1
                    />
                  )}
                </td>
              ))}
            </tr>
            {matrixData.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {columns.map((col, colIndex) => (
                  <td key={col.id} style={{ width: col.width }}>
                    {colIndex === 0 ? (
                      <Select
                        multiple
                        disabled={direction === "vertical"}
                        id="demo-single-checkbox"
                        value={Array.isArray(row[col.id]) ? row[col.id] : []}
                        onClick={() => { toggleSetupGif("GlobalPinsdroupdown") }}
                        onChange={(e) => {
                          const { value } = e.target;

                          if (value.includes("all")) {
                            // Select all items
                            const allValues = tableData.map(item => item.globalPins);
                            handleInputChange(rowIndex, col.id, allValues, false); // Update with all values
                          } else if (value.includes("none")) {
                            // Deselect all items
                            handleInputChange(rowIndex, col.id, [], false); // Update to empty
                          } else {
                            // Handle normal selection
                            const newValue = Array.isArray(value) ? value : [value];
                            handleInputChange(rowIndex, col.id, newValue, false); // Update with new values
                          }
                        }}
                        displayEmpty
                        renderValue={(selected) => {
                          if (!Array.isArray(selected)) {
                            console.warn('Expected an array for selected:', selected);
                            return <span style={{ color: 'white' }}>Invalid Selection</span>;
                          }
                          return selected.length === 0 ? <span style={{ color: 'white' }}>None</span> : selected.join(', ');
                        }}
                        input={<OutlinedInput />}
                        MenuProps={MenuProps}
                        sx={{
                          width: 120,
                          backgroundColor: '#2D2D2D',
                          color: 'white',
                          height: 30,
                          fontSize: '14px',
                          '.MuiOutlinedInput-notchedOutline': {
                            borderColor: '#4A4A4A',
                          },
                          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#949494',
                          },
                          '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#949494',
                          },
                          '.MuiSvgIcon-root': {
                            color: 'white',
                          },
                          '.MuiSelect-select': {
                            padding: '6px 12px',
                          },
                        }}
                      >
                        <MenuItem value="all" sx={{ fontSize: '14px' }}>All</MenuItem>
                        <MenuItem value="none" sx={{ fontSize: '14px' }}>None</MenuItem>
                        {Array.from(new Set(tableData.map(item => item.globalPins))) // Create a Set to filter duplicates
                          .filter(globalPin => globalPin) // Ensure no empty values
                          .map((globalPin, index) => (
                            <MenuItem
                              key={globalPin + index}
                              value={globalPin}
                              style={{ backgroundColor: '#2D2D2D', color: 'white', fontSize: '14px' }}
                            >
                              <Checkbox
                                checked={Array.isArray(row[col.id]) && row[col.id]?.includes(globalPin)}
                                onChange={(e) => {
                                  const currentValue = Array.isArray(row[col.id]) ? row[col.id] : [];
                                  const newValue = e.target.checked
                                    ? [...currentValue, globalPin]
                                    : currentValue.filter((val) => val !== globalPin);

                                  handleInputChange(rowIndex, col.id, newValue, false);
                                }}
                                sx={{
                                  color: 'white',
                                  padding: 0,
                                  margin: "0 10px 0 0",
                                  '&.Mui-checked': {
                                    color: '#4A90E2',
                                  },
                                }}
                              />
                              <span>{globalPin}</span>
                            </MenuItem>
                          ))}
                      </Select>

                    ) : colIndex === 1 ? (
                      <input
                        type="text"
                        //placeholder='Numric'
                        value={row[col.id] || ''}
                        onChange={(e) => handleInputChange(rowIndex, col.id, e.target.value, true)}
                        onPaste={(e) => handlePaste(3, e)}
                        onClick={() => { toggleSetupGif("HightNumric") }}
                        style={{
                          width: '89%',
                          padding: '5px',
                          borderColor: 'rgb(94, 156, 179)',
                          borderWidth: '2px',
                          borderStyle: 'solid',
                          outline: 'none',
                          color: 'rgb(94, 156, 179)',
                          fontWeight: 'bold',
                        }}
                      />
                    ) :
                      (
                        <input
                          type="text"
                          value={row[col.id] || ""}
                          onChange={(e) => {
                            const newValue = e.target.value.replace(/\s+/g, ''); // Remove spaces
                            handleInputChange(rowIndex, col.id, newValue, false);
                          }}
                          onPaste={(e) => handlePaste(3, e)}
                          onClick={() => { toggleSetupGif("MatrixAlphanumric") }}
                          style={{
                            width: '91%',
                            padding: '5px',
                            border: error.includes(row[col.id]) ? '1px solid red' : '1px solid #ccc', // Default border
                          }}
                        />

                      )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

      </div>

    </div>
      <div className='setupMain' style={{ display: 'flex', marginTop: '5px' }}>
        <button
          onClick={() => { setLocalStorage() }}
          style={{
            position: 'relative',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgb(65, 105, 121)',
            color: 'white',
            height: '35px',
            borderRadius: '5px',
            marginRight: '10px'
          }}
        >
          Save as Templates
        </button>
        <button
          onClick={() => { getLocalStorage() }}
          style={{
            position: 'relative',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgb(65, 105, 121)',
            color: 'white',
            height: '35px',
            borderRadius: '5px',
            marginRight: '10px'
          }}
        >
          Get Templates
        </button>
      </div></>
  );
}


export default MatrixInput;
