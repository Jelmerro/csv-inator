//Copyright @ Jelmer van Arnhem | Licensed as free software (MIT)
"use strict";

const about = () => {
    const windowData = {
        parent: remote.getCurrentWindow(),
        modal: true,
        title: "About",
        width: 400,
        height: 400,
        transparent: true,
        resizable: false
    };
    const aboutModal = new remote.BrowserWindow(windowData);
    aboutModal.loadURL(url.format({
        pathname: path.join(__dirname, "../about.html"),
        protocol: "file:",
        slashes: true
    }));
    aboutModal.setMenu(null);
};

let currentFile = null;
const setCurrentFile = (filename) => {
    currentFile = filename;
    updateTitle();
};

const currentFilename = () => {
    return currentFile;
};

let unsavedChanges = false;
const setUnsavedChanges = unsaved => {
    unsavedChanges = unsaved;
    updateTitle();
};

const hasUnsavedChanges = () => {
    return unsavedChanges;
};

const updateTitle = () => {
    if (currentFile) {
        if (unsavedChanges) {
            remote.getCurrentWindow().setTitle(`csv-inator - Editing ${currentFile}`);
        } else {
            remote.getCurrentWindow().setTitle(`csv-inator - Viewing ${currentFile}`);
        }
    } else {
        if (unsavedChanges) {
            remote.getCurrentWindow().setTitle("csv-inator - Editing new file");
        } else {
            remote.getCurrentWindow().setTitle("csv-inator");
        }
    }
};

module.exports = {
    about,
    currentFilename,
    hasUnsavedChanges,
    setCurrentFile,
    setUnsavedChanges
};
