export const grid = [];
export let startNode, endNode;

const gridContainer = document.getElementById('grid-container');
const rows = 20;
const cols = 60;

// Create the grid in HTML and JavaScript
for (let row = 0; row < rows; row++) {
    const gridRow = [];
    for (let col = 0; col < cols; col++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.dataset.row = row;
        cell.dataset.col = col;

        gridContainer.appendChild(cell);

        const cellNode = {
            element: cell,
            row: row,
            col: col,
            distance: Infinity,
            visited: false,
            neighbors: [],
        };

        gridRow.push(cellNode);
    }
    grid.push(gridRow);
}

// Assign neighbors for each cell
function addNeighbors(grid) {
    for (let row of grid) {
        for (let node of row) {
            if (node.row > 0) node.neighbors.push(grid[node.row - 1][node.col]);
            if (node.row < rows - 1) node.neighbors.push(grid[node.row + 1][node.col]);
            if (node.col > 0) node.neighbors.push(grid[node.row][node.col - 1]);
            if (node.col < cols - 1) node.neighbors.push(grid[node.row][node.col + 1]);
        }
    }
}
addNeighbors(grid);

// Set start and end nodes
startNode = grid[10][20];
endNode = grid[10][40];

startNode.element.classList.add('start');
startNode.element.id = 'startCell';

endNode.element.classList.add('end');
endNode.element.id = 'endCell';

// Initialize distances for Dijkstra's algorithm
startNode.distance = 0; // Distance from start cell to itself is 0
endNode.distance = Infinity; // End cell starts with infinity distance

// Add these functions to your existing script.js

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
    const targetCell = ev.target;

    // Check if the drop target is a cell
    if (targetCell.classList.contains('cell')) {
        const targetNode = grid[targetCell.dataset.row][targetCell.dataset.col];

        // Check if the cell is occupied by start or end node
        if ((draggedElement.id === 'startCell' && targetNode !== endNode) || 
            (draggedElement.id === 'endCell' && targetNode !== startNode)) {

            // Move the dragged element
            targetCell.appendChild(draggedElement);

            // Update the node references
            if (draggedElement.id === 'startCell') {
                startNode = targetNode; // Update the start node
            } else if (draggedElement.id === 'endCell') {
                endNode = targetNode; // Update the end node
            }
            
            // Trigger the animation
            triggerAnimation(draggedElement);
        }
    }
}

// Attach event listeners to cells
document.querySelectorAll('.cell').forEach(cell => {
    cell.setAttribute('draggable', 'true');
    cell.addEventListener('dragstart', drag);
    cell.addEventListener('dragover', allowDrop);
    cell.addEventListener('drop', drop);
});
