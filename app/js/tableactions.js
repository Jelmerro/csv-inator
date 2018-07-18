//Copyright @ Jelmer van Arnhem | Licensed as free software (MIT)
/* global STATUS FILE */
"use strict"

const add = (type, position) => {
    if (type === "row") {
        if (STATUS.focussedCell) {
            let index = STATUS.focussedCell.parentNode.parentNode.rowIndex
            if (position === "below") {
                index += 1
            }
            const csvRow = document.getElementById("csv").insertRow(index)
            csvRow.innerHTML = STATUS.focussedCell.parentNode.parentNode.innerHTML
            STATUS.focussedCell.blur()
            STATUS.focussedCell.focus()
            STATUS.setUnsavedChanges(true)
        }
    } else if (type === "column") {
        if (STATUS.focussedCell) {
            let cellIndex = STATUS.focussedCell.parentNode.cellIndex
            if (position === "right") {
                cellIndex += 1
            }
            for (const row of document.getElementById("csv").rows) {
                const csvCell = row.insertCell(cellIndex)
                const input = document.createElement("input")
                input.type = "text"
                input.value = ""
                csvCell.appendChild(input)
            }
            if (cellIndex === document.getElementById("csv").rows[0].cells.length) {
                cellIndex -= 1
            }
            STATUS.focussedCell.blur()
            STATUS.focussedCell.focus()
            STATUS.setUnsavedChanges(true)
        }
    }
    setHandlers()
}

const remove = type => {
    if (type === "row") {
        if (document.getElementById("csv").rows.length > 1 && STATUS.focussedCell) {
            let rowIndex = STATUS.focussedCell.parentNode.parentNode.rowIndex
            const cellIndex = STATUS.focussedCell.parentNode.cellIndex
            document.getElementById("csv").deleteRow(rowIndex)
            if (rowIndex === document.getElementById("csv").rows.length) {
                rowIndex -= 1
            }
            STATUS.focussedCell = document.getElementById("csv").rows[rowIndex].cells[cellIndex].getElementsByTagName("input")[0]
            STATUS.focussedCell.focus()
            STATUS.setUnsavedChanges(true)
        }
    } else if (type === "column") {
        if (document.getElementById("csv").rows[0]) {
            if (document.getElementById("csv").rows[0].cells.length > 1 && STATUS.focussedCell) {
                const rowIndex = STATUS.focussedCell.parentNode.parentNode.rowIndex
                let cellIndex = STATUS.focussedCell.parentNode.cellIndex
                for (const row of document.getElementById("csv").rows) {
                    row.deleteCell(cellIndex)
                }
                if (cellIndex === document.getElementById("csv").rows[0].cells.length) {
                    cellIndex -= 1
                }
                STATUS.focussedCell = document.getElementById("csv").rows[rowIndex].cells[cellIndex].getElementsByTagName("input")[0]
                STATUS.focussedCell.focus()
                STATUS.setUnsavedChanges(true)
            }
        }
    }
    setHandlers()
}

const sanitizeColums = longestRow => {
    const rows = document.getElementById("csv").rows
    for (const row of rows) {
        while (row.cells.length < longestRow) {
            const csvCell = row.insertCell(row.cells.length)
            const input = document.createElement("input")
            input.type = "text"
            input.value = ""
            csvCell.appendChild(input)
        }
    }
}

const setHandlers = () => {
    const cells = document.getElementById("csv").getElementsByTagName("input")
    for (const input of cells) {
        input.oninput = () => {
            STATUS.setUnsavedChanges(true)
            FILE.enableOrDisableSaving(true, document.getElementById("delimiter").value)
        }
        input.onfocus = () => {
            for (const cell of cells) {
                cell.className = ""
            }
            STATUS.focussedCell = input
            input.className = "focussed"
            FILE.enableOrDisableMenuItem("column-left", true)
            FILE.enableOrDisableMenuItem("column-right", true)
            FILE.enableOrDisableMenuItem("row-above", true)
            FILE.enableOrDisableMenuItem("row-below", true)
            FILE.enableOrDisableMenuItem("column-remove", document.getElementById("csv").rows[0].cells.length > 1)
            FILE.enableOrDisableMenuItem("row-remove", document.getElementById("csv").rows.length > 1)
        }
        input.onkeydown = e => {
            if (e.ctrlKey || e.altKey || e.metaKey || !STATUS.focussedCell) {
                return
            }
            const cellIndex = STATUS.focussedCell.parentNode.cellIndex
            let rowIndex = STATUS.focussedCell.parentNode.parentNode.rowIndex
            if ((e.shiftKey && e.code === "Enter") || (!e.shiftKey && e.code === "ArrowUp")) {
                if (rowIndex > 0) {
                    rowIndex -= 1
                    STATUS.focussedCell = document.getElementById("csv").rows[rowIndex].cells[cellIndex].getElementsByTagName("input")[0]
                    STATUS.focussedCell.focus()
                    setHandlers()
                }
            } else if (e.code === "Enter" || e.code === "ArrowDown") {
                if (rowIndex < document.getElementById("csv").rows.length - 1) {
                    rowIndex += 1
                    STATUS.focussedCell = document.getElementById("csv").rows[rowIndex].cells[cellIndex].getElementsByTagName("input")[0]
                    STATUS.focussedCell.focus()
                    setHandlers()
                }
            }
        }
    }
    if (cells && !STATUS.focussedCell) {
        cells[0].focus()
    } else if (Array.from(cells).indexOf(STATUS.focussedCell) === -1) {
        cells[0].focus()
    }
}

module.exports = {
    add,
    remove,
    sanitizeColums,
    setHandlers
}
