//Copyright @ Jelmer van Arnhem | Licensed as free software (MIT)
/* global STATUS FILE TABLE HISTORY remote */
"use strict"

remote.getCurrentWindow().on("close", () => {
    const shouldQuit = FILE.askForSave()
    if (shouldQuit) {
        remote.getCurrentWindow().destroy()
        remote.app.exit(0)
    }
})

document.onkeydown = e => {
    // Add shortcuts for actions
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
            if (e.keyCode === 89) {
                HISTORY.goForward()
            }
            if (e.keyCode === 90) {
                HISTORY.goBack()
            }
        }
    } else if (e.keyCode === 112) {
        STATUS.about()
    }
    // Allow certain built-in shortcuts
    if (e.ctrlKey && e.keyCode === 8) {
        return
    }
    if (e.ctrlKey && e.keyCode > 36 && e.keyCode < 41) {
        return
    }
    if (e.ctrlKey && e.keyCode === 65) {
        return
    }
    if (e.ctrlKey && e.keyCode === 67) {
        return
    }
    if (e.ctrlKey && e.keyCode === 86) {
        return
    }
    if (e.ctrlKey && e.keyCode === 88) {
        return
    }
    // Disable all others
    if (e.metaKey || e.altKey || e.ctrlKey) {
        e.preventDefault()
    }
}

module.exports = {}
