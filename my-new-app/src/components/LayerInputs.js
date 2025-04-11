import React, { useState } from 'react';
import { FaTrash } from 'react-icons/fa';
import './LocalPinInfo.css'; // Adjust the path as necessary

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

function LayerInputs() {
  const [data, setData] = useState([
    { layerName: 'powerMetal', dataTypes: '5_1, 5_20', labelLayer: '4_0', blockageLayer: '4_0' },
    { layerName: 'signalMetal', dataTypes: '100_4, 101_4, 102_4', labelLayer: '100_20, 101_20, 102_20', blockageLayer: '106_1' },
    { layerName: 'boundary', dataTypes: '105_1', labelLayer: '', blockageLayer: '' }, // 3rd row
  ]);

  const [columns, setColumns] = useState([
    { id: 'layerName', width: 150 },
    { id: 'dataTypes', width: 400 },
    { id: 'labelLayer', width: 150 },
    { id: 'blockageLayer', width: 150 },
  ]);

  const deleteRow = (rowIndex) => {
    const updatedData = data.filter((_, i) => i !== rowIndex);
    setData(updatedData);
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

  return (
    <div className="table-container">
      <table border="1">
        <thead>
          <tr>
            {columns.map((col, index) => (
              <th key={col.id} style={{ width: col.width, position: 'relative' }}>
                {col.id.charAt(0).toUpperCase() + col.id.slice(1)}
                <Resizer onMouseDown={(e) => handleMouseDown(index, e)} />
              </th>
            ))}
            {/* <th>Actions</th> */}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {columns.map((col) => (
                <td key={col.id}>
                  <input
                    type="text"
                    value={row[col.id]}
                    onChange={(e) => {
                      const newValue = e.target.value;

                      const updatedData = data.map((r, i) => {
                        if (i === rowIndex) {
                          return { ...r, [col.id]: newValue };
                        }
                        return r;
                      });
                      setData(updatedData);
                    }}
                    style={{ width: '93%', padding: '5px' }}
                    readOnly={rowIndex === 2 && (col.id === 'labelLayer' || col.id === 'blockageLayer')} // Make col3 and col4 non-editable in row 3
                  />
                </td>
              ))}
              {/* <td>
                <button onClick={() => deleteRow(rowIndex)} style={{ color: 'red' }}>
                  <FaTrash />
                </button>
              </td> */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default LayerInputs;
