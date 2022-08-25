// Helper function for paintCell()
function changeBgCol(event, color) {
    event.target.style.backgroundColor = color;
}

// Generate random integer between 0 and 255
function rand255() {
    return Math.floor(Math.random() * 255);
}

// Helper function to remove .clicked class from every button except the clicked one
function removeClickedClass(exceptThis) {
    const paintButtons = Array.from(document.querySelectorAll(".paint-button"));

    for (let i = 0; i < paintButtons.length; i++) {
        if (paintButtons[i] != exceptThis) {
            paintButtons[i].classList.remove("clicked");
        }
    }
}

export {
    changeBgCol,
    rand255,
    removeClickedClass
};