//Copyright @ Jelmer van Arnhem | Licensed as free software (MIT)
/* global STATUS FILE TABLE remote */
"use strict"

remote.getCurrentWindow().on("close", () => {
    const shouldQuit = FILE.askForSave()
    if (shouldQuit) {
        remote.getCurrentWindow().destroy()
        remote.app.exit(0)
    }
})

document.onkeydown = e => {
    if (e.metaKey || e.altKey) {
        return
    }
    if (e.ctrlKey) {
        if (e.shiftKey) {
            if (e.keyCode === 68) {
                TABLE.remove("column")
            }
            if (e.keyCode === 82) {
                TABLE.add("row", "above")
            }
            if (e.keyCode === 84) {
                TABLE.add("column", "left")
            }
        } else {
            if (e.keyCode === 68) {
                TABLE.remove("row")
            }
            if (e.keyCode === 69) {
                if (STATUS.focussedCell) {
                    if (document.activeElement === STATUS.focussedCell) {
                        document.getElementById("delimiter").focus()
                    } else {
                        STATUS.focussedCell.focus()
                    }
                }
            }
            if (e.keyCode === 78) {
                FILE.empty()
            }
            if (e.keyCode === 79) {
                FILE.open()
            }
            if (e.keyCode === 81) {
                remote.getCurrentWindow().close()
            }
            if (e.keyCode === 82) {
                TABLE.add("row", "below")
            }
            if (e.keyCode === 83) {
                if (!document.getElementById("save").disabled) {
                    FILE.save()
                }
            }
            if (e.keyCode === 84) {
                TABLE.add("column", "right")
            }
        }
    } else if (e.keyCode === 112) {
        STATUS.about()
    }
}

module.exports = {}
