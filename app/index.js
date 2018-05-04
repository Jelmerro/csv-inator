//Copyright @ Jelmer van Arnhem | Licensed as free software (MIT)
"use strict";

const electron = require("electron");
const path = require("path");
const url = require("url");
const BrowserWindow = electron.BrowserWindow;
let mainWindow;

electron.app.on("ready", () => {
    const isDev = process.execPath.indexOf("node_modules") !== -1;
    const args = process.argv.slice(1);
    for (let arg of args) {
        if (arg.startsWith("--")) {
            arg = arg.replace("--", "");
            if (arg === "help") {
                console.log("This is csv-inator: The evil invention of choice to edit csv files\n");
                console.log("Usage: csv-inator [options] <file>\n");
                console.log("The file will be opened on startup, the other options are:");
                console.log("\t--help\t\tShow this help output");
                console.log("\t--version\tShow the version information of csv-inator");
                electron.app.exit(0);
            } else if (arg === "version") {
                console.log("csv-inator 0.1.0 Copyright (C) 2018 Jelmer van Arnhem | Licensed MIT\n");
                console.log("This is free software; you are free to change and redistribute it.");
                console.log("There is NO WARRANTY, to the extent permitted by law.\n");
                electron.app.exit(0);
            } else {
                console.log(`Unsupported argument: '${arg}'`);
            }
            args.splice(args.indexOf(arg), 1);
        }
    }
    const windowData = {
        title: "csv-inator",
        width: 640,
        height: 640,
        transparent: true
    };
    if (isDev || process.execPath.indexOf("/app/") !== -1) {
        let image = electron.nativeImage.createFromPath(path.join(__dirname, "img/logo.png"));
        windowData.icon = image;
    }
    mainWindow = new BrowserWindow(windowData);
    mainWindow.setMenu(null);
    mainWindow.setMinimumSize(640, 640);
    mainWindow.on("close", e => {
        e.preventDefault();
    });
    mainWindow.on("closed", e => {
        electron.app.exit(0);
    });
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, "index.html"),
        protocol: "file:",
        slashes: true
    }));
    mainWindow.webContents.on("did-finish-load", () => {
        for (let arg of args) {
            mainWindow.webContents.send("arg", arg);
        }
    });
});
