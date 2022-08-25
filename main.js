// Global variable tracking mousedown event
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

// Add drag-and-paint functionality on cells in grid
function addDragAndPaint(grid) {
    grid.addEventListener("mousedown", () => mouseDown = true, false);
    grid.addEventListener("mouseup", () => mouseDown = false, false);

    grid.addEventListener("mouseover", paintCell, false);
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

// Paint each cell a different random color when dragged over
function rainbowPaint(grid) {
    const rainbowButton = document.getElementById("rainbow-button");

    rainbowButton.addEventListener("click", () => {
        rainbowButton.classList.toggle("clicked");
        removeClickedClass(rainbowButton);

        if (rainbowButton.classList.contains("clicked")) {
            grid.removeEventListener("mouseover", paintCell, false);
            grid.addEventListener("mouseover", paintCellRainbow, false);
        } else {
            grid.removeEventListener("mouseover", paintCellRainbow, false);
            grid.addEventListener("mouseover", paintCell, false);
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
        grid.removeEventListener("mouseover", paintCell, false);
        grid.removeEventListener("mouseover", paintCellRainbow, false);
        grid.addEventListener("mouseover", eraseCell, false);
    } else {
        grid.removeEventListener("mouseover", paintCellRainbow, false);
        grid.removeEventListener("mouseover", eraseCell, false);
        grid.addEventListener("mouseover", paintCell, false);
    }
    });
}

// Paint cell with the color specified by the color picker
function colorPaint(grid) {
    const colorPicker = document.getElementById("color-picker");
    const colorButton = document.getElementById("color-button");

    function updateMouseoverListeners(colorButton) {
        if (colorButton.classList.contains("clicked")) {
            grid.removeEventListener("mouseover", eraseCell, false);
            grid.removeEventListener("mouseover", paintCellRainbow, false);
            grid.addEventListener("mouseover", paintCell, false);
        }
    }

    colorButton.addEventListener("click", () => {
        colorButton.classList.add("clicked");
        removeClickedClass(colorButton);
        updateMouseoverListeners(colorButton);
    })


    colorPicker.addEventListener("click", () => {
        colorButton.classList.add("clicked");
        removeClickedClass(colorButton);
        updateMouseoverListeners(colorButton);
    })     
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

// Listener for createGrid() and colorPaint()
function paintCell(event) {
    const colorPicker = document.getElementById("color-picker");

    if (mouseDown && event.target.className === "cell") {
        changeBgCol(event, colorPicker.value);
    }
}

// Listener for rainbowPaint()
function paintCellRainbow(event) {
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
}

main();