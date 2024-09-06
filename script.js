// script.js
const gridContainer = document.getElementById('grid');
const rows = 20;
const cols = 50;
const grid = [];

// Create a 2D grid
for (let i = 0; i < rows; i++) {
  let row = [];
  for (let j = 0; j < cols; j++) {
    const cell = document.createElement('div');
    cell.classList.add('cell');
    gridContainer.appendChild(cell);
    row.push(cell);
  }
  grid.push(row);
}

// Set the start and end cells after the grid is created
const startCell = grid[0][0]; // Top-left cell
const endCell = grid[rows - 1][cols - 1]; // Bottom-right cell

startCell.classList.add('start');
startCell.id = 'startCell'; // Set an ID for drag-and-drop

endCell.classList.add('end');
endCell.id = 'endCell'; // Set an ID for drag-and-drop

function allowDrop(ev) {
    ev.preventDefault();
}
  
function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
}
  
function drop(ev) {
    ev.preventDefault();
    const data = ev.dataTransfer.getData("text");
    const draggedElement = document.getElementById(data);
    
    // Check if the drop target is a cell
    if (ev.target.classList.contains('cell')) {
        ev.target.appendChild(draggedElement);
        
        // Optional: Update cell positions or handle specific logic here
    }
}

// Attach event listeners to cells
document.querySelectorAll('.cell').forEach(cell => {
    cell.setAttribute('draggable', 'true');
    cell.addEventListener('dragstart', drag);
    cell.addEventListener('dragover', allowDrop);
    cell.addEventListener('drop', drop);
});
