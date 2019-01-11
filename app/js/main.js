//Copyright @ Jelmer van Arnhem | Licensed as free software (MIT)
"use strict"
/* eslint-disable no-unused-vars */

const fs = require("fs")
const path = require("path")
const { remote } = require("electron")
const { ipcRenderer } = require("electron")
const url = require("url")
const Papa = require("papaparse")
const STATUS = require("./js/status.js")
const TABLE = require("./js/tableactions.js")
const PARSER = require("./js/parser.js")
const FILE = require("./js/fileactions.js")
const KEYBOARD = require("./js/keyboard.js")
const HISTORY = require("./js/history.js")

FILE.empty()
ipcRenderer.on("arg", (event, file) => {
    if (fs.statSync(file).isFile()) {
        const filetype = file.split(".").pop()
        if (["csv", "tsv"].indexOf(filetype) !== -1) {
            PARSER.load(file)
        }
    }
})
