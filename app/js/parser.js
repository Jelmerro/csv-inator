//Copyright @ Jelmer van Arnhem | Licensed as free software (MIT)
"use strict";

const load = (file) => {
    const csvTable = document.getElementById("csv");
    csvTable.innerHTML = "";
    let longestRow = 0;
    Papa.parse(fs.createReadStream(file), {
        step: (papaData, parser) => {
            let csvRow = csvTable.insertRow(csvTable.rows.length);
            for (let papaRow of papaData.data) {
                if (papaRow.length > longestRow) {
                    longestRow = papaRow.length;
                }
                for (let csvData of papaRow) {
                    let csvCell = csvRow.insertCell(csvRow.children.length);
                    let input = document.createElement("input");
                    input.type = "text";
                    input.value = csvData;
                    csvCell.appendChild(input);
                }
            }
            FILE.enableOrDisableSaving(true, papaData.meta.delimiter.replace("\t", "\\t"));
        },
        error: err => {
            remote.dialog.showMessageBox(remote.getCurrentWindow(), {
                title: "Error",
                type: "error",
                message: "There was an error reading the file",
                detail: String(err),
                buttons: ["Ok"]
            });
        },
        complete: () => {
            STATUS.setCurrentFile(file);
            TABLE.sanitizeColums(longestRow);
            TABLE.setHandlers();
        }
    });
};

const dump = file => {
    const csvTable = document.getElementById("csv");
    let csv = Papa.unparse(tableToArray(csvTable), {
        delimiter: document.getElementById("delimiter").value.replace("\\t", "\t"),
        newline: "\n"
    });
    csv += "\n";
    try {
        fs.writeFileSync(file, csv);
        STATUS.setUnsavedChanges(false);
        return true;
    } catch (err) {
        remote.dialog.showMessageBox(remote.getCurrentWindow(), {
            title: "Error",
            type: "error",
            message: "There was an error saving the file",
            detail: String(err),
            buttons: ["Ok"]
        });
        return false;
    }
};

const tableToArray = table => {
    const result = [];
    const rows = table.rows;
    for (let x = 0; x < rows.length; x++) {
        let cells = rows[x].cells;
        let z = [];
        for (let y = 0; y < cells.length; y++) {
            z.push(cells[y].getElementsByTagName("input")[0].value);
        }
        result.push(z);
    }
    return result; 
};

module.exports = {
    load,
    dump
};
