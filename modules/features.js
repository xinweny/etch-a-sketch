import * as listener from './listeners.js';
import * as helper from './helpers.js';

let mouseDown = false;

// Create grid of dim x dim cells
function createGrid(dim) {
    const grid = document.querySelector(".grid");
    const gridSize = grid.clientWidth;

    // Create and insert cells into parent grid div
    for (let i = 0; i < dim ** 2; i++) {
        const cell = document.createElement("div");
        cell.classList.add("cell");
        cell.style.width = gridSize / dim + "px";
        cell.style.height = cell.style.width;

        grid.appendChild(cell);
    }

    return grid
}

// Dynamically update grid size when slider is moved and display the value
function updateGridSize(grid) {
    const slider = document.getElementById("slider");
    const dimension = document.getElementById("dimension");

    slider.addEventListener("input", () => {
        grid.innerHTML = "";
        createGrid(slider.value);
        dimension.textContent = `Grid size: ${slider.value} x ${slider.value}`;
    });
}

// Add drag-and-paint functionality on cells in grid
function addDragAndPaint(grid) {
    grid.addEventListener("mousedown", () => mouseDown = true);
    grid.addEventListener("mouseup", () => mouseDown = false);

    grid.addEventListener("mouseover", listener.paintCell);
}

// Paint each cell a different random color when dragged over
function rainbowPaint(grid) {
    const rainbowButton = document.getElementById("rainbow-button");

    rainbowButton.addEventListener("click", () => {
        rainbowButton.classList.toggle("clicked");
        helper.removeClickedClass(rainbowButton);

        if (rainbowButton.classList.contains("clicked")) {
            grid.removeEventListener("mouseover", listener.paintCell);
            grid.addEventListener("mouseover", listener.paintCellRainbow);
        } else {
            grid.removeEventListener("mouseover", listener.paintCellRainbow);
            grid.addEventListener("mouseover", listener.paintCell);
        }
    });  
}

// Turn cell back to default background colour when moused over
function erasePaint(grid) {
    const eraserButton = document.getElementById("eraser-button");

    eraserButton.addEventListener("click", () => {
        eraserButton.classList.toggle("clicked");
        helper.removeClickedClass(eraserButton);

    if (eraserButton.classList.contains("clicked")) {
        grid.removeEventListener("mouseover", listener.paintCell);
        grid.removeEventListener("mouseover", listener.paintCellRainbow);
        grid.addEventListener("mouseover", listener.eraseCell);
    } else {
        grid.removeEventListener("mouseover", listener.paintCellRainbow);
        grid.removeEventListener("mouseover", listener.eraseCell);
        grid.addEventListener("mouseover", listener.paintCell);
    }
    });
}

// Paint cell with the color specified by the color picker
function colorPaint(grid) {
    const colorPicker = document.getElementById("color-picker");
    const colorButton = document.getElementById("color-button");

    colorButton.addEventListener("click", () => {
        colorButton.classList.add("clicked");
        helper.removeClickedClass(colorButton);

        if (colorButton.classList.contains("clicked")) {
            grid.removeEventListener("mouseover", listener.eraseCell);
            grid.removeEventListener("mouseover", listener.paintCellRainbow);
            grid.addEventListener("mouseover", listener.paintCell);
        }
    })

    colorPicker.addEventListener("input", () => {
        helper.removeClickedClass(colorButton);

        listener.paintCell();
    })
}

// Reset all cells in the grid to the default background color
function clearGrid(grid) {
    const clearButton = document.getElementById("clear-button");
    
    clearButton.addEventListener("click", () => {
        const cells = Array.from(grid.querySelectorAll(".cell"));

        for (let i = 0; i < cells.length; i++) {
            cells[i].style.backgroundColor = "white";
        }
    })
}

export {
    createGrid,
    updateGridSize,
    addDragAndPaint,
    rainbowPaint,
    erasePaint,
    colorPaint,
    clearGrid
};