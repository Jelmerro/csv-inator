//Copyright @ Jelmer van Arnhem | Licensed as free software (MIT)
/* global TABLE */
"use strict"

const history = []
let currentVersion = 0

const reset = () => {
    history.splice(0, history.length)
}

const goBack = () => {
    if (currentVersion < 1) {
        return
    }
    currentVersion -= 1
    restore()
}

const goForward = () => {
    if (currentVersion + 2 > history.length) {
        return
    }
    currentVersion += 1
    restore()
}

const restore = () => {
    const json = JSON.parse(JSON.stringify(history[currentVersion]))
    const rows = []
    const columns = json.table.length / json.rows
    while (json.table.length > 0) {
        rows.push(json.table.splice(0, columns))
    }
    const csvTable = document.getElementById("csv")
    csvTable.innerHTML = ""
    for (const row of rows) {
        const csvRow = csvTable.insertRow(csvTable.rows.length)
        for (const csvData of row) {
            const csvCell = csvRow.insertCell(csvRow.children.length)
            const input = document.createElement("input")
            input.type = "text"
            input.value = csvData
            csvCell.appendChild(input)
        }
    }
    TABLE.setHandlers()
    document.querySelectorAll("#csv input")[json.selected].focus()
}

const newVersion = () => {
    while (history.length - 1 > currentVersion) {
        history.pop()
    }
    const json = {table: []}
    let index = 0
    json.rows = document.querySelectorAll("#csv tr").length
    for (const input of document.querySelectorAll("#csv input")) {
        json.table.push(input.value)
        if (input.className === "focussed") {
            json.selected = index
        }
        index += 1
    }
    history.push(json)
    currentVersion = history.length - 1
}

module.exports = {
    reset,
    goBack,
    goForward,
    newVersion
}
