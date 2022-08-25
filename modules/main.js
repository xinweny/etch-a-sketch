import * as feature from './features.js';

// Main JS function
function main() {
    // Create grid
    const grid = feature.createGrid(16);

    // Add sketchpad functionalities to grid
    feature.addDragAndPaint(grid);
    feature.updateGridSize(grid);
    feature.colorPaint(grid);
    feature.rainbowPaint(grid);
    feature.erasePaint(grid);
    feature.clearGrid(grid);
}

main();