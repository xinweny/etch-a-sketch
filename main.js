let mouseDown = false;

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

// Add event listener for drag-and-paint effect on cells
function addDragAndPaint(grid) {
    grid.addEventListener("mousedown", () => mouseDown = true);
    grid.addEventListener("mouseup", () => mouseDown = false);

    grid.addEventListener("mouseover", paintCell);
}

function paintCell(event) {
    const colorPicker = document.getElementById("color-picker");

    if (mouseDown && event.target.className === "cell") {
        changeBgCol(event, colorPicker.value);
    }
}

// Helper function for paintCell
function changeBgCol(event, color) {
    event.target.style.backgroundColor = color;
}

function rainbowPaint(grid) {
    const rainbowButton = document.getElementById("rainbow-button");

    rainbowButton.addEventListener("click", () => {
        rainbowButton.classList.toggle("clicked");
        removeClickedClass(rainbowButton);

        if (rainbowButton.classList.contains("clicked")) {
            grid.removeEventListener("mouseover", paintCell);
            grid.addEventListener("mouseover", paintCellRainbow);
        } else {
            grid.removeEventListener("mouseover", paintCellRainbow);
            grid.addEventListener("mouseover", paintCell);
        }
    });  
}

function paintCellRainbow(event) {
    const color = `rgb(${rand255()}, ${rand255()}, ${rand255()})`;

    if (mouseDown && event.target.className === "cell") {
        changeBgCol(event, color);
    }
}

// Generate random integer between 0 and 255
function rand255() {
    return Math.floor(Math.random() * 255)
}

function updateGridSize(grid) {
    const slider = document.getElementById("slider");
    const dimension = document.getElementById("dimension");

    slider.addEventListener("input", () => {
        grid.innerHTML = "";
        createGrid(slider.value);

        dimension.textContent = `Grid size: ${slider.value} x ${slider.value}`;
    });
}

function erasePaint(grid) {
    const eraserButton = document.getElementById("eraser-button");

    eraserButton.addEventListener("click", () => {
        eraserButton.classList.toggle("clicked");
        removeClickedClass(eraserButton);

    if (eraserButton.classList.contains("clicked")) {
        grid.removeEventListener("mouseover", paintCell);
        grid.removeEventListener("mouseover", paintCellRainbow);
        grid.addEventListener("mouseover", eraseCell);
    } else {
        grid.removeEventListener("mouseover", paintCellRainbow);
        grid.removeEventListener("mouseover", eraseCell);
        grid.addEventListener("mouseover", paintCell);
    }
    });
}

function eraseCell(event) {
    if (mouseDown && event.target.className === "cell") {
        changeBgCol(event, "white");
    }
}

function removeClickedClass(exceptThis) {
    const paintButtons = document.querySelectorAll(".paint-button");

    for (button of paintButtons) {
        if (button != exceptThis) {
            button.classList.remove("clicked");
        }
    }
}

function colorPaint(grid) {
    const colorPicker = document.getElementById("color-picker");
    const colorButton = document.getElementById("color-button");

    colorButton.addEventListener("click", () => {
        colorButton.classList.add("clicked");
        removeClickedClass(colorButton);

        if (colorButton.classList.contains("clicked")) {
            grid.removeEventListener("mouseover", eraseCell);
            grid.removeEventListener("mouseover", paintCellRainbow);
            grid.addEventListener("mouseover", paintCell);
        }
    })

    colorPicker.addEventListener("input", () => {
        removeClickedClass(colorButton);

        paintCell();
    })
}

function clearGrid(grid) {
    const clearButton = document.getElementById("clear-button");

    clearButton.addEventListener("click", () => {
        for (cell of grid.querySelectorAll(".cell")) {
            cell.style.backgroundColor = "white";
        }
    })
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