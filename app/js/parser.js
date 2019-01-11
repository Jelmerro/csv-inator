//Copyright @ Jelmer van Arnhem | Licensed as free software (MIT)
/* global Papa fs remote FILE STATUS TABLE HISTORY */
"use strict"

const load = file => {
    const csvTable = document.getElementById("csv")
    csvTable.innerHTML = ""
    let longestRow = 0
    Papa.parse(fs.createReadStream(file), {
        step: papaData => {
            const csvRow = csvTable.insertRow(csvTable.rows.length)
            for (const papaRow of papaData.data) {
                if (papaRow.length > longestRow) {
                    longestRow = papaRow.length
                }
                for (const csvData of papaRow) {
                    const csvCell = csvRow.insertCell(csvRow.children.length)
                    const input = document.createElement("input")
                    input.type = "text"
                    input.value = csvData
                    csvCell.appendChild(input)
                }
            }
            FILE.enableOrDisableSaving(
                true, papaData.meta.delimiter.replace("\t", "\\t"))
        },
        error: err => {
            remote.dialog.showMessageBox(remote.getCurrentWindow(), {
                title: "Error",
                type: "error",
                message: "There was an error reading the file",
                detail: String(err),
                buttons: ["Ok"]
            })
        },
        complete: () => {
            STATUS.setCurrentFile(file)
            TABLE.sanitizeColums(longestRow)
            HISTORY.reset()
            TABLE.setHandlers()
            HISTORY.newVersion()
        }
    })
}

const dump = file => {
    const csvTable = document.getElementById("csv")
    const delimiter = document.getElementById("delimiter").value
    let csv = Papa.unparse(tableToArray(csvTable), {
        delimiter: delimiter.replace("\\t", "\t"),
        newline: "\n"
    })
    csv += "\n"
    try {
        fs.writeFileSync(file, csv)
        STATUS.setUnsavedChanges(false)
        return true
    } catch (err) {
        remote.dialog.showMessageBox(remote.getCurrentWindow(), {
            title: "Error",
            type: "error",
            message: "There was an error saving the file",
            detail: String(err),
            buttons: ["Ok"]
        })
        return false
    }
}

const tableToArray = table => {
    const result = []
    const rows = table.rows
    for (let x = 0; x < rows.length; x++) {
        const cells = rows[x].cells
        const z = []
        for (let y = 0; y < cells.length; y++) {
            z.push(cells[y].getElementsByTagName("input")[0].value)
        }
        result.push(z)
    }
    return result
}

module.exports = {
    load,
    dump
}
