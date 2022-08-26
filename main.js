// Global variables
let mouseDown = false;
let clicked = false;
let passCounter = 0;
let shadeActive = false;

// Create grid of dim x dim cells
function createGrid(dim) {
    const grid = document.querySelector(".grid");
    const gridSize = grid.clientWidth;
    const toggler = document.querySelector("input[type='checkbox']");

    grid.style.gridTemplateColumns = `repeat(${dim}, 1fr)`;
    grid.style.gridTemplateRows = grid.style.gridTemplateColumns;

    // Create and insert cells into parent grid div
    for (let i = 0; i < dim ** 2; i++) {
        const cell = document.createElement("div");
        cell.classList.add("cell");
        if (toggler.checked) cell.classList.add("cell-gridded");
        grid.appendChild(cell);
    }

    return grid
}

// Add drag-and-paint functionality on cells in grid
function addDragAndPaint(grid) {
    grid.addEventListener("mousedown", () => mouseDown = true, false);
    grid.addEventListener("mouseup", () => mouseDown = false, false);
    grid.addEventListener("click", () => clicked = true, false);
    grid.addEventListener("mouseout", () => clicked = false, false);

    for (const event of ["mouseover", "click"]) {
        grid.addEventListener(event, paintCell, false);
    }
    
}

// Dynamically update grid size when slider is moved and display the value
function updateGridSize(grid) {
    const slider = document.getElementById("size-slider");
    const dimension = document.getElementById("dimension");

    slider.addEventListener("input", () => {
        grid.innerHTML = "";
        createGrid(slider.value);
        dimension.textContent = slider.value;
    });
}

// Paint each cell a different random color when dragged over
function rainbowPaint(grid) {
    const rainbowButton = document.getElementById("rainbow-button");

    rainbowButton.addEventListener("click", () => {
        rainbowButton.classList.toggle("clicked");
        removeClickedClass(rainbowButton);

        if (rainbowButton.classList.contains("clicked")) {
            for (const event of ["mouseover", "click"]) {
                updateListeners(grid, event, [paintCell, eraseCell], [rainbowCell]);
            }
        } else {
            document.getElementById("color-button").classList.add("clicked");
            for (const event of ["mouseover", "click"]) {
                updateListeners(grid, event, [eraseCell, rainbowCell], [paintCell]);
            }
        }
    });
}

// Turn cell back to default background colour when moused over
function erasePaint(grid) {
    const eraserButton = document.getElementById("eraser-button");

    eraserButton.addEventListener("click", () => {
        eraserButton.classList.toggle("clicked");
        removeClickedClass(eraserButton);

    if (eraserButton.classList.contains("clicked")) {
        for (const event of ["mouseover", "click"]) {
            updateListeners(grid, event, [paintCell, rainbowCell], [eraseCell]);
        }
    } else {
        document.getElementById("color-button").classList.add("clicked");
        for (const event of ["mouseover", "click"]) {
            updateListeners(grid, event, [eraseCell, rainbowCell], [paintCell]);
        }
    }
    });
}

// Paint cell with the color specified by the color picker
function colorPaint(grid) {
    const colorPicker = document.getElementById("color-picker");
    const colorButton = document.getElementById("color-button");

    for (const element of [colorPicker, colorButton]) {
        element.addEventListener("click", () => {
            colorPicker.click();
            colorButton.classList.add("clicked");
            colorButton.style.color = colorPicker.value;
            removeClickedClass(colorButton);

            if (colorButton.classList.contains("clicked")) {
                for (const event of ["mouseover", "click"]) {
                    updateListeners(grid, event, [eraseCell, rainbowCell], [paintCell]);
                }
            }
        });
    } 

    colorPicker.addEventListener("input", () => {
        if (colorButton.classList.contains("clicked")) {
            colorButton.style.color = colorPicker.value;
        }
    }); 
}

// Reset all cells in the grid to the default background color
function clearGrid(grid) {
    const clearButton = document.getElementById("clear-button");
    
    clearButton.addEventListener("click", () => {
        const cells = grid.querySelectorAll(".cell");

        for (const cell of cells) {
            cell.style.backgroundColor = "white";
            cell.style.filter = "brightness(100%)";
        }
    })
}

// Toggle gridlines
function toggleGridLines(grid) {
    const toggler = document.querySelector("input[type='checkbox']");

    toggler.addEventListener('change', () => {
        const cells = grid.querySelectorAll(".cell");

        for (const cell of cells) {
            cell.classList.toggle("cell-gridded");
        }
    }, false);
}

// Lighten/Darken cell color per pass
function adjustCellShading(grid) {
    const lightenButton = document.getElementById("lighten-button");
    const darkenButton = document.getElementById("darken-button");

    lightenButton.addEventListener("click", () => {
        lightenButton.classList.toggle("clicked");
        darkenButton.classList.remove("clicked");

        if (lightenButton.classList.contains("clicked")) {
            shadeActive = true;
            updateListeners(grid, "mouseout", [darkenCell], [lightenCell]);
            updateListeners(grid, "click", [eraseCell, rainbowCell, paintCell], null);
        } else {
            shadeActive = false;
            updateListeners(grid, "mouseout", [lightenCell]);
            updateListeners(grid, "click", null, [eraseCell, rainbowCell, paintCell]);
        }
    }, false);

    darkenButton.addEventListener("click", () => {
        darkenButton.classList.toggle("clicked");
        lightenButton.classList.remove("clicked");

        if (darkenButton.classList.contains("clicked")) {
            shadeActive = true;
            updateListeners(grid, "mouseout", [lightenCell], [darkenCell]);
            updateListeners(grid, "click", [eraseCell, rainbowCell, paintCell], null);
        } else {
            shadeActive = false;
            updateListeners(grid, "mouseout", [darkenCell]);
            updateListeners(grid, "click", null, [eraseCell, rainbowCell, paintCell]);
        }
    }, false);
}

// Listener for createGrid() and colorPaint()
function paintCell(event) {
    resetCss(event);
    const colorPicker = document.getElementById("color-picker");

    if (correctCellState(event)) {
        changeBgCol(event, colorPicker.value);
    }
}

// Listener for rainbowPaint()
function rainbowCell(event) {
    resetCss(event);
    const color = `rgb(${rand(255)}, ${rand(255)}, ${rand(255)})`;

    if (correctCellState(event)) changeBgCol(event, color);
}

// Listener for erasePaint()
function eraseCell(event) {
    resetCss(event);
    if (correctCellState(event)) changeBgCol(event, "white");
}

// Listener for adjustCellShading()
function lightenCell(event) {
    event.target.style.filter = null;

    if (correctCellState(event)) {
        event.target.style.opacity = `${100 - passCounter}%`;
        if (passCounter < 100) {
            passCounter += 1;
        }
    } else {
        passCounter = 0;
    }
}

// Listener for adjustCellShading()
function darkenCell(event) {
    event.target.style.opacity = "100%";

    if (correctCellState(event)) {
        event.target.style.filter = `brightness(${100 - passCounter}%)`;
        if (passCounter < 100) {
            passCounter += 1;
        }
    } else {
        passCounter = 0;
    }
}

// Helper function for paintCell()
function changeBgCol(event, color) {
    event.target.style.backgroundColor = color;
}

// Generate random integer between 0 and n
function rand(n) {
    return Math.floor(Math.random() * n);
}

// Helper function to remove .clicked class from every button except the clicked one
function removeClickedClass(exceptThis) {
    const paintButtons = document.querySelectorAll(".paint-button");

    for (const button of paintButtons) {
        if (button != exceptThis) {
            button.classList.remove("clicked");
            if (button.id == "color-button") button.style.color = null;
        }
    }
}

// Helper function to update mouseover listeners when switching paint modes
function updateListeners(grid, event, removeListeners=null, addListeners=null) {
    if (removeListeners != null) {
        for (const listener of removeListeners) {
            grid.removeEventListener(event, listener, false);
        }
    }
    
    if (addListeners != null) {
        for (const listener of addListeners) {
            grid.addEventListener(event, listener, false);
        }
    };
}

// Helper function to check cell state before coloring
function correctCellState(event) {
    return (mouseDown || clicked) && event.target.classList.contains("cell")
}

// Helper function to reset relevant CSS styles if shade function is off
function resetCss(event) {
    if (!shadeActive) {
        event.target.style.opacity = "100%";
        event.target.style.filter = null;
    }
}

// Main JS function
function main() {
    // Create grid
    const grid = createGrid(16);

    // Add sketchpad functionalities to grid
    addDragAndPaint(grid);
    updateGridSize(grid);
    colorPaint(grid);
    rainbowPaint(grid);
    erasePaint(grid);
    clearGrid(grid);
    toggleGridLines(grid);
    adjustCellShading(grid);
}

main();