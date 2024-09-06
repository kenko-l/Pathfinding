const gridContainer = document.getElementById('grid-container');
const rows = 20;
const cols = 60;
const grid = [];

// Create the grid in HTML and JavaScript
for (let row = 0; row < rows; row++) {
    const gridRow = [];
    for (let col = 0; col < cols; col++) {
        // Create a cell div element
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.dataset.row = row; // Store row in dataset
        cell.dataset.col = col; // Store column in dataset

        // Append cell to the grid container
        gridContainer.appendChild(cell);

        // Treat this cell as a node with additional properties
        const cellNode = {
            element: cell,               // Reference to the HTML element
            row: row,                    // Row number
            col: col,                    // Column number
            distance: Infinity,          // Initially, all distances are Infinity
            visited: false,              // Initially, no cell is visited
            neighbors: [],               // To be filled later
        };

        // Add this cell to the row
        gridRow.push(cellNode);
    }
    // Add the row to the grid
    grid.push(gridRow);
}

// Function to add neighbors for each cell
function addNeighbors() {
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            const cell = grid[row][col];
            
            // Add the valid neighbors (up, down, left, right)
            if (row > 0) cell.neighbors.push(grid[row - 1][col]);      // Up
            if (row < rows - 1) cell.neighbors.push(grid[row + 1][col]); // Down
            if (col > 0) cell.neighbors.push(grid[row][col - 1]);      // Left
            if (col < cols - 1) cell.neighbors.push(grid[row][col + 1]); // Right
        }
    }
}

// Call the function to assign neighbors to all cells
addNeighbors();

// Set start and end cells
const startCellNode = grid[10][20]; // Initial start cell
const endCellNode = grid[10][40];   // Initial end cell

// Add CSS classes to visually indicate the start and end cells
startCellNode.element.classList.add('start');
startCellNode.element.id = 'startCell'; // Set an ID for drag-and-drop

endCellNode.element.classList.add('end');
endCellNode.element.id = 'endCell'; // Set an ID for drag-and-drop

// Initialize distances for Dijkstra's algorithm
startCellNode.distance = 0; // Distance from start cell to itself is 0
endCellNode.distance = Infinity; // End cell starts with infinity distance

function areNodesAtLeastOneCellApart(start, end) {
    const rowDiff = Math.abs(start.row - end.row);
    const colDiff = Math.abs(start.col - end.col);
    return rowDiff > 1 || colDiff > 1; // They should be at least one cell apart
}

// Check if they are at least one cell apart
if (!areNodesAtLeastOneCellApart(startCellNode, endCellNode)) {
    // Reassign endCellNode to a new position or prompt the user
    // Example: Moving the end node to a new valid position
    // Ensure this new position is within bounds and not too close to the start node
    endCellNode = grid[2][2]; // Example repositioning

    // Update the visual representation
    endCellNode.element.classList.add('end');
    endCellNode.element.id = 'endCell';
}

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

        // Move the dragged element
        targetCell.appendChild(draggedElement);
    
        // Trigger the animation
        triggerAnimation(draggedElement);

        // Validate if start and end nodes are at least one cell apart
        if (draggedElement.id === 'startCell') {
            if (areNodesAtLeastOneCellApart(targetNode, endCellNode)) {
                targetCell.appendChild(draggedElement);
                startCellNode = targetNode; // Update the start node
            } else {
                alert('Start and End nodes must be at least one cell apart!');
            }
        } else if (draggedElement.id === 'endCell') {
            if (areNodesAtLeastOneCellApart(startCellNode, targetNode)) {
                targetCell.appendChild(draggedElement);
                endCellNode = targetNode; // Update the end node
            } else {
                alert('Start and End nodes must be at least one cell apart!');
            }
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
