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

    addDragAndPaint(grid);

    return grid
}

// Add event listener for drag-and-paint effect on cells
function addDragAndPaint(grid) {
    let mouseDown = false;

    grid.addEventListener('mousedown', () => mouseDown = true);
    grid.addEventListener('mouseup', () => mouseDown = false);

    grid.addEventListener("mouseover", function(event) { // closure
        if (mouseDown && event.target.className === "cell") {
            event.target.style.backgroundColor = "black";
        }
    });
}

function main() {
    const grid = createGrid(16);
}

main();