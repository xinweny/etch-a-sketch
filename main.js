// Global variables
let mouseDown = false;
let passCounter = 0;

// Create grid of dim x dim cells
function createGrid(dim) {
    const grid = document.querySelector(".grid");
    const gridSize = grid.clientWidth;

    grid.style.gridTemplateColumns = `repeat(${dim}, 1fr)`;
    grid.style.gridTemplateRows = grid.style.gridTemplateColumns;

    // Create and insert cells into parent grid div
    for (let i = 0; i < dim ** 2; i++) {
        const cell = document.createElement("div");
        cell.classList.add("cell");
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
            updateMouseoverListeners(grid, [paintCell, eraseCell], rainbowCell);
        } else {
            document.getElementById("color-button").classList.add("clicked");
            updateMouseoverListeners(grid, [eraseCell, rainbowCell], paintCell);
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
        updateMouseoverListeners(grid, [paintCell, rainbowCell], eraseCell);
    } else {
        document.getElementById("color-button").classList.add("clicked");
        updateMouseoverListeners(grid, [eraseCell, rainbowCell], paintCell);
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
                updateMouseoverListeners(grid, [eraseCell, rainbowCell], paintCell);
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
        }
    })
}

// Toggle gridlines
function toggleGridLines(grid) {
    const toggler = document.querySelector("input[type='checkbox']");
    const cells = grid.querySelectorAll(".cell");

    toggler.addEventListener('change', () => {
        grid.style.gap = toggler.checked ? "1px" : "0px";
    })
}

// Lighten/Darken cell color per pass
function adjustCellShading(grid) {
    const lightenButton = document.getElementById("lighten-button");
    const darkenButton = document.getElementById("shade-button");
}

// Listener for createGrid() and colorPaint()
function paintCell(event) {
    const colorPicker = document.getElementById("color-picker");

    if (mouseDown && event.target.className === "cell") {
        changeBgCol(event, colorPicker.value);
    }
}

// Listener for rainbowPaint()
function rainbowCell(event) {
    const color = `rgb(${rand(255)}, ${rand(255)}, ${rand(255)})`;

    if (mouseDown && event.target.className === "cell") {
        changeBgCol(event, color);
    }
}

// Listener for erasePaint()
function eraseCell(event) {
    if (mouseDown && event.target.className === "cell") {
        changeBgCol(event, "white");
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
function updateMouseoverListeners(grid, removeListeners, addListener) {
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
}

main();