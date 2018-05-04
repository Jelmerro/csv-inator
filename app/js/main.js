//Copyright @ Jelmer van Arnhem | Licensed as free software (MIT)
"use strict";

const fs = require("fs");
const path = require("path");
const { remote } = require("electron");
const { ipcRenderer } = require("electron");
const url = require("url");
const Papa = require("papaparse");
const STATUS = require("./js/status.js");
const TABLE = require("./js/tableactions.js");
const PARSER = require("./js/parser.js");
const FILE = require("./js/fileactions.js");

remote.getCurrentWindow().on("close", e => {
    let shouldQuit = FILE.askForSave();
    if (shouldQuit) {
        remote.getCurrentWindow().destroy();
        remote.app.exit(0);
    }
});

FILE.empty();
ipcRenderer.on("arg", (event, file) => {
    if (fs.statSync(file).isFile()) {
        if (file.split(".").pop() === "csv") {
            PARSER.load(file);
        }
    }
});