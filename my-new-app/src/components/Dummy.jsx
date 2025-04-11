import React, { useState } from 'react';

const JsonDownloader = () => {
    const [jsonData] = useState({
        matrix_inputs: {
            top_cell: "TOP",
            rows: [
                ["Des11", "Des12", "Des13", "Des14"],
                ["Des21", "Des22", "", "Des24"],
                ["", "Des32", "Des33", ""],
                ["Des41", "", "Des43", "Des44"],
            ],
            height: [20, 25, 23.2, 21.8],
            width: [7.8, 25, 30.5, 40.1],
            global_net: [
                ["Vdd", "Vss"],
                [],
                ["Vdd"],
                ["Vss", "Vddp"],
            ],
        },
        layer_inputs: {
            power_metal: {
                layer_number: [7, 0],
                label_number: [7, 1],
                blockage_layer: [100, 0],
            },
            signal_metal: {
                layer_number: [
                    [1, 0],
                    [2, 0],
                    [3, 0],
                ],
                label_number: [
                    [1, 1],
                    [2, 1],
                    [3, 1],
                ],
                blockage_layer: [101, 0],
            },
            boundary_layer: [85, 0],
        },
        global_pin_info: [
            {
                name: "Vdd",
                width: 1.0,
                spacing: {
                    self: 0.5,
                    other: 0.8,
                },
                repetition: 3,
                clubbing: 2,
            },
            {
                name: "Vss",
                width: 1.3,
                spacing: {
                    self: 0.8,
                    other: 1.0,
                },
                repetition: 4,
                clubbing: 2,
            },
            {
                name: "Vddp",
                width: 0.5,
                spacing: {
                    self: 0.3,
                    other: 1.2,
                },
                repetition: 3,
                clubbing: 1,
            },
        ],
        local_pin_info: [
            { cell_name: "Des11", signal_name: "s1", repetition: 4 },
            { cell_name: "Des12", signal_name: "s2", repetition: 5 },
            { cell_name: "Des13", signal_name: "s3", repetition: 3 },
            { cell_name: "Des14", signal_name: "s4", repetition: 4 },
            { cell_name: "Des21", signal_name: "s5", repetition: 4 },
            { cell_name: "Des22", signal_name: "s6", repetition: 4 },
            { cell_name: "Des24", signal_name: "s7", repetition: 4 },
            { cell_name: "Des32", signal_name: "s8", repetition: 4 },
            { cell_name: "Des33", signal_name: "s9", repetition: 4 },
            { cell_name: "Des41", signal_name: "s10", repetition: 4 },
            { cell_name: "Des43", signal_name: "s11", repetition: 4 },
            { cell_name: "Des44", signal_name: "s12", repetition: 4 },
        ],
        setup: {
            global_pin: {
                offset: 0.5,
                direction: "horizontal",
            },
            local_pin: {
                offset: [0.3, 0.3],
                side: "right",
                width: 0.5,
                length: 1.0,
                spacing: 0.3,
            },
            blockage: {
                min_width: 0.2,
                spacing_to_pin: 0.1,
            },
            label: {
                enclosure: 0.005,
                size: 0.1,
                orientation: "R270",
            },
            precision: 1e-09,
            unit: 1e-06,
            limit_to_size: false,
        },
    });

    const downloadJson = () => {
        const json = JSON.stringify(jsonData, null, 2); // Convert state to JSON
        const blob = new Blob([json], { type: 'application/json' }); // Create a Blob
        const url = URL.createObjectURL(blob); // Create a URL for the Blob

        const link = document.createElement('a'); // Create a link element
        link.href = url;
        link.download = 'data.json'; // Specify the file name

        document.body.appendChild(link); // Append the link to the body
        link.click(); // Trigger the download
        document.body.removeChild(link); // Remove the link after download
        URL.revokeObjectURL(url); // Free up memory
    };

    return (
        <div>
            <button onClick={downloadJson}>Download JSON</button>
        </div>
    );
};

export default JsonDownloader;