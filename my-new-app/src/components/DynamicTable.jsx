// DynamicTable.js
import React, { useEffect, useState } from 'react';
import { FaTrash } from 'react-icons/fa';
import { MdCopyAll } from "react-icons/md";
import { FcDeleteRow, FcAddRow } from "react-icons/fc";
import './GlobalPinInfo.css';

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

const DynamicTable = ({ data, setData, columns, setColumns, setupGif, setSetupGif, toggleSetupGif }) => {
    const [hoveredButton, setHoveredButton] = useState('');
    const [error, setError] = useState([]);
    const handleMouseEnter = (button) => setHoveredButton(button);
    const handleMouseLeave = () => setHoveredButton('');

    const validateInput = (column, value) => {
        const patterns = {
            globalPins: /^[a-zA-Z0-9_]+$/, // Allow letters, numbers, and underscores
            Width: /^[0-9]*\.?[0-9]*$/,
            selfSpacing: /^[0-9]*\.?[0-9]*$/,
            spaceToNext: /^[0-9]*\.?[0-9]*$/,
            Repetitions: /^\d+$/,
            Clubbing: /^\d+$/
        };
        const types = {
            globalPins: 'Alphanumeric (letters, numbers and underscores)',
            Width: 'Numeric (integer or float)',
            selfSpacing: 'Numeric (integer or float)',
            spaceToNext: 'Numeric (integer or float)',
            Repetitions: 'Integer (whole number)',
            Clubbing: 'Integer (whole number)'
        };

        const isValid = patterns[column].test(value) || value === '';
        return { isValid, expectedType: types[column] };
    };

    useEffect(() => {
        if (data.length > 1) {
            let totalValues = []
            for (let i = 0; i < data.length; i++) {
                totalValues.push(data[i].globalPins)
            }
            //console.log(totalValues)
            let repeated = []
            for (let i = 0; i < totalValues.length; i++) {
                for (let j = i + 1; j < totalValues.length; j++) {
                    if (totalValues[i] === totalValues[j]) {
                        //   setError(totalValues[j])
                        // console.log(totalValues[j])

                        totalValues[j] && repeated.push(totalValues[j])
                    }
                }
            }
            setError(repeated);
            // console.log(data.includes("vdd"))
        }
        else {
            setError([])
        }
    }, [data])
    //console.log(data);

    const handleInputChange = (rowIndex, column, value) => {
        const { isValid, expectedType } = validateInput(column, value);

        if (isValid) {
            setData(prevData => prevData.map((row, i) => i === rowIndex ? { ...row, [column]: value } : row));
        }
    };

    const addRow = () => {
        const newRow = columns.reduce((acc, column) => ({ ...acc, [column.id]: '' }), {});
        setData([...data, newRow]);
        // console.log(newRow)
    };

    const deleteRow = (rowIndex) => {
        if (rowIndex === 0) {
            return;
        }
        setData(data.filter((_, i) => i !== rowIndex));
    };

    const handleMouseDown = (index, e) => {
        e.preventDefault();
        const startX = e.clientX;
        const startWidth = columns[index].width;

        const handleMouseMove = (e) => {
            const newWidth = Math.max(50, startWidth + (e.clientX - startX));
            setColumns(prevColumns => {
                const updatedColumns = [...prevColumns];
                updatedColumns[index].width = newWidth;
                return updatedColumns;
            });
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
        navigator.clipboard.writeText(`${header}\n${rows}`)
            .then(() => alert('Data copied to clipboard!'))
            .catch(err => console.error('Error copying to clipboard: ', err));
    };

    // Updated function to handle pasting data
    const handlePaste = (rowIndex, column, e) => {
        const pastedData = e.clipboardData.getData('text').trim().split('\n');

        // Split each pasted line into individual values and create new rows
        const newRows = pastedData.map(line => {
            const values = line.split('\t');
            const newRow = {};
            columns.forEach((col, index) => {
                newRow[col.id] = values[index] || ''; // Handle case where there are fewer values
            });
            return newRow;
        });

        // Create a Set of existing globalPins for quick lookup
        const existingPins = new Set(data.map(row => row.globalPins));

        // Filter out duplicates from the new rows
        const uniqueNewRows = newRows.filter(newRow => {
            if (existingPins.has(newRow.globalPins)) {
                return false; // Skip duplicates
            }
            existingPins.add(newRow.globalPins); // Add to existing pins
            return true; // Keep unique rows
        });

        setData(prevData => {
            const updatedData = [...prevData];
            updatedData.splice(rowIndex, uniqueNewRows.length, ...uniqueNewRows);
            return updatedData;
        });
    };


    // console.log(data)
    // console.log(columns)

    return (
        <div className="table-container">
            <div className='mt-10' style={{ display: 'flex', marginBottom: '10px' }}>
                {['addRow', 'deleteRow', 'copy'].map((action) => (
                    <div key={action} style={{ position: 'relative', marginLeft: '10px' }}>
                        <button
                            onMouseEnter={() => handleMouseEnter(action)}
                            onMouseLeave={handleMouseLeave}
                            onClick={action === 'addRow' ? addRow : action === 'deleteRow' ? () => deleteRow(data.length - 1) : copyToClipboard}
                            disabled={action === 'deleteRow' && data.length === 0}
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
                            {action === 'addRow' ? <FcAddRow size={25} /> : action === 'deleteRow' ? <FcDeleteRow size={25} /> : <MdCopyAll size={20} />}
                        </button>
                        {hoveredButton === action && (
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
                                {action === 'addRow' ? 'Add Row' : action === 'deleteRow' ? 'Delete Row' : 'Copy to Clipboard'}
                            </span>
                        )}
                    </div>
                ))}
            </div>

            <table border="1">
                <thead>
                    <tr>
                        {columns.map((col, index) => (
                            <th key={col.id} style={{ position: 'relative', width: col.width, fontWeight: 'normal', fontSize: '14px' }}>
                                {col.id.charAt(0).toUpperCase() + col.id.slice(1)}
                                <Resizer onMouseDown={(e) => handleMouseDown(index, e)} />
                            </th>
                        ))}
                        <th style={{ fontWeight: 'normal', fontSize: '14px' }}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((row, rowIndex) => (
                        <tr key={rowIndex}>
                            {columns.map((col, colIndex) => (
                                <td key={col.id}>
                                    <input
                                        type="text"
                                        value={row[col.id] || ''}
                                        onChange={(e) => handleInputChange(rowIndex, col.id, e.target.value)}
                                        onPaste={(e) => handlePaste(rowIndex, col.id, e)}
                                        onClick={() => { toggleSetupGif(col.id) }}
                                        style={{ width: '87px', padding: '5px', border: colIndex === 0 && error.includes(row[col.id]) && '1px solid red', }}
                                    />
                                </td>
                            ))}
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
                    ))}
                </tbody>
            </table>



        </div>
    );
};

export default DynamicTable;
