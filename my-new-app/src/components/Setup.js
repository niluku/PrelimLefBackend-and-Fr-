import React, { useState } from 'react';
import './Setup.css';

const Setup = ({ data, setData, setupGif, setSetupGif, toggleSetupGif, tableData, setTableData, LocalData, setLocalData, matrixData, setMatrixData, firstRowSelectValues, setFirstRowSelectValues, matrixcolumns, setMatrixColumns }) => {
  const [inputValidity, setInputValidity] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };
  // console.log(setupGif)

  const numberInputStyle = {
    height: '10px',
    width: '30%',
    marginRight: '10px',
  };

  // const toggleSetupGif = (name) => {
  //   let obj = { ...setupGif }
  //   Object.keys(obj).map((item) => obj[item] = false);
  //   obj[name] = true;
  //   setSetupGif(obj)
  //   console.log(obj);
  // }

  const renderInput = (label, name, validation, placeholder = "", gif) => (
    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '7px' }}>
      {label && <div style={{ marginRight: '10px', width: '40%' }}>{label}:</div>}
      <input
        type='text'
        className='offsetInput'
        style={{
          ...numberInputStyle,
          borderColor: inputValidity[name] === false ? 'red' : 'initial',
        }}
        onClick={() => {
          toggleSetupGif(gif || label);
        }}

        name={name}
        value={data[name] || ''}
        placeholder={placeholder}
        onInput={(e) => {
          const inputValue = e.target.value;
          // Validate input and set validity state
          if (!validation || validation.test(inputValue)) {
            setInputValidity((prev) => ({ ...prev, [name]: true }));
            handleChange(e);
          } else {
            setInputValidity((prev) => ({ ...prev, [name]: false }));
          }
        }}
      />
    </div>
  );

  // const setLocalStorage = () => {
  //   localStorage.setItem("setupData", JSON.stringify(data));
  //   localStorage.setItem("tableData", JSON.stringify(tableData));
  //   localStorage.setItem("LocalData", JSON.stringify(LocalData));
  //   localStorage.setItem("matrixData", JSON.stringify(matrixData));
  //   localStorage.setItem("firstRowSelectValues", JSON.stringify(firstRowSelectValues));
  //   localStorage.setItem("matrixcolumns", JSON.stringify(matrixcolumns));
  // };

  // const getLocalStorage = async () => {
  //   const setupDataTemp = localStorage.getItem("setupData");
  //   setData(await JSON.parse(setupDataTemp));
  //   //console.log(await JSON.parse(setupDataTemp))

  //   const tableDataTemp = localStorage.getItem("tableData");
  //   setTableData(await JSON.parse(tableDataTemp));
  //   //console.log(await JSON.parse(tableDataTemp))

  //   const LocalDataTemp = localStorage.getItem("LocalData");
  //   setLocalData(await JSON.parse(LocalDataTemp));
  //   //console.log(await JSON.parse(LocalDataTemp))

  //   const matrixDataTemp = localStorage.getItem("matrixData");
  //   setMatrixData(await JSON.parse(matrixDataTemp));
  //   // console.log(await JSON.parse(matrixDataTemp))

  //   const firstRowSelectValuesTemp = localStorage.getItem("firstRowSelectValues");
  //   setFirstRowSelectValues(await JSON.parse(firstRowSelectValuesTemp));
  //   //console.log(await JSON.parse(firstRowSelectValuesTemp))

  //   const matrixcolumnsTemp = localStorage.getItem("matrixcolumns");
  //   setMatrixColumns(await JSON.parse(matrixcolumnsTemp));
  //   console.log(await JSON.parse(matrixcolumnsTemp))
  // };



  return (
    <div>
      {/* <div className='setupMain' style={{ display: 'flex', justifyContent: 'flex-end', paddingBottom: 0 }}>
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
      </div> */}
      <div className='setupMain' style={{ display: 'flex', justifyContent: 'space-between', padding: '0', marginLeft: '10px' }}>
        <div style={{ flex: '1', marginRight: '20px' }}>
          {/* Global Pin Section */}
          <div className='BoxClass mt-20'>
            <div className='HeadingSet' style={{ color: 'rgb(94, 156, 179)', fontWeight: 'bold' }}>Global Pin</div>
            <div className='setLayer'>
              {renderInput('Offset', 'globalOffset', /^[0-9.]*$/)}
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '7px' }}>
                <div style={{ marginRight: '10px', width: '40%' }}>Direction:</div>
                <select
                  className='setupDropdown'
                  style={{ width: '33%', height: '24%' }}
                  name='direction'
                  value={data.direction}
                  onChange={handleChange}
                  onClick={() => { toggleSetupGif("direction") }}
                >
                  <option value='vertical'>Vertical</option>
                  <option value='horizontal'>Horizontal</option>
                </select>
              </div>
              {renderInput('Layer Number', 'layerNumber', /^[0-9_, ]*$/)}
              {renderInput('Label Number', 'labelNumber', /^[0-9_, ]*$/)}
              {renderInput('Blockage Layer', 'blockageLayer', /^[0-9_, ]*$/)}
            </div>
          </div>

          {/* Local Pin Section */}
          <div className='BoxClass mt-20'>
            <div className='HeadingSet' style={{ color: 'rgb(94, 156, 179)', fontWeight: 'bold' }}>Local Pin</div>
            <div className='setLayer'>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '7px' }}>
                <div style={{ marginRight: '10px', width: '40%' }}>offset:</div>
                <input
                  className='no-spinner'
                  style={{ marginRight: '5px', width: '13%', height: '10px', textAlign: 'center' }}
                  type='text' // Use 'text' to allow decimal input
                  placeholder='X'
                  value={data.localOffsetAdditional[0] || ''} // Allow for empty input
                  onChange={(e) => {
                    const newValue = e.target.value;
                    // Update state directly
                    setData((prevData) => ({
                      ...prevData,
                      localOffsetAdditional: [newValue, prevData.localOffsetAdditional[1]] // Keep the second value unchanged
                    }));
                  }}
                  onBlur={() => {
                    const parsedValue = parseFloat(data.localOffsetAdditional[0]);

                    // If input is empty or invalid, reset to empty
                    if (isNaN(parsedValue)) {
                      setData((prevData) => ({
                        ...prevData,
                        localOffsetAdditional: [''] // Reset only the first value
                      }));
                    } else {
                      setData((prevData) => ({
                        ...prevData,
                        localOffsetAdditional: [parsedValue, prevData.localOffsetAdditional[1]] // Keep the second value unchanged
                      }));
                    }
                  }}
                  onClick={() => {
                    toggleSetupGif("localOffset");
                  }}
                />

                <input
                  className='no-spinner'
                  style={{ width: '13%', height: '10px', textAlign: 'center' }} // Height remains at 10px
                  type='text' // Changed to 'text' to allow decimal input
                  placeholder='Y'
                  value={data.localOffsetAdditional[1] || ''} // Ensure it can handle empty values
                  onChange={(e) => {
                    const newValue = e.target.value;

                    // Update state directly
                    setData((prevData) => ({
                      ...prevData,
                      localOffsetAdditional: [prevData.localOffsetAdditional[0], newValue] // Keep the first value unchanged
                    }));
                  }}
                  onBlur={() => {
                    const parsedValue = parseFloat(data.localOffsetAdditional[1]);

                    // If input is empty or invalid, reset to empty
                    if (isNaN(parsedValue)) {
                      setData((prevData) => ({
                        ...prevData,
                        localOffsetAdditional: [prevData.localOffsetAdditional[0], ''] // Reset only the second value
                      }));
                    } else {
                      setData((prevData) => ({
                        ...prevData,
                        localOffsetAdditional: [prevData.localOffsetAdditional[0], parsedValue] // Update to parsed value
                      }));
                    }
                  }}
                  onClick={() => {
                    toggleSetupGif("localOffsetAdditional");
                  }}
                />

              </div>

              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '7px' }}>
                <div style={{ marginRight: '10px', width: '40%' }}>Side:</div>
                <select
                  className='setupDropdown'
                  style={{ width: '33%', height: '24%' }}
                  name='side'
                  value={data.side}
                  onChange={handleChange}
                  onClick={() => {
                    toggleSetupGif("side");
                  }}
                >
                  <option value='top'>Top</option>
                  <option value='bottom'>Bottom</option>
                  <option value='left'>Left</option>
                  <option value='right'>Right</option>
                </select>
              </div>
              {renderInput('Width', 'width', /^[0-9.]*$/, "", "widthsetup")}
              {renderInput('Length', 'length', /^[0-9.]*$/)}
              {renderInput('Spacing', 'spacing', /^[0-9.]*$/)}
              {renderInput('Layer Number', 'localLayerNumber', /^[0-9_, ]*$/, "", "localLayerNumber")}
              {renderInput('Label Number', 'localLabelNumber', /^[0-9_, ]*$/, "", "localLayerNumber")}
              {renderInput('Blockage Layer', 'localBlockageLayer', /^[0-9_, ]*$/, "", "localBlockageLayer")}
            </div>
          </div>
        </div>

        {/* Right Side Section */}
        <div style={{ flex: '1' }}>
          {/* Blockage Section */}
          <div className='BoxClass mt-20'>
            <div className='HeadingSet' style={{ color: 'rgb(94, 156, 179)', fontWeight: 'bold' }}>Blockage</div>
            <div className='setLayer'>
              {renderInput('Minimum Width', 'minWidth', /^[0-9.]*$/)}
              {renderInput('Spacing To Pin', 'spacingToPin', /^[0-9.]*$/)}
            </div>
          </div>

          {/* Label Section */}
          <div className='BoxClass mt-20'>
            <div className='HeadingSet' style={{ color: 'rgb(94, 156, 179)', fontWeight: 'bold' }}>Label</div>
            <div className='setLayer'>
              {renderInput('Enclosure', 'enclosure', /^[0-9.]*$/)}
              {renderInput('Size', 'size', /^[0-9.]*$/)}
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '7px' }}>
                <div style={{ marginRight: '10px', width: '40%' }}>Orientation:</div>
                <select
                  className='setupDropdown'
                  style={{ width: '33%', height: '24%' }}
                  name='orientation'
                  value={data.orientation}
                  onChange={handleChange}
                  onClick={() => { toggleSetupGif("orientation") }}
                >
                  <option value='R0'>R0</option>
                  <option value='R90'>R90</option>
                  <option value='R180'>R180</option>
                  <option value='R270'>R270</option>
                </select>
              </div>
            </div>
          </div>

          {/* General Section */}
          <div className='BoxClass2 mt-20'>
            <div className='HeadingSet' style={{ color: 'rgb(94, 156, 179)', fontWeight: 'bold' }}>General</div>
            <div className='setLayer'>
              {renderInput('Unit', 'unit', /^[0-9.e-]*$/)} {/* Updated regex to allow - and e */}
              {renderInput('Precision', 'precision', /^[0-9.e-]*$/)} {/* Updated regex to allow - and e */}
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '7px' }}>
                <div style={{ marginRight: '10px', width: '40%' }}>Limit to Size:</div>
                <label className="toggleSwitch">
                  <input
                    type="checkbox"
                    name="limitToSize"
                    checked={data.limitToSize}
                    onClick={() => { toggleSetupGif("LimitToSize") }}
                    onChange={handleChange}
                  />
                  <span className="slider" />
                </label>
              </div>
              {renderInput('Boundary Layer', 'boundaryLayer')}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Setup;
