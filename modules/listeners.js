import * as helper from './helpers.js';

let mouseDown = false;

// Listener for createGrid() and colorPaint()
function paintCell(event) {
    const colorPicker = document.getElementById("color-picker");

    if (mouseDown && event.target.className === "cell") {
        helper.changeBgCol(event, colorPicker.value);
    }
}

// Listener for rainbowPaint()
function paintCellRainbow(event) {
    const color = `rgb(${helper.rand255()}, ${helper.rand255()}, ${helper.rand255()})`;

    if (mouseDown && event.target.className === "cell") {
        helper.changeBgCol(event, color);
    }
}

// Listener for erasePaint()
function eraseCell(event) {
    if (mouseDown && event.target.className === "cell") {
        helper.changeBgCol(event, "white");
    }
}

export {
    paintCell,
    paintCellRainbow,
    eraseCell
};