function createGrid(dim) {
    const cells = dim ** 2;
    const grid = document.querySelector(".grid");

    // Set width and height of grid container based on dimension
    // Create and insert cells into parent grid div
    for (let i = 0; i < cells; i++) {
        const cell = document.createElement("div");
        cell.classList.add("cell");
        grid.appendChild(cell);
    }

}

function main() {
    createGrid(16);
}

main();