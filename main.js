// Global variables
let mouseDown = false;
let passCounter = 0;

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

    grid.addEventListener("mouseover", paintCell, false);
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
            updateListeners(grid, "mouseover", [paintCell, eraseCell], rainbowCell);
        } else {
            document.getElementById("color-button").classList.add("clicked");
            updateListeners(grid, "mouseover", [eraseCell, rainbowCell], paintCell);
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
        updateListeners(grid, "mouseover", [paintCell, rainbowCell], eraseCell);
    } else {
        document.getElementById("color-button").classList.add("clicked");
        updateListeners(grid, "mouseover", [eraseCell, rainbowCell], paintCell);
    }
    });
}

// Paint cell with the color specified by the color picker
function colorPaint(grid) {
    const colorPicker = document.getElementById("color-picker");
    const colorButton = document.getElementById("color-button");

    for (const element of [colorPicker, colorButton]) {
        element.addEventListener("click", () => {
            colorButton.classList.add("clicked");
            removeClickedClass(colorButton);
            if (colorButton.classList.contains("clicked")) {
                updateListeners(grid, "mouseover", [eraseCell, rainbowCell], paintCell);
            }
        });
    } 
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
            updateListeners(grid, "mouseout", [darkenCell], lightenCell);
        }
    }, false);

    darkenButton.addEventListener("click", () => {
        darkenButton.classList.toggle("clicked");
        lightenButton.classList.remove("clicked");

        if (darkenButton.classList.contains("clicked")) {
            updateListeners(grid, "mouseout", [lightenCell], darkenCell);
        }
    }, false);
}

// Listener for createGrid() and colorPaint()
function paintCell(event) {
    const colorPicker = document.getElementById("color-picker");

    if (mouseDown && event.target.classList.contains("cell")) {
        changeBgCol(event, colorPicker.value);
    }
}

// Listener for rainbowPaint()
function rainbowCell(event) {
    const color = `rgb(${rand(255)}, ${rand(255)}, ${rand(255)})`;

    if (mouseDown && event.target.classList.contains("cell")) {
        changeBgCol(event, color);
    }
}

// Listener for erasePaint()
function eraseCell(event) {
    if (mouseDown && event.target.classList.contains("cell")) {
        changeBgCol(event, "white");
    }
}

// Listener for adjustCellShading()
function lightenCell(event) {
    if (mouseDown && event.target.classList.contains("cell")) {
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
    if (mouseDown && event.target.classList.contains("cell")) {
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
        }
    }
}

// Helper function to update mouseover listeners when switching paint modes
function updateListeners(grid, event, removeListeners, addListener) {
    for (listener of removeListeners) {
        grid.removeEventListener("mouseover", listener, false);
    }
        
    grid.addEventListener("mouseover", addListener, false);
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