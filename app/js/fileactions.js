//Copyright @ Jelmer van Arnhem | Licensed as free software (MIT)
/* global STATUS TABLE PARSER remote */
"use strict"

const empty = () => {
    const shouldEmpty = askForSave()
    if (shouldEmpty) {
        const csvTable = document.getElementById("csv")
        csvTable.innerHTML = ""
        const csvRow = csvTable.insertRow(csvTable.rows.length)
        const csvCell = csvRow.insertCell(csvRow.children.length)
        const input = document.createElement("input")
        input.type = "text"
        input.value = ""
        csvCell.appendChild(input)
        enableOrDisableSaving(false)
        STATUS.setCurrentFile(null)
        enableOrDisableMenuItem("column-left", false)
        enableOrDisableMenuItem("column-right", false)
        enableOrDisableMenuItem("column-remove", false)
        enableOrDisableMenuItem("row-above", false)
        enableOrDisableMenuItem("row-below", false)
        enableOrDisableMenuItem("row-remove", false)
        TABLE.setHandlers()
    }
}

const enableOrDisableMenuItem = (elementId, enable) => {
    const element = document.getElementById(elementId)
    const image = element.getElementsByTagName("img")[0]
    if (enable) {
        element.disabled = ""
        image.src = image.src.replace("_grey.png", ".png")
    } else {
        element.disabled = "disabled"
        if (image.src.indexOf("_grey.png") === -1) {
            image.src = image.src.replace(".png", "_grey.png")
        }
    }
}

const enableOrDisableSaving = (enable, delimiter = "") => {
    if (enable) {
        enableOrDisableMenuItem("save", true)
        document.getElementById("delimiter").disabled = ""
        document.getElementById("delimiter").value = delimiter
    } else {
        enableOrDisableMenuItem("save", false)
        document.getElementById("delimiter").disabled = "disabled"
        document.getElementById("delimiter").value = delimiter
    }
}

const open = () => {
    const files = remote.dialog.showOpenDialog(remote.getCurrentWindow(), {
        title: "Open CSV file",
        filters: [
            {name: "Comma-seperated values file", extensions: ["csv"]},
            {name: "Tab-seperated values file", extensions: ["tsv"]}
        ]
    })
    if (files) {
        const shouldSwitch = askForSave()
        if (shouldSwitch) {
            PARSER.load(files[0])
        }
    }
}

const save = () => {
    const accepted = ["~", "|", ",", ".", ";", ":", "\\t", "\t", " "]
    const delimiter = document.getElementById("delimiter").value
    if (accepted.indexOf(delimiter) === -1) {
        remote.dialog.showMessageBox(remote.getCurrentWindow(), {
            title: "Warning",
            type: "warning",
            message: "The chosen delimiter can not be used",
            buttons: ["Ok"]
        })
        return null
    }
    let savetype = "CSV"
    let filter = {name: "Comma-seperated values file", extensions: ["csv"]}
    if (["\\t", "\t"].indexOf(delimiter) !== -1) {
        savetype = "TSV"
        filter = {name: "Tab-seperated values file", extensions: ["tsv"]}
    }
    const file = remote.dialog.showSaveDialog(remote.getCurrentWindow(), {
        title: `Save ${savetype} file`,
        defaultPath: STATUS.currentFilename(),
        filters: [filter]
    })
    if (file) {
        const success = PARSER.dump(file)
        if (!success) {
            return null
        }
    }
    return file
}

const askForSave = () => {
    if (!STATUS.hasUnsavedChanges()) {
        return true
    }
    const button = remote.dialog.showMessageBox(remote.getCurrentWindow(), {
        title: "Warning",
        type: "warning",
        message: "There are unsaved changes, what should we do about it?",
        buttons: [
            "Save now",
            "Discard changes",
            "Cancel"
        ]
    })
    if (button === 0) {
        return !!save()
    } else if (button === 1) {
        STATUS.setUnsavedChanges(false)
        return true
    }
    return false
}

module.exports = {
    empty,
    enableOrDisableMenuItem,
    enableOrDisableSaving,
    open,
    save,
    askForSave
}
