function createGrid(dim) {
    const grid = document.querySelector(".grid");

    // Set width and height of grid container based on dimension
    grid.style.width = `${dim * 20}px`;
    grid.style.height = grid.style.width;

    // Create and insert cells into parent grid div
    for (let i = 0; i < dim ** 2; i++) {
        const cell = document.createElement("div");
        cell.classList.add("cell");
        grid.appendChild(cell);
    }
}

function main() {
    createGrid(16);
}

main();