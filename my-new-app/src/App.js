import React, { useState, useEffect } from 'react';
import GlobalPinInfo from './components/GlobalPinInfo';
import LayerInputs from './components/LayerInputs';
import LocalPinInfo from './components/LocalPinInfo';
import MatrixInput from './components/MatrixInput';
import Setup from './components/Setup';
import './App.css';
import { FaFileCode, FaPlay } from 'react-icons/fa';
import { FaFileUpload, FaFileDownload } from 'react-icons/fa';
import DynamicTable from './components/DynamicTable';
import offsetgif from './accets/offet.jpeg'
import globalOffset from './accets/globalOffset.gif'
import direction from './accets/direction.mp4'
import * as XLSX from 'xlsx';

function App() {
  const [activeRightBtn, setActivRighteBtn] = useState("gif");
  const [activeLeftBtn, setActivLefteBtn] = useState("matrix");
  const [isHoverUpload, setIsHoverUpload] = useState(false);
  const [isHoverDownload, setIsHoverDownload] = useState(false);
  const [isHoverScriptify, setIsHoverScriptify] = useState(false);
  const [topCell, setTopCell] = useState("Top");
  const [isClicked, setIsClicked] = useState(false);
  const [excelData, setExcelData] = useState({}); // Store data from multiple sheets
  const [matrixData, setMatrixData] = useState(Array(5).fill({ layerName: '', dataTypes: '', labelLayer: '', blockageLayer: '', newCol1: '', newCol2: '' }));
  const [isLoading, setIsLoading] = useState(true);


  const [LocalData, setLocalData] = useState([
    { cellName: '', signalNames: '', Repetition: null }, //remove predefine input here
    // { cellName: '', signalNames: '', Repetition: null },
    // { cellName: '', signalNames: '', Repetition: null },
  ]);

  const [tableData, setTableData] = useState(() => {
    const savedData = localStorage.getItem('dynamicTableData');
    return savedData ? JSON.parse(savedData) : [
      { globalPins: '', Width: '', selfSpacing: '', spaceToNext: '', Repetitions: null, Clubbing: '' },
      // { globalPins: '', Width: '', selfSpacing: '', spaceToNext: '', Repetitions: null, Clubbing: '' },
      // { globalPins: '', Width: '', selfSpacing: '', spaceToNext: '', Repetitions: null, Clubbing: '' },
    ];
  });

  const handleFileUpload = (e) => {
    const file = e.target.files[0]; // Get the selected file
    if (file) {
      const reader = new FileReader();

      reader.onload = (event) => {
        const binaryStr = event.target.result;
        const workbook = XLSX.read(binaryStr, { type: 'binary' });

        // Initialize an empty object to hold data for each sheet
        let sheetData = {};

        // Loop through all the sheets in the workbook
        workbook.SheetNames.forEach((sheetName) => {
          const sheet = workbook.Sheets[sheetName];
          const data = XLSX.utils.sheet_to_json(sheet, { header: 1 }); // Convert sheet to JSON (array of arrays)

          // Store each sheet's data in the sheetData object
          sheetData[sheetName] = data;
        });

        setExcelData(sheetData); // Set the state with data from all sheets
      };
      reader.readAsBinaryString(file);
    }
  };

  const [columns, setColumns] = useState([
    { id: 'globalPins', width: 100 },
    { id: 'Width', width: 100 },
    { id: 'selfSpacing', width: 100 },
    { id: 'spaceToNext', width: 100 },
    { id: 'Repetitions', width: 100 },
    { id: 'Clubbing', width: 100 },
  ]);

  const [setupData, setSetupData] = useState({
    direction: "vertical",
    globalOffset: '',
    layerNumber: '',
    labelNumber: '',
    blockageLayer: '',
    localOffset: '',
    localOffsetAdditional: [],
    side: 'top',
    width: '',
    length: '',
    spacing: '',
    localLayerNumber: '',
    localLabelNumber: '',
    localBlockageLayer: '',
    minWidth: '',
    spacingToPin: '',
    enclosure: '',
    size: '',
    orientation: 'R0',
    unit: '',
    precision: '',
    limitToSize: false,
    boundaryLayer: '',
  });

  const [setupGif, setSetupGif] = useState({
    direction: false,
    globalOffset: false,
    layerNumber: false,
    labelNumber: false,
    blockageLayer: false,
    localOffset: false,
    localOffsetAdditional: false,
    side: false,
    widthsetup: false,
    length: false,
    spacing: false,
    localLayerNumber: false,
    localLabelNumber: false,
    localBlockageLayer: false,
    "Minimum Width": false,
    "Spacing To Pin": false,
    enclosure: false,
    size: false,
    orientation: false,
    unit: false,
    precision: false,
    limitToSize: false,
    boundaryLayer: false,
    cellName: false,
    signalNames: false,
    Repetition: false,
    globalPins: false,
    Width: false,
    selfSpacing: false,
    spaceToNext: false,
    Repetitions: false,
    Clubbing: false,
    layerName: false,
    dataTypes: false,
    labelLayer: false,
    blockageLayer: false,
    newCol1: false,
    top: false,
    GlobalHorPinsdroupdown: false,
    GlobalPinsdroupdown: false,
    WidthNumric: false,
    HightNumric: false,
    MatrixAlphanumric: false
  });

  const toggleSetupGif = (name) => {
    let obj = { ...setupGif }
    Object.keys(obj).map((item) => obj[item] = false);
    obj[name] = true;
    setSetupGif(obj)
    console.log(obj);
  }

  const [matrixcolumns, setMatrixColumns] = useState([
    { id: 'layerName', width: "" },
    { id: 'dataTypes', width: "" },
    { id: 'labelLayer', width: "" },
    { id: 'blockageLayer', width: "" },
    { id: 'newCol1', width: "" },
    { id: 'newCol2', width: "" },
  ]);

  const handleDownload = async () => {
    try {
      const response = await fetch('http://localhost:5000/download'); // Ensure the URL is correct
      if (!response.ok) {
        throw new Error('Failed to download file');
      }
      const blob = await response.blob(); // Get file data as a blob
      const url = window.URL.createObjectURL(blob); // Create a URL for the blob
      const a = document.createElement('a');
      a.href = url;
      a.download = 'new.gds'; // Set the file name
      document.body.appendChild(a);
      a.click(); // Trigger download
      a.remove(); // Clean up
      window.URL.revokeObjectURL(url); // Release the blob URL
    } catch (error) {
      console.error('Download failed:', error);
    }
  };


  const [firstRowSelectValues, setFirstRowSelectValues] = useState(
    matrixcolumns.reduce((acc, col) => {
      acc[col.id] = [];
      return acc;
    }, {})
  );

  const handleRunButtonClick = async () => {
    setIsClicked(true);
    setTimeout(() => {
      setIsClicked(false);
    }, 200);

    const jsonData = {
      matrix_inputs: {
        top_cell: topCell,
        rows: matrixData.map(row =>
          Object.values(row)
            .slice(2)  // Skip the first two columns
            .filter(ele => ele !== undefined)  // Filter out undefined but leave empty strings
        ),
        height: matrixData.map(row => (row.dataTypes ? parseFloat(row.dataTypes) : undefined)).filter(dataTypes => dataTypes !== undefined),
        width: matrixcolumns.map((row, index) => (index > 1 && row.width ? parseFloat(row.width) : undefined)).filter(width => width !== undefined),
        global_net: setupData.direction === "vertical"
          ? Object.values(firstRowSelectValues).map(item => {
            // Ensure item is an array before calling .map()
            if (Array.isArray(item)) {
              return item.length === 1 && item[0] === "none" ? [""] : item.map(ele => ele === "none" ? "" : ele);
            }
            // If item isn't an array, handle it accordingly
            return [item].map(ele => ele === "none" ? "" : ele); // Wrap in array and map
          }).filter((item, index) => index > 1)
          : matrixData.map(row => {
            if (!row.layerName || (row.layerName.length === 1 && row.layerName[0] === "none")) {
              return [""];
            }
            // Ensure row.layerName is an array before using .map()
            return Array.isArray(row.layerName)
              ? row.layerName.map(ele => ele === "none" ? "" : ele)
              : [row.layerName]; // If it's not an array, wrap it
          }),
      },
      layer_inputs: {
        power_metal: {
          layer_number: setupData.layerNumber.split('_').map(Number),
          label_number: setupData.labelNumber.split('_').map(Number),
          blockage_layer: setupData.blockageLayer.split('_').map(Number),
        },
        signal_metal: {
          layer_number: setupData.localLayerNumber.split(',').flatMap(item =>
            item.split('_').map(ele => parseInt(ele)).reduce((acc, val, index) => {
              if (index % 2 === 0) {
                acc.push([val]);
              } else {
                acc[acc.length - 1].push(val);
              }
              return acc;
            }, []),
          ),
          label_number: setupData.localLabelNumber.split(',').flatMap(item =>
            item.split('_').map(ele => parseInt(ele)).reduce((acc, val, index) => {
              if (index % 2 === 0) {
                acc.push([val]);
              } else {
                acc[acc.length - 1].push(val);
              }
              return acc;
            }, []),
          ),
          blockage_layer: setupData.localBlockageLayer.split('_').map(Number),
        },
        boundary_layer: setupData.boundaryLayer.split('_').map(Number),
      },
      global_pin_info: tableData.map(row => ({
        name: row.globalPins,
        width: parseFloat(row.Width),
        spacing: {
          self: parseFloat(row.selfSpacing),
          other: parseFloat(row.spaceToNext),
        },
        repetition: parseInt(row.Repetitions, 10),
        clubbing: parseInt(row.Clubbing, 10),
      })),
      local_pin_info: LocalData.map(row => ({
        cell_name: row.cellName,
        signal_name: row.signalNames,
        repetition: Number(row.Repetition),
      })),
      setup: {
        global_pin: {
          offset: parseFloat(setupData.globalOffset),
          direction: setupData.direction,
        },
        local_pin: {
          offset: Array.isArray(setupData.localOffsetAdditional) ? setupData.localOffsetAdditional : [],
          side: setupData.side,
          width: parseFloat(setupData.width),
          length: parseFloat(setupData.length),
          spacing: parseFloat(setupData.spacing),
        },
        blockage: {
          min_width: parseFloat(setupData.minWidth),
          spacing_to_pin: parseFloat(setupData.spacingToPin),
        },
        label: {
          enclosure: parseFloat(setupData.enclosure),
          size: parseFloat(setupData.size),
          orientation: setupData.orientation,
        },
        precision: setupData.precision ? parseFloat(setupData.precision) : undefined,
        unit: setupData.unit ? parseFloat(setupData.unit) : undefined,
        limit_to_size: setupData.limitToSize,
      },
    };

    console.log(JSON.stringify(jsonData, null, 2));

    try {
      //const response = await fetch('https://nilu11810.pythonanywhere.com/prelimlef', {
      //const response = await fetch('http://54.88.66.205:5000/prelimlef', {
      const response = await fetch('http://localhost:5000/prelimlef', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(jsonData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Error: ${errorData.message || 'Unknown error'}`);
      } else {
        handleDownload();
      }

      // Handle success case here

    } catch (error) {
      console.error('Error sending data to backend:', error);
      alert(`Error sending data: ${error.message}`);
    }
    //handleDownload();
  };


  useEffect(() => {
    if (excelData) {

      // for global_pin_info
      if (excelData.global_pin_info) {
        let grobalPinData = [...excelData.global_pin_info];
        let newTableData = []

        for (let i = 1; i < grobalPinData.length; i++) {
          let obj = {
            globalPins: grobalPinData[i][0] || "",
            Width: grobalPinData[i][1] || "",
            selfSpacing: grobalPinData[i][2] || "",
            spaceToNext: grobalPinData[i][3] || "",
            Repetitions: grobalPinData[i][4] || "",
            Clubbing: grobalPinData[i][5] || ""
          }
          newTableData.push(obj)
        }
        setTableData(newTableData);
      }
      // Process matrix_inputs
      if (excelData.matrix_inputs) {
        let matrix = [...excelData.matrix_inputs];
        let keys = Object.keys(matrixData[0]);
        let first2;

        if (matrix[0].length >= keys.length) {
          first2 = { ...firstRowSelectValues }
        } else {
          first2 = [
            { id: 'layerName', width: "" },
            { id: 'dataTypes', width: "" },
            { id: 'labelLayer', width: "" },
            { id: 'blockageLayer', width: "" },
            { id: 'newCol1', width: "" },
            { id: 'newCol2', width: "" },
          ].reduce((acc, col) => {
            acc[col.id] = [];
            return acc;
          }, {})
        }

        if (matrix[0].length > keys.length) {
          for (let i = keys.length - 1; i < matrix[0].length - 1; i++) {
            const newColumnId = 'newColumn' + i + 2;
            first2 = { ...first2, [newColumnId]: [] }
          }
          setFirstRowSelectValues(first2);
        }

        let firstkey = Object.keys(first2);
        setTopCell(matrix[0][0]);

        let first = { "layerName": [], "dataTypes": [] }
        let column = [{ "id": "layerName", "width": "" }, { "id": "dataTypes", "width": "" }]
        let mat = [];
        for (let i = 2; i < firstkey.length; i++) {
          first = { ...first, [firstkey[i]]: matrix[0][i] ? [matrix[0][i]] : "" };
          column = [...column, { "id": firstkey[i], "width": matrix[1][i] ? matrix[1][i] : "" }];
          let obj = {}
          for (let j = 0; j < firstkey.length; j++) {
            if (j < 1) {
              obj = { ...obj, [firstkey[j]]: matrix[i][j] ? [matrix[i][j]] : "" }
            } else {
              obj = { ...obj, [firstkey[j]]: matrix[i][j] ? matrix[i][j] === "-" ? "" : matrix[i][j] : "" }
            }
          }
          mat.push(obj);
        }
        setFirstRowSelectValues(first);
        setMatrixColumns(column);
        setMatrixData(mat);
      }

      // Process local_pin_info
      //for local Pin Info
      if (excelData.local_pin_info) {
        let localPinData = [...excelData.local_pin_info];
        let newLocalData = []

        for (let i = 1; i < localPinData.length; i++) {
          let obj =
          {
            "cellName": localPinData[i][0] || "",
            "signalNames": localPinData[i][1] || "",
            "Repetition": localPinData[i][2] || "",
          }
          newLocalData.push(obj)
        }
        setLocalData(newLocalData);
      }

      // Process setup or layer_inputs
      if (excelData.setup || excelData.layer_inputs) {
        let setup = {
          "direction": excelData.setup[2][1] || "vertical",
          "globalOffset": excelData.setup[1][1] || "",
          "layerNumber": JSON.parse(excelData.layer_inputs[1][1]).join('_') || "",
          "labelNumber": JSON.parse(excelData.layer_inputs[1][2]).join('_') || "",
          "blockageLayer": JSON.parse(excelData.layer_inputs[1][3]).join('_') || "",
          "localOffset": "",
          "localOffsetAdditional": JSON.parse(excelData.setup[3][1]) || "",
          "side": excelData.setup[4][1] || "right",
          "width": excelData.setup[5][1] || "",
          "length": excelData.setup[6][1] || "",
          "spacing": excelData.setup[7][1] || "",
          "localLayerNumber": JSON.parse(excelData.layer_inputs[2][1]).map(subArr => subArr.join('_')).join(',') || "",
          "localLabelNumber": JSON.parse(excelData.layer_inputs[2][2]).map(subArr => subArr.join('_')).join(',') || "",
          "localBlockageLayer": JSON.parse(excelData.layer_inputs[2][3]).join('_') || "",
          "minWidth": excelData.setup[8][1] || "",
          "spacingToPin": excelData.setup[9][1] || "",
          "enclosure": excelData.setup[10][1] || "",
          "size": excelData.setup[11][1] || "",
          "orientation": excelData.setup[12][1] || "",
          "unit": excelData.setup[14][1] || "",
          "precision": excelData.setup[13][1] || "",
          "limitToSize": excelData.setup[15][1] || false,
          "boundaryLayer": JSON.parse(excelData.layer_inputs[3][1]).join('_') || ""
        };
        setSetupData(setup);
      }
    }
  }, [excelData]);

  //console.log(firstRowSelectValues)
  // Function to handle the Excel download
  const downloadExcel = () => {
    const setupTemp = [
      { Constraints: "global_pin_offset", Value: setupData.globalOffset },
      { Constraints: "global_pin_direction", Value: setupData.direction },
      { Constraints: "local_pin_offset", Value: JSON.stringify(setupData.localOffsetAdditional) },
      { Constraints: "local_pin_side", Value: setupData.side },
      { Constraints: "local_pin_width", Value: setupData.width },
      { Constraints: "local_pin_length", Value: setupData.length },
      { Constraints: "local_pin_spacing", Value: setupData.spacing },
      { Constraints: "blockage_main_width", Value: setupData.minWidth },
      { Constraints: "blockage_spacing_to_pin", Value: setupData.spacingToPin },
      { Constraints: "lebel_enclosure", Value: setupData.enclosure },
      { Constraints: "lebel_size", Value: setupData.size },
      { Constraints: "lebel_orientation", Value: setupData.orientation },
      { Constraints: "precision", Value: setupData.precision },
      { Constraints: "unit", Value: setupData.unit },
      { Constraints: "limit_to_size", Value: setupData.limitToSize },
    ];
    const layer_input = [
      {
        layerName: "power_metal",
        layer_number: JSON.stringify(setupData.layerNumber.split("_").map(Number)),
        label_number: JSON.stringify(setupData.labelNumber.split("_").map(Number)),
        blockage_layer: JSON.stringify(setupData.blockageLayer.split("_").map(Number))
      },
      {
        layerName: "signal_metal",
        layer_number: JSON.stringify(setupData.localLayerNumber.split(",").map((item) => item.split("_").map(Number))),
        label_number: JSON.stringify(setupData.localLabelNumber.split(",").map((item) => item.split("_").map(Number))),
        blockage_layer: JSON.stringify(setupData.localBlockageLayer.split("_").map(Number))
      },
      {
        layerName: "boundary",
        layer_number: JSON.stringify(setupData.boundaryLayer.split("_").map(Number)),
        label_number: "",
        blockage_layer: ""
      },
    ]

    let newTableData = tableData.map((item) => {
      return {
        "name": item.globalPins,
        "width": item.Width,
        "self_spacing": item.selfSpacing,
        "spacing_other": item.spaceToNext,
        "repetition": item.Repetitions,
        "clubbing": item.Clubbing,
      }
    })

    let fullMatrix = []
    let first = [];
    for (let key in firstRowSelectValues) {
      if (Array.isArray(firstRowSelectValues[key])) {
        first.push(setupData.direction === "horizontal" ? "" : firstRowSelectValues[key].length > 0 ? firstRowSelectValues[key].join(', ') : '');
      } else {
        first.push(firstRowSelectValues[key] || '');
      }
    }

    fullMatrix.push(first);
    const col = matrixcolumns.map(item => {
      return (item.width === "" || item.width === undefined) ? "" : item.width.toString();
    });
    fullMatrix.push(col);

    const mat = matrixData.map((item, index) => {
      return Object.keys(item).map((key, ind) => {
        const value = item[key];
        if (Array.isArray(value)) {
          return setupData.direction === "vertical" ? "" : value.join(', ');
        }
        return value !== undefined && value !== "" ? value.toString() : ind > 0 ? "-" : "";
      });
    });

    mat.map((item) => {
      fullMatrix.push(item);
    })
    fullMatrix[0][0] = topCell;

    const data = [
      { sheetName: 'matrix_inputs', data: fullMatrix },
      { sheetName: 'layer_inputs', data: layer_input },
      { sheetName: 'global_pin_info', data: newTableData },
      { sheetName: 'local_pin_info', data: LocalData },
      { sheetName: 'setup', data: setupTemp },
    ];

    const wb = XLSX.utils.book_new();
    data.forEach((sheet) => {
      if (sheet.sheetName === 'matrix_inputs') {
        const ws = XLSX.utils.aoa_to_sheet(sheet.data);
        XLSX.utils.book_append_sheet(wb, ws, sheet.sheetName);
      } else {
        const ws = XLSX.utils.json_to_sheet(sheet.data);
        XLSX.utils.book_append_sheet(wb, ws, sheet.sheetName);
      }
    });
    XLSX.writeFile(wb, 'prelimLEF.xlsx');
  };
  // console.log(topCell)

  //   // Function to download the JSON data
  //   const downloadJSON = (data, filename) => {
  //     const jsonString = JSON.stringify(data, null, 2);
  //     const blob = new Blob([jsonString], { type: 'application/json' });
  //     const url = URL.createObjectURL(blob);
  //     const a = document.createElement('a');
  //     a.href = url;
  //     a.download = filename;
  //     a.click();
  //     URL.revokeObjectURL(url);
  //   };

  //   // Call the download function
  //   downloadJSON(jsonData, 'output.json');
  // };

  // console.log(firstRowSelectValues);

  const setLocalStorage = () => {
    localStorage.setItem("setupData", JSON.stringify(setupData));
    localStorage.setItem("tableData", JSON.stringify(tableData));
    localStorage.setItem("LocalData", JSON.stringify(LocalData));
    localStorage.setItem("matrixData", JSON.stringify(matrixData));
    localStorage.setItem("firstRowSelectValues", JSON.stringify(firstRowSelectValues));
    localStorage.setItem("matrixcolumns", JSON.stringify(matrixcolumns));
  };

  const getLocalStorage = async () => {
    const setupDataTemp = localStorage.getItem("setupData");
    setSetupData(await JSON.parse(setupDataTemp));
    //console.log(await JSON.parse(setupDataTemp))

    const tableDataTemp = localStorage.getItem("tableData");
    setTableData(await JSON.parse(tableDataTemp));
    //console.log(await JSON.parse(tableDataTemp))

    const LocalDataTemp = localStorage.getItem("LocalData");
    setLocalData(await JSON.parse(LocalDataTemp));
    //console.log(await JSON.parse(LocalDataTemp))

    const matrixDataTemp = localStorage.getItem("matrixData");
    setMatrixData(await JSON.parse(matrixDataTemp));
    // console.log(await JSON.parse(matrixDataTemp))

    const firstRowSelectValuesTemp = localStorage.getItem("firstRowSelectValues");
    setFirstRowSelectValues(await JSON.parse(firstRowSelectValuesTemp));
    //console.log(await JSON.parse(firstRowSelectValuesTemp))

    const matrixcolumnsTemp = localStorage.getItem("matrixcolumns");
    setMatrixColumns(await JSON.parse(matrixcolumnsTemp));
    console.log(await JSON.parse(matrixcolumnsTemp))
  };

  const handleIframeLoad = () => {
    setIsLoading(false); // Set loading to false once the iframe is loaded
  };

  return (
    <div className='homeMainContainer' style={{ backgroundColor: "rgb(36, 37, 43)" }}>
      <div className="homeLeftContainer">
        <div className='alineButton'>
          <div className="OperationLeftButtonBar">
            <button className={`layerLeftBtn pointer ${activeLeftBtn === "matrix" && "active"}`} onClick={() => { setActivLefteBtn("matrix") }}>Matrix Input</button>
            <button className={`layerLeftBtn pointer ${activeLeftBtn === "info" && "active"}`} onClick={() => { setActivLefteBtn("info") }}>Global Pin Info</button>
            <button className={`layerLeftBtn pointer ${activeLeftBtn === "local" && "active"}`} onClick={() => { setActivLefteBtn("local") }}>Local Pin Info</button>
            <button className={`layerLeftBtn pointer ${activeLeftBtn === "setup" && "active"}`} onClick={() => { setActivLefteBtn("setup") }}>Setup</button>
          </div>
          <div className='scrExeButton'>
            {/* <div className="toggleBtn"></div> */}
            <div className='screxe' style={{ display: 'flex', justifyContent: 'end', gap: '2px' }}>
              <button
                className='buttonSize'
                onMouseEnter={() => setIsHoverUpload(true)}
                onMouseLeave={() => setIsHoverUpload(false)}
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
                  marginLeft: '10px',
                  marginRight: '0'
                }}
              >
                <FaFileUpload size={15} />
                {isHoverUpload && (
                  <span className="hoverText" style={{
                    visibility: isHoverUpload ? 'visible' : 'hidden',
                    backgroundColor: '#ffffff',
                    color: '#000000',
                    textAlign: 'center',
                    padding: '5px',
                    position: 'absolute',
                    bottom: '-30px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    opacity: isHoverUpload ? 1 : 0,
                    transition: 'opacity 0.3s',
                    whiteSpace: 'nowrap',
                    zIndex: 1
                  }}>
                    Upload Excel
                  </span>
                )}
                <input
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={handleFileUpload}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    opacity: 0,
                    cursor: 'pointer',
                  }}
                />
              </button>

              <button
                className='buttonSize'
                onMouseEnter={() => setIsHoverDownload(true)}
                onMouseLeave={() => setIsHoverDownload(false)}
                onClick={downloadExcel} // Trigger the download on button click
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
                  marginLeft: '10px'
                }}
              >
                <FaFileDownload size={15} />
                {isHoverDownload && (
                  <span className="hoverText" style={{
                    visibility: isHoverDownload ? 'visible' : 'hidden',
                    backgroundColor: '#ffffff',
                    color: '#000000',
                    textAlign: 'center',
                    padding: '5px',
                    position: 'absolute',
                    bottom: '-30px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    opacity: isHoverDownload ? 1 : 0,
                    transition: 'opacity 0.3s',
                    whiteSpace: 'nowrap',
                    zIndex: 1
                  }}>
                    Download Excel
                  </span>
                )}
              </button>

              <button
                className='buttonSize'
                onMouseEnter={() => setIsHoverScriptify(true)}
                onMouseLeave={() => setIsHoverScriptify(false)}
                onClick={handleRunButtonClick}
                style={{
                  position: 'relative',
                  display: 'inline-flex',
                  alignItems: 'center',
                  backgroundColor: isClicked ? 'rgba(50, 150, 50, 0.8)' : 'rgb(65, 105, 121)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  padding: '8px 12px',
                  cursor: 'pointer',
                  marginRight: '0',
                  boxShadow: isClicked ? '0 4px 10px rgba(0, 0, 0, 0.2)' : '0 2px 5px rgba(0, 0, 0, 0.1)',
                  transition: 'background-color 0.3s, box-shadow 0.3s', // Smooth transitions for background and shadow
                }}
              >
                <FaPlay size={15} />
                {isHoverScriptify && (
                  <span className="hoverText" style={{
                    visibility: isHoverScriptify ? 'visible' : 'hidden',
                    backgroundColor: '#ffffff',
                    color: '#000000',
                    textAlign: 'center',
                    padding: '5px',
                    position: 'absolute',
                    bottom: '-30px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    opacity: isHoverScriptify ? 1 : 0,
                    transition: 'opacity 0.3s',
                    whiteSpace: 'nowrap',
                    zIndex: 1
                  }}>
                    Execute
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {activeLeftBtn === "matrix" && <MatrixInput direction={setupData.direction} matrixData={matrixData} setMatrixData={setMatrixData} tableData={tableData} LocalData={LocalData} columns={matrixcolumns} setColumns={setMatrixColumns} topCell={topCell} setTopCell={setTopCell} firstRowSelectValues={firstRowSelectValues} setFirstRowSelectValues={setFirstRowSelectValues} setupGif={setupGif} setSetupGif={setSetupGif} toggleSetupGif={toggleSetupGif} setLocalStorage={setLocalStorage} getLocalStorage={getLocalStorage} />}

        {activeLeftBtn === "info" && <DynamicTable data={tableData} setData={setTableData} columns={columns} setColumns={setColumns} setupGif={setupGif} setSetupGif={setSetupGif} toggleSetupGif={toggleSetupGif} />}

        {activeLeftBtn === "local" && <LocalPinInfo data={LocalData} setData={setLocalData} matrixData={matrixData} firstRowSelectValues={firstRowSelectValues} setupGif={setupGif} setSetupGif={setSetupGif} toggleSetupGif={toggleSetupGif} />}

        {activeLeftBtn === "setup" && <Setup data={setupData} setData={setSetupData} setupGif={setupGif} setSetupGif={setSetupGif} toggleSetupGif={toggleSetupGif} tableData={tableData} setTableData={setTableData} LocalData={LocalData} setLocalData={setLocalData} matrixData={matrixData} setMatrixData={setMatrixData} firstRowSelectValues={firstRowSelectValues} setFirstRowSelectValues={setFirstRowSelectValues} matrixcolumns={matrixcolumns} setMatrixColumns={setMatrixColumns} />}

      </div>

      <div className="homeRightContainer">
        <div className="OperationLeftButtonBar">
          <button className={`layerLeftBtn1 pointer ${activeRightBtn === "help" && "active"}`} onClick={() => { setActivRighteBtn("help") }}>Help</button>
          <button className={`layerLeftBtn1 pointer ${activeRightBtn === "gif" && "active"}`} onClick={() => { setActivRighteBtn("gif") }}>GIF</button>
        </div>

        <div className='rightBody'>
          {/* For Help Tab */}
          {activeRightBtn === "help" && (
            <div style={{ width: '100%', height: '504px', border: '1px solid #ccc', backgroundColor: 'rgb(36, 37, 43)', position: 'relative' }}>

              {isLoading && (
                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                  <div className="loader"></div>
                </div>
              )}
              {/* Setup Tab */}
              {setupGif.Offset && (
                <iframe
                  src="https://www.sldttc.org/allpdf/21583473018.pdf"
                  width="100%"
                  height="100%"
                  title="PDF Viewer"
                  style={{
                    border: '0.5px solid black',
                    display: 'block',
                    boxSizing: 'border-box'
                  }}
                  onLoad={handleIframeLoad} // Trigger when iframe finishes loading
                />
              )}

              {setupGif.direction && (
                <iframe
                  src="https://www.sldttc.org/allpdf/21583473018.pdf"
                  width="100%"
                  height="100%"
                  title="PDF Viewer"
                  style={{
                    border: '0.5px solid black',
                    display: 'block',
                    boxSizing: 'border-box'
                  }}
                  onLoad={handleIframeLoad} // Trigger when iframe finishes loading
                />
              )}

              {setupGif["Layer Number"] && (
                <iframe
                  src="https://www.sldttc.org/allpdf/21583473018.pdf"
                  width="100%"
                  height="100%"
                  title="PDF Viewer"
                  style={{
                    border: '0.5px solid black',
                    display: 'block',
                    boxSizing: 'border-box'
                  }}
                  onLoad={handleIframeLoad} // Trigger when iframe finishes loading
                />
              )}

              {setupGif["Label Number"] && (
                <iframe
                  src="https://www.sldttc.org/allpdf/21583473018.pdf"
                  width="100%"
                  height="100%"
                  title="PDF Viewer"
                  style={{
                    border: '0.5px solid black',
                    display: 'block',
                    boxSizing: 'border-box'
                  }}
                  onLoad={handleIframeLoad} // Trigger when iframe finishes loading
                />
              )}

              {setupGif["Blockage Layer"] && (
                <iframe
                  src="https://www.sldttc.org/allpdf/21583473018.pdf"
                  width="100%"
                  height="100%"
                  title="PDF Viewer"
                  style={{
                    border: '0.5px solid black',
                    display: 'block',
                    boxSizing: 'border-box'
                  }}
                  onLoad={handleIframeLoad} // Trigger when iframe finishes loading
                />
              )}

              {setupGif.localOffset && (
                <iframe
                  src="https://www.sldttc.org/allpdf/21583473018.pdf"
                  width="100%"
                  height="100%"
                  title="PDF Viewer"
                  style={{
                    border: '0.5px solid black',
                    display: 'block',
                    boxSizing: 'border-box'
                  }}
                  onLoad={handleIframeLoad} // Trigger when iframe finishes loading
                />
              )}

              {setupGif.localOffsetAdditional && (
                <iframe
                  src="https://www.sldttc.org/allpdf/21583473018.pdf"
                  width="100%"
                  height="100%"
                  title="PDF Viewer"
                  style={{
                    border: '0.5px solid black',
                    display: 'block',
                    boxSizing: 'border-box'
                  }}
                  onLoad={handleIframeLoad} // Trigger when iframe finishes loading
                />
              )}

              {setupGif.side && (
                <iframe
                  src="https://www.sldttc.org/allpdf/21583473018.pdf"
                  width="100%"
                  height="100%"
                  title="PDF Viewer"
                  style={{
                    border: '0.5px solid black',
                    display: 'block',
                    boxSizing: 'border-box'
                  }}
                  onLoad={handleIframeLoad} // Trigger when iframe finishes loading
                />
              )}

              {setupGif.widthsetup && (
                <iframe
                  src="https://www.sldttc.org/allpdf/21583473018.pdf"
                  width="100%"
                  height="100%"
                  title="PDF Viewer"
                  style={{
                    border: '0.5px solid black',
                    display: 'block',
                    boxSizing: 'border-box'
                  }}
                  onLoad={handleIframeLoad} // Trigger when iframe finishes loading
                />
              )}

              {setupGif.Length && (
                <iframe
                  src="https://www.sldttc.org/allpdf/21583473018.pdf"
                  width="100%"
                  height="100%"
                  title="PDF Viewer"
                  style={{
                    border: '0.5px solid black',
                    display: 'block',
                    boxSizing: 'border-box'
                  }}
                  onLoad={handleIframeLoad} // Trigger when iframe finishes loading
                />
              )}

              {setupGif.Spacing && (
                <iframe
                  src="https://www.sldttc.org/allpdf/21583473018.pdf"
                  width="100%"
                  height="100%"
                  title="PDF Viewer"
                  style={{
                    border: '0.5px solid black',
                    display: 'block',
                    boxSizing: 'border-box'
                  }}
                  onLoad={handleIframeLoad} // Trigger when iframe finishes loading
                />
              )}

              {setupGif.localLayerNumber && (
                <iframe
                  src="https://www.sldttc.org/allpdf/21583473018.pdf"
                  width="100%"
                  height="100%"
                  title="PDF Viewer"
                  style={{
                    border: '0.5px solid black',
                    display: 'block',
                    boxSizing: 'border-box'
                  }}
                  onLoad={handleIframeLoad} // Trigger when iframe finishes loading
                />
              )}

              {setupGif.localLabelNumber && (
                <iframe
                  src="https://www.sldttc.org/allpdf/21583473018.pdf"
                  width="100%"
                  height="100%"
                  title="PDF Viewer"
                  style={{
                    border: '0.5px solid black',
                    display: 'block',
                    boxSizing: 'border-box'
                  }}
                  onLoad={handleIframeLoad} // Trigger when iframe finishes loading
                />
              )}

              {setupGif.localBlockageLayer && (
                <iframe
                  src="https://www.sldttc.org/allpdf/21583473018.pdf"
                  width="100%"
                  height="100%"
                  title="PDF Viewer"
                  style={{
                    border: '0.5px solid black',
                    display: 'block',
                    boxSizing: 'border-box'
                  }}
                  onLoad={handleIframeLoad} // Trigger when iframe finishes loading
                />
              )}

              {setupGif["Minimum Width"] && (
                <iframe
                  src="https://www.sldttc.org/allpdf/21583473018.pdf"
                  width="100%"
                  height="100%"
                  title="PDF Viewer"
                  style={{
                    border: '0.5px solid black',
                    display: 'block',
                    boxSizing: 'border-box'
                  }}
                  onLoad={handleIframeLoad} // Trigger when iframe finishes loading
                />
              )}

              {setupGif["Spacing To Pin"] && (
                <iframe
                  src="https://www.sldttc.org/allpdf/21583473018.pdf"
                  width="100%"
                  height="100%"
                  title="PDF Viewer"
                  style={{
                    border: '0.5px solid black',
                    display: 'block',
                    boxSizing: 'border-box'
                  }}
                  onLoad={handleIframeLoad} // Trigger when iframe finishes loading
                />
              )}

              {setupGif["Size"] && (
                <iframe
                  src="https://www.sldttc.org/allpdf/21583473018.pdf"
                  width="100%"
                  height="100%"
                  title="PDF Viewer"
                  style={{
                    border: '0.5px solid black',
                    display: 'block',
                    boxSizing: 'border-box'
                  }}
                  onLoad={handleIframeLoad} // Trigger when iframe finishes loading
                />
              )}

              {setupGif["Enclosure"] && (
                <iframe
                  src="https://www.sldttc.org/allpdf/21583473018.pdf"
                  width="100%"
                  height="100%"
                  title="PDF Viewer"
                  style={{
                    border: '0.5px solid black',
                    display: 'block',
                    boxSizing: 'border-box'
                  }}
                  onLoad={handleIframeLoad} // Trigger when iframe finishes loading
                />
              )}

              {setupGif.orientation && (
                <iframe
                  src="https://www.sldttc.org/allpdf/21583473018.pdf"
                  width="100%"
                  height="100%"
                  title="PDF Viewer"
                  style={{
                    border: '0.5px solid black',
                    display: 'block',
                    boxSizing: 'border-box'
                  }}
                  onLoad={handleIframeLoad} // Trigger when iframe finishes loading
                />
              )}

              {setupGif.Precision && (
                <iframe
                  src="https://www.sldttc.org/allpdf/21583473018.pdf"
                  width="100%"
                  height="100%"
                  title="PDF Viewer"
                  style={{
                    border: '0.5px solid black',
                    display: 'block',
                    boxSizing: 'border-box'
                  }}
                  onLoad={handleIframeLoad} // Trigger when iframe finishes loading
                />
              )}

              {setupGif.LimitToSize && (
                <iframe
                  src="https://www.sldttc.org/allpdf/21583473018.pdf"
                  width="100%"
                  height="100%"
                  title="PDF Viewer"
                  style={{
                    border: '0.5px solid black',
                    display: 'block',
                    boxSizing: 'border-box'
                  }}
                  onLoad={handleIframeLoad} // Trigger when iframe finishes loading
                />
              )}

              {setupGif["Boundary Layer"] && (
                <iframe
                  src="https://www.sldttc.org/allpdf/21583473018.pdf"
                  width="100%"
                  height="100%"
                  title="PDF Viewer"
                  style={{
                    border: '0.5px solid black',
                    display: 'block',
                    boxSizing: 'border-box'
                  }}
                  onLoad={handleIframeLoad} // Trigger when iframe finishes loading
                />
              )}
              {/* Local Pin Info */}

              {setupGif.cellName && (
                <iframe
                  src="https://www.sldttc.org/allpdf/21583473018.pdf"
                  width="100%"
                  height="100%"
                  title="PDF Viewer"
                  style={{
                    border: '0.5px solid black',
                    display: 'block',
                    boxSizing: 'border-box'
                  }}
                  onLoad={handleIframeLoad} // Trigger when iframe finishes loading
                />
              )}

              {setupGif.signalNames && (
                <iframe
                  src="https://www.sldttc.org/allpdf/21583473018.pdf"
                  width="100%"
                  height="100%"
                  title="PDF Viewer"
                  style={{
                    border: '0.5px solid black',
                    display: 'block',
                    boxSizing: 'border-box'
                  }}
                  onLoad={handleIframeLoad} // Trigger when iframe finishes loading
                />
              )}

              {setupGif.Repetition && (
                <iframe
                  src="https://www.sldttc.org/allpdf/21583473018.pdf"
                  width="100%"
                  height="100%"
                  title="PDF Viewer"
                  style={{
                    border: '0.5px solid black',
                    display: 'block',
                    boxSizing: 'border-box'
                  }}
                  onLoad={handleIframeLoad} // Trigger when iframe finishes loading
                />
              )}
              {/* Global Pin Info */}
              {setupGif.globalPins && (
                <iframe
                  src="https://www.sldttc.org/allpdf/21583473018.pdf"
                  width="100%"
                  height="100%"
                  title="PDF Viewer"
                  style={{
                    border: '0.5px solid black',
                    display: 'block',
                    boxSizing: 'border-box'
                  }}
                  onLoad={handleIframeLoad} // Trigger when iframe finishes loading
                />
              )}

              {setupGif.Width && (
                <iframe
                  src="https://www.sldttc.org/allpdf/21583473018.pdf"
                  width="100%"
                  height="100%"
                  title="PDF Viewer"
                  style={{
                    border: '0.5px solid black',
                    display: 'block',
                    boxSizing: 'border-box'
                  }}
                  onLoad={handleIframeLoad} // Trigger when iframe finishes loading
                />
              )}

              {setupGif.selfSpacing && (
                <iframe
                  src="https://www.sldttc.org/allpdf/21583473018.pdf"
                  width="100%"
                  height="100%"
                  title="PDF Viewer"
                  style={{
                    border: '0.5px solid black',
                    display: 'block',
                    boxSizing: 'border-box'
                  }}
                  onLoad={handleIframeLoad} // Trigger when iframe finishes loading
                />
              )}

              {setupGif.spaceToNext && (
                <iframe
                  src="https://www.sldttc.org/allpdf/21583473018.pdf"
                  width="100%"
                  height="100%"
                  title="PDF Viewer"
                  style={{
                    border: '0.5px solid black',
                    display: 'block',
                    boxSizing: 'border-box'
                  }}
                  onLoad={handleIframeLoad} // Trigger when iframe finishes loading
                />
              )}

              {setupGif.Repetitions && (
                <iframe
                  src="https://www.sldttc.org/allpdf/21583473018.pdf"
                  width="100%"
                  height="100%"
                  title="PDF Viewer"
                  style={{
                    border: '0.5px solid black',
                    display: 'block',
                    boxSizing: 'border-box'
                  }}
                  onLoad={handleIframeLoad} // Trigger when iframe finishes loading
                />
              )}
              {setupGif.Clubbing && (
                <iframe
                  src="https://www.sldttc.org/allpdf/21583473018.pdf"
                  width="100%"
                  height="100%"
                  title="PDF Viewer"
                  style={{
                    border: '0.5px solid black',
                    display: 'block',
                    boxSizing: 'border-box'
                  }}
                  onLoad={handleIframeLoad} // Trigger when iframe finishes loading
                />
              )}
              {/* Matrix Input */}

              {setupGif.top && (
                <iframe
                  src="https://www.sldttc.org/allpdf/21583473018.pdf"
                  width="100%"
                  height="100%"
                  title="PDF Viewer"
                  style={{
                    border: '0.5px solid black',
                    display: 'block',
                    boxSizing: 'border-box'
                  }}
                  onLoad={handleIframeLoad} // Trigger when iframe finishes loading
                />
              )}
              {setupGif.GlobalPinsdroupdown && (
                <iframe
                  src="https://www.sldttc.org/allpdf/21583473018.pdf"
                  width="100%"
                  height="100%"
                  title="PDF Viewer"
                  style={{
                    border: '0.5px solid black',
                    display: 'block',
                    boxSizing: 'border-box'
                  }}
                  onLoad={handleIframeLoad} // Trigger when iframe finishes loading
                />
              )}
              {setupGif.GlobalHorPinsdroupdown && (
                <iframe
                  src="https://www.sldttc.org/allpdf/21583473018.pdf"
                  width="100%"
                  height="100%"
                  title="PDF Viewer"
                  style={{
                    border: '0.5px solid black',
                    display: 'block',
                    boxSizing: 'border-box'
                  }}
                  onLoad={handleIframeLoad} // Trigger when iframe finishes loading
                />
              )}
              {setupGif.WidthNumric && (
                <iframe
                  src="https://www.sldttc.org/allpdf/21583473018.pdf"
                  width="100%"
                  height="100%"
                  title="PDF Viewer"
                  style={{
                    border: '0.5px solid black',
                    display: 'block',
                    boxSizing: 'border-box'
                  }}
                  onLoad={handleIframeLoad} // Trigger when iframe finishes loading
                />
              )}
              {setupGif.HightNumric && (
                <iframe
                  src="https://www.sldttc.org/allpdf/21583473018.pdf"
                  width="100%"
                  height="100%"
                  title="PDF Viewer"
                  style={{
                    border: '0.5px solid black',
                    display: 'block',
                    boxSizing: 'border-box'
                  }}
                  onLoad={handleIframeLoad} // Trigger when iframe finishes loading
                />
              )}
              {setupGif.MatrixAlphanumric && (
                <iframe
                  src="https://www.sldttc.org/allpdf/21583473018.pdf"
                  width="100%"
                  height="100%"
                  title="PDF Viewer"
                  style={{
                    border: '0.5px solid black',
                    display: 'block',
                    boxSizing: 'border-box'
                  }}
                  onLoad={handleIframeLoad} // Trigger when iframe finishes loading
                />
              )}

            </div>
          )}
          {/* For Gif Tab */}
          {activeRightBtn === "gif" && (
            <div style={{ width: '100%', height: '504px', border: '1px solid #ccc', backgroundColor: 'rgb(36, 37, 43)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>

              {/* Setup Gif Info */}
              {/* Global pin of Setup Gif */}
              {setupGif.Offset && (
                <img
                  src={globalOffset}
                  style={{ height: '100%', width: '100%', objectFit: 'contain' }}
                  alt="Description"
                />
              )}
              {setupGif.direction && (
                <img
                  src={"https://media.giphy.com/media/3oEjI6SIIHBdRxq5L6/giphy.gif"}
                  style={{ height: '100%', width: '100%', objectFit: 'contain' }}
                  alt="Description"
                />
              )}
              {setupGif["Layer Number"] && (
                <img
                  src={globalOffset}
                  style={{ height: '100%', width: '100%', objectFit: 'contain' }}
                  alt="Description"
                />
              )}
              {setupGif["Label Number"] && (
                <img
                  src={"https://media.giphy.com/media/3oEjI6SIIHBdRxq5L6/giphy.gif"}
                  style={{ height: '100%', width: '100%', objectFit: 'contain' }}
                  alt="Description"
                />
              )}
              {setupGif["Blockage Layer"] && (
                <img
                  src={globalOffset}
                  style={{ height: '100%', width: '100%', objectFit: 'contain' }}
                  alt="Description"
                />
              )}
              {/* Local Pin of Setup Gif */}
              {setupGif.localOffset && (
                <img
                  src={"https://media.giphy.com/media/3oEjI6SIIHBdRxq5L6/giphy.gif"}
                  style={{ height: '100%', width: '100%', objectFit: 'contain' }}
                  alt="Description"
                />
              )}
              {setupGif.localOffsetAdditional && (
                <img
                  src={globalOffset}
                  style={{ height: '100%', width: '100%', objectFit: 'contain' }}
                  alt="Description"
                />
              )}
              {setupGif.side && (
                <img
                  src={"https://media.giphy.com/media/3oEjI6SIIHBdRxq5L6/giphy.gif"}
                  style={{ height: '100%', width: '100%', objectFit: 'contain' }}
                  alt="Description"
                />
              )}
              {setupGif.widthsetup && (
                <img
                  src={"https://media.giphy.com/media/3oEjI6SIIHBdRxq5L6/giphy.gif"}
                  style={{ height: '100%', width: '100%', objectFit: 'contain' }}
                  alt="Description"
                />
              )}
              {setupGif.Length && (
                <img
                  src={"https://media.giphy.com/media/3oEjI6SIIHBdRxq5L6/giphy.gif"}
                  style={{ height: '100%', width: '100%', objectFit: 'contain' }}
                  alt="Description"
                />
              )}
              {setupGif.Spacing && (
                <img
                  src={globalOffset}
                  style={{ height: '100%', width: '100%', objectFit: 'contain' }}
                  alt="Description"
                />
              )}
              {setupGif.localLayerNumber && (
                <img
                  src={"https://media.giphy.com/media/3oEjI6SIIHBdRxq5L6/giphy.gif"}
                  style={{ height: '100%', width: '100%', objectFit: 'contain' }}
                  alt="Description"
                />
              )}
              {setupGif.localLabelNumber && (
                <img
                  src={"https://media.giphy.com/media/3oEjI6SIIHBdRxq5L6/giphy.gif"}
                  style={{ height: '100%', width: '100%', objectFit: 'contain' }}
                  alt="Description"
                />
              )}
              {setupGif.localBlockageLayer && (
                <img
                  src={"https://media.giphy.com/media/3oEjI6SIIHBdRxq5L6/giphy.gif"}
                  style={{ height: '100%', width: '100%', objectFit: 'contain' }}
                  alt="Description"
                />
              )}
              {setupGif["Minimum Width"] && (
                <img
                  src={globalOffset}
                  style={{ height: '100%', width: '100%', objectFit: 'contain' }}
                  alt="Description"
                />
              )}
              {setupGif["Spacing To Pin"] && (
                <img
                  src={globalOffset}
                  style={{ height: '100%', width: '100%', objectFit: 'contain' }}
                  alt="Description"
                />
              )}
              {setupGif["Size"] && (
                <img
                  src={"https://media.giphy.com/media/3oEjI6SIIHBdRxq5L6/giphy.gif"}
                  style={{ height: '100%', width: '100%', objectFit: 'contain' }}
                  alt="Description"
                />
              )}
              {setupGif["Enclosure"] && (
                <img
                  src={globalOffset}
                  style={{ height: '100%', width: '100%', objectFit: 'contain' }}
                  alt="Description"
                />
              )}
              {setupGif.orientation && (
                <img
                  src={"https://media.giphy.com/media/3oEjI6SIIHBdRxq5L6/giphy.gif"}
                  style={{ height: '100%', width: '100%', objectFit: 'contain' }}
                  alt="Description"
                />
              )}
              {setupGif["Unit"] && (
                <img
                  src={"https://media.giphy.com/media/3oEjI6SIIHBdRxq5L6/giphy.gif"}
                  style={{ height: '100%', width: '100%', objectFit: 'contain' }}
                  alt="Description"
                />
              )}
              {setupGif.Precision && (
                <img
                  src={globalOffset}
                  style={{ height: '100%', width: '100%', objectFit: 'contain' }}
                  alt="Description"
                />
              )}
              {setupGif.LimitToSize && (
                <img
                  src={globalOffset}
                  style={{ height: '100%', width: '100%', objectFit: 'contain' }}
                  alt="Description"
                />
              )}
              {setupGif["Boundary Layer"] && (
                <img
                  src={globalOffset}
                  style={{ height: '100%', width: '100%', objectFit: 'contain' }}
                  alt="Description"
                />
              )}

              {/* Local Pin Info */}
              {setupGif.cellName && (
                <img
                  src={globalOffset}
                  style={{ height: '100%', width: '100%', objectFit: 'contain' }} // or 'cover' based on your needs
                  alt="cell name"
                />
              )}
              {setupGif.signalNames && (
                <img
                  src={"https://media.giphy.com/media/3oEjI6SIIHBdRxq5L6/giphy.gif"}
                  style={{ height: '100%', width: '100%', objectFit: 'contain' }} // or 'cover' based on your needs
                  alt="cell name"
                />
              )}
              {setupGif.Repetition && (
                <img
                  src={globalOffset}
                  style={{ height: '100%', width: '100%', objectFit: 'contain' }} // or 'cover' based on your needs
                  alt="cell name"
                />
              )}
              {/* Global Pin Info */}
              {setupGif.globalPins && (
                <img
                  src={globalOffset}
                  style={{ height: '100%', width: '100%', objectFit: 'contain' }} // or 'cover' based on your needs
                  alt="cell name"
                />
              )}
              {setupGif.Width && (
                <img
                  src={globalOffset}
                  style={{ height: '100%', width: '100%', objectFit: 'contain' }} // or 'cover' based on your needs
                  alt="cell name"
                />
              )}
              {setupGif.selfSpacing && (
                <img
                  src={globalOffset}
                  style={{ height: '100%', width: '100%', objectFit: 'contain' }} // or 'cover' based on your needs
                  alt="cell name"
                />
              )}
              {setupGif.spaceToNext && (
                <img
                  src={globalOffset}
                  style={{ height: '100%', width: '100%', objectFit: 'contain' }} // or 'cover' based on your needs
                  alt="cell name"
                />
              )}
              {setupGif.Repetitions && (
                <img
                  src={globalOffset}
                  style={{ height: '100%', width: '100%', objectFit: 'contain' }} // or 'cover' based on your needs
                  alt="cell name"
                />
              )}
              {setupGif.Clubbing && (
                <img
                  src={globalOffset}
                  style={{ height: '100%', width: '100%', objectFit: 'contain' }} // or 'cover' based on your needs
                  alt="cell name"
                />
              )}


              {/* Matrix Input */}
              {setupGif.top && (
                <img
                  src={"https://media.giphy.com/media/3oEjI6SIIHBdRxq5L6/giphy.gif"}
                  style={{ height: '100%', width: '100%', objectFit: 'contain' }} // or 'cover' based on your needs
                  alt="cell name"
                />
              )}
              {setupGif.GlobalPinsdroupdown && (
                <img
                  src={globalOffset}
                  style={{ height: '100%', width: '100%', objectFit: 'contain' }} // or 'cover' based on your needs
                  alt="cell name"
                />
              )}
              {setupGif.GlobalHorPinsdroupdown && (
                <img
                  src={"https://media.giphy.com/media/3oEjI6SIIHBdRxq5L6/giphy.gif"}
                  style={{ height: '100%', width: '100%', objectFit: 'contain' }} // or 'cover' based on your needs
                  alt="cell name"
                />
              )}

              {setupGif.WidthNumric && (
                <img
                  src={globalOffset}
                  style={{ height: '100%', width: '100%', objectFit: 'contain' }} // or 'cover' based on your needs
                  alt="cell name"
                />
              )}
              {setupGif.HightNumric && (
                <img
                  src={globalOffset}
                  style={{ height: '100%', width: '100%', objectFit: 'contain' }} // or 'cover' based on your needs
                  alt="cell name"
                />
              )}
              {setupGif.MatrixAlphanumric && (
                <img
                  src={globalOffset}
                  style={{ height: '100%', width: '100%', objectFit: 'contain' }} // or 'cover' based on your needs
                  alt="cell name"
                />
              )}

            </div>

          )}
        </div>
      </div>
    </div>
  );
}

export default App;