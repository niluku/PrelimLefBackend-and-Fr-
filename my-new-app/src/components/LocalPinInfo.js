import React, { useState } from 'react';
import { FaTrash } from 'react-icons/fa';
import { MdCopyAll } from "react-icons/md";
import { FcDeleteRow, FcAddRow } from "react-icons/fc";

const Resizer = ({ onMouseDown }) => (
  <div
    onMouseDown={onMouseDown}
    style={{
      cursor: 'col-resize',
      position: 'absolute',
      right: 0,
      top: 0,
      height: '100%',
      width: '5px',
      zIndex: 1,
    }}
  />
);

function LocalPinInfo({ data, setData, matrixData, setupGif, setSetupGif, toggleSetupGif }) {
  const [columns, setColumns] = useState([
    { id: 'cellName', width: 100 },
    { id: 'signalNames', width: 82 },
    { id: 'Repetition', width: 60 },
  ]);

  const [selectedCellNames, setSelectedCellNames] = useState(data.map((item, index) => (item.cellName)));
  const [hoveredButton, setHoveredButton] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // console.log(data, selectedCellNames);

  const handleMouseEnter = (button) => {
    setHoveredButton(button);
  };

  const handleMouseLeave = () => {
    setHoveredButton('');
  };

  const validateInput = (column, value) => {
    let isValid = true;
    let expectedType = '';

    if (column === 'signalNames') {
      isValid = /^[a-zA-Z0-9 ]+$/.test(value);
      expectedType = 'Alphanumeric (letters, numbers, and spaces)';
    } else if (column === 'Repetition') {
      isValid = /^\d*$/.test(value);
      expectedType = 'Integer (whole number)';
    }

    return { isValid, expectedType };
  };

  const handleInputChange = (rowIndex, column, value) => {
    const { isValid, expectedType } = validateInput(column, value);

    if (column === 'cellName') {
      const updatedData = data.map((row, i) => {
        if (i === rowIndex) {
          return { ...row, [column]: value };
        }
        return row;
      });
      setData(updatedData);
      setErrorMessage('');
      //setSuccessMessage('Valid input!');
    } else if (isValid || value === '') {
      setErrorMessage('');
      //setSuccessMessage('Valid input!');
      const updatedData = data.map((row, i) => {
        if (i === rowIndex) {
          return { ...row, [column]: value };
        }
        return row;
      });
      setData(updatedData);
    } else {
      setSuccessMessage('');
      //setErrorMessage(`Invalid input for ${column}. Expected: ${expectedType}.`);
    }
  };

  const handlePaste = (e, rowIndex) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text');
    const rows = text.split('\n');

    const newRows = rows.map(row => {
      const values = row.split('\t');
      return columns.reduce((acc, column, index) => {
        acc[column.id] = values[index] || '';
        return acc;
      }, {});
    });

    const updatedData = [
      ...data.slice(0, rowIndex),
      ...newRows,
      ...data.slice(rowIndex)
    ];

    setData(updatedData);
  };

  const addRow = () => {
    const newRow = columns.reduce((acc, column) => ({ ...acc, [column.id]: '' }), {});
    setData([...data, newRow]);
    setSelectedCellNames([...selectedCellNames, '']); // Maintain dropdown state
  };

  const deleteRow = (rowIndex) => {
    if (rowIndex === 0) {
      // Prevent deletion of the first row
      return;
    }
    const updatedData = data.filter((_, i) => i !== rowIndex);
    setData(updatedData);
    const updatedCellNames = selectedCellNames.filter((_, i) => i !== rowIndex);
    setSelectedCellNames(updatedCellNames);
  };


  const handleMouseDown = (index, e) => {
    e.preventDefault();
    const startX = e.clientX;
    const startWidth = columns[index].width;

    const handleMouseMove = (e) => {
      const newWidth = Math.max(50, startWidth + (e.clientX - startX));
      const updatedColumns = [...columns];
      updatedColumns[index].width = newWidth;
      setColumns(updatedColumns);
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const copyToClipboard = () => {
    const header = columns.map(col => col.id.charAt(0).toUpperCase() + col.id.slice(1)).join('\t');
    const rows = data.map(row => columns.map(col => row[col.id]).join('\t')).join('\n');
    const clipboardContent = `${header}\n${rows}`;

    navigator.clipboard.writeText(clipboardContent)
      .then(() => {
        setSuccessMessage('Data copied to clipboard!');
        setErrorMessage('');
      })
      .catch(err => {
        setErrorMessage('Failed to Copy to clipboard.');
        console.error('Error copying to clipboard: ', err);
      });
  };

  const handleCellNameChange = (rowIndex, value) => {
    const updatedCellNames = [...selectedCellNames];
    updatedCellNames[rowIndex] = value;
    setSelectedCellNames(updatedCellNames);
    handleInputChange(rowIndex, 'cellName', value);
  };

  const getAvailableOptions = () => {
    let valuesArray = [];
    const excludeFields = ["layerName", "dataTypes"];
    matrixData.forEach(obj => {
      for (let key in obj) {
        if (obj.hasOwnProperty(key) && !excludeFields.includes(key)) {
          if (obj[key] !== null && obj[key] !== undefined && obj[key] !== "") {
            valuesArray.push(obj[key]);
          }
        }
      }
    });
    return valuesArray
  };
  // console.log(getAvailableOptions())

  return (
    <div className="table-container">
      <div className='ml-10 mt-10' style={{ display: 'flex', marginBottom: '10px' }}>
        <div style={{ display: 'inline-block', marginRight: '10px', position: 'relative' }}>
          <button
            onMouseEnter={() => handleMouseEnter('addRow')}
            onMouseLeave={handleMouseLeave}
            onClick={addRow}
            style={{
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
            <FcAddRow size={25} />
          </button>
          {hoveredButton === 'addRow' && (
            <span style={{
              position: 'absolute',
              top: '40px',
              left: '50%',
              transform: 'translateX(-50%)',
              backgroundColor: '#fff',
              color: '#000',
              padding: '5px',
              boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)',
              whiteSpace: 'nowrap',
              zIndex: 1,
              fontSize: '12px'
            }}>
              Add Row
            </span>
          )}
        </div>
        <div style={{ display: 'inline-block', position: 'relative', marginRight: '10px' }}>
          <button
            onMouseEnter={() => handleMouseEnter('deleteRow')}
            onMouseLeave={handleMouseLeave}
            onClick={() => deleteRow(data.length - 1)}
            disabled={data.length === 0}
            style={{
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
            <FcDeleteRow size={25} />
          </button>
          {hoveredButton === 'deleteRow' && (
            <span style={{
              position: 'absolute',
              top: '40px',
              left: '50%',
              transform: 'translateX(-50%)',
              backgroundColor: '#fff',
              color: '#000',
              padding: '5px',
              boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)',
              whiteSpace: 'nowrap',
              zIndex: 1,
              fontSize: '12px'
            }}>
              Delete Row
            </span>
          )}
        </div>
        <div style={{ display: 'inline-block', position: 'relative' }}>
          <button
            onMouseEnter={() => handleMouseEnter('copyData')}
            onMouseLeave={handleMouseLeave}
            onClick={copyToClipboard}
            style={{
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
            <MdCopyAll size={20} />
          </button>
          {hoveredButton === 'copyData' && (
            <span style={{
              position: 'absolute',
              top: '40px',
              left: '50%',
              transform: 'translateX(-50%)',
              backgroundColor: '#fff',
              color: '#000',
              padding: '5px',
              boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)',
              whiteSpace: 'nowrap',
              zIndex: 1,
              fontSize: '12px'
            }}>
              Copy to clipboard
            </span>
          )}
        </div>
      </div>
      {errorMessage && (
        <div style={{ color: 'red', marginBottom: '10px' }}>
          {errorMessage}
        </div>
      )}
      {successMessage && (
        <div style={{ color: 'green', marginBottom: '10px' }}>
          {successMessage}
        </div>
      )}
      <table border="1">
        <thead>
          <tr>
            {columns.map((col, index) => (
              <th key={col.id} style={{ width: col.width, position: 'relative', fontSize: '14px', fontWeight: 'normal' }}>
                {col.id.charAt(0).toUpperCase() + col.id.slice(1)}
                <Resizer onMouseDown={(e) => handleMouseDown(index, e)} />
              </th>
            ))}
            <th style={{ fontSize: '14px', fontWeight: 'normal' }}>Actions</th>
          </tr>
        </thead>

        <tbody>
          {data.map((row, rowIndex) => (
            <React.Fragment key={rowIndex}>
              <tr style={{ cursor: 'pointer' }}>
                <td>
                  <select
                    value={selectedCellNames[rowIndex]}
                    onChange={(e) => handleCellNameChange(rowIndex, e.target.value)}
                    onClick={() => { toggleSetupGif("cellName") }}
                    style={{
                      width: '100%',
                      padding: '5px',
                      backgroundColor: 'rgb(36, 37, 43)',
                      color: 'white',
                      border: '1px solid #ccc',
                      borderRadius: '4px'
                    }}
                  >
                    <option value="">Select Cell Name</option>
                    {[...new Set(getAvailableOptions())] // Remove duplicates
                      .filter(option => option.length) // Ensure options are not empty
                      .map((option, index) => (
                        <option
                          key={index}
                          value={option}
                          disabled={selectedCellNames.includes(option) && selectedCellNames[rowIndex] !== option}
                        >
                          {option}
                        </option>
                      ))}
                  </select>
                </td>

                <td>
                  <input
                    type="text"
                    value={row.signalNames}
                    onChange={(e) => handleInputChange(rowIndex, 'signalNames', e.target.value)}
                    onPaste={(e) => handlePaste(e, rowIndex)}
                    onClick={() => { toggleSetupGif("signalNames") }}
                    style={{ width: '84%', padding: '5px' }}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    value={row.Repetition}
                    onChange={(e) => handleInputChange(rowIndex, 'Repetition', e.target.value)}
                    onClick={() => { toggleSetupGif("Repetition") }}
                    min="0"
                    style={{ width: '82%', padding: '5px' }}
                  />
                </td>
                <td style={{ gap: '5px', alignItems: 'center' }}>
                  <button
                    onClick={() => deleteRow(rowIndex)}
                    style={{
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
                    <FaTrash />
                  </button>
                </td>
              </tr>
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default LocalPinInfo;
