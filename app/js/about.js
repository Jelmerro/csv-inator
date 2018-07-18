//Copyright @ Jelmer van Arnhem | Licensed as free software (MIT)
"use strict"

const { shell } = require("electron")
const { remote } = require("electron")

document.onkeydown = e => {
    if (e.keyCode === 27) {
        remote.getCurrentWindow().close()
    }
}
