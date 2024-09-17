import { visualizeDijkstra } from '../Algorithms/dijkstra.js';
import { visualizeAStar } from '../Algorithms/aStar.js';

export let START_NODE_ROW = 10;
export let START_NODE_COL = 15;
export let FINISH_NODE_ROW = 10;
export let FINISH_NODE_COL = 45;

let mouseIsPressed = false;
export let grid = [];
let draggingStartNode = false;
let draggingEndNode = false;
let previousStartNode = { row: START_NODE_ROW, col: START_NODE_COL };
let previousEndNode = { row: FINISH_NODE_ROW, col: FINISH_NODE_COL };
let addWeightMode = false;
let weightValue = 5;
let wallMode = false; 
let selectedAlgorithm = 'dijkstra';
let cellSize = 25; // Size of each cell in pixels
export let gridWidth = 60; // Default grid columns
export let gridHeight = 25; // Default grid rows

window.onload = () => {
  grid = getInitialGrid();
  adjustGridToScreenSize();
  createGrid();

  // Get button elements
  const startButton = document.getElementById('start-button');
  const clearButton = document.getElementById('clear-button');
  const wallButton = document.getElementById('wall-button');
  const weightButtons = {
    light: document.getElementById('light-weight-button'),
    medium: document.getElementById('medium-weight-button'),
    heavy: document.getElementById('heavy-weight-button')
  };

  const randomWallButton = document.getElementById('random-wall-button');
  if (randomWallButton) {
    randomWallButton.addEventListener('click', () => {
      placeRandomWalls(0.2);
    });
  } else {
    console.error('Random wall button not found.');
  }
  

  // Event listeners for algorithm selection
  const dijkstraMenuItem = document.querySelector('.dropdown-menu a[href="#dijkstra"]');
  const aStarMenuItem = document.querySelector('.dropdown-menu a[href="#astar"]');

  dijkstraMenuItem.addEventListener('click', () => {
    selectedAlgorithm = 'dijkstra';
  });

  aStarMenuItem.addEventListener('click', () => {
    selectedAlgorithm = 'astar';
  });

  const generateMazeButton = document.getElementById('generate-maze-button');
if (generateMazeButton) {
  generateMazeButton.addEventListener('click', generateMaze);
} else {
  console.error('Generate Maze button not found.');
}


  // Set up event listener for the start button
  startButton.addEventListener('click', () => {
    if (selectedAlgorithm === 'dijkstra') {
      visualizeDijkstra();
    } else if (selectedAlgorithm === 'astar') {
      visualizeAStar();
    }
  });

  clearButton.addEventListener('click', clearGrid);

  // Toggle weight mode
  Object.keys(weightButtons).forEach(weight => {
    weightButtons[weight].addEventListener('click', () => {
      addWeightMode = weight; // Set weight mode to 'light', 'medium', or 'heavy'
      Object.values(weightButtons).forEach(button => button.classList.remove('active'));
      weightButtons[weight].classList.add('active');
    });
  });

  // Toggle wall mode
  wallButton.addEventListener('click', () => {
    addWeightMode = false; // Disable weight mode
    wallMode = !wallMode; // Toggle wall mode
    wallButton.classList.toggle('active', wallMode); // Optional: Add active class for visual feedback
  });

  // Attach resize event listener to adjust grid when the window is resized
  window.addEventListener('resize', () => {
    adjustGridToScreenSize();
    createGrid(); // Recreate the grid on screen size change
  });

  document.addEventListener('mouseup', handleMouseUp);
};

function placeRandomWalls(density = 0.2) {
  if (density < 0 || density > 1) {
    console.error('Density must be between 0 and 1.');
    return;
  }

  for (let row = 0; row < gridHeight; row++) {
    for (let col = 0; col < gridWidth; col++) {
      if (Math.random() < density) {
        grid[row][col].isWall = true;
        console.log(`Wall placed at (${row}, ${col})`); // Debug log
      }
    }
  }

  updateGrid();
}
/*
function generateMaze() {
  // Reset the grid
  console.log("Maze generation started");
  grid = getInitialGrid();
  console.log("Initial grid loaded", grid);

  const stack = [];
  const visited = new Set();
  
  const startRow = Math.floor(Math.random() * gridHeight);
  const startCol = Math.floor(Math.random() * gridWidth);
  console.log(`Start at: row ${startRow}, col ${startCol}`);

  stack.push([startRow, startCol]);
  visited.add(`${startRow},${startCol}`);
  console.log("Visited set initialized", visited);

  const directions = [
    [-2, 0], // Up
    [2, 0],  // Down
    [0, -2], // Left
    [0, 2]   // Right
  ];

  while (stack.length > 0) {
    const [row, col] = stack.pop();
    console.log(`Processing cell: row ${row}, col ${col}`);
    grid[row][col].isWall = false; // Ensure starting point is not a wall

    // Shuffle directions to create a random maze
    directions.sort(() => Math.random() - 0.5);
    console.log("Directions shuffled", directions);

    for (const [dRow, dCol] of directions) {
      const newRow = row + dRow;
      const newCol = col + dCol;
      const betweenRow = Math.floor(row + dRow / 2);
      const betweenCol = Math.floor(col + dCol / 2);

      if (
        newRow >= 0 && newRow < gridHeight &&
        newCol >= 0 && newCol < gridWidth &&
        !visited.has(`${newRow},${newCol}`)
      ) {
        console.log(`Carving path to: row ${newRow}, col ${newCol}`);
        grid[betweenRow][betweenCol].isWall = false; // Remove wall between cells
        grid[newRow][newCol].isWall = false; // Remove wall at new cell
        visited.add(`${newRow},${newCol}`);
        stack.push([newRow, newCol]);
      }else {
        console.log(`Skipping cell: row ${newRow}, col ${newCol}`);
      }
    }
  }
  console.log("Maze generation completed");
  updateGrid();
  console.log("Final grid state:", grid);

}*/


// Handle mouse up event to stop dragging or wall placement
function handleMouseUp() {
  if (draggingStartNode || draggingEndNode) {
    // Ensure we don't leave dragging state active
    draggingStartNode = false;
    draggingEndNode = false;
  }
  mouseIsPressed = false;
  updateGrid();
}

function handleMouseDown(row, col) {
  mouseIsPressed = true;

  if (row === START_NODE_ROW && col === START_NODE_COL) {
    draggingStartNode = true;
  } else if (row === FINISH_NODE_ROW && col === FINISH_NODE_COL) {
    draggingEndNode = true;
  } else {
    handleCellClick(row, col); // Handle wall/weight placement or removal
    updateGrid();
  }
}

function handleMouseEnter(row, col) {
  if (!mouseIsPressed) return;

  if (draggingStartNode) {
    // Move the start node to the new location
    grid[previousStartNode.row][previousStartNode.col].isStart = false;
    grid[row][col].isStart = true;
    previousStartNode = { row, col };
    START_NODE_ROW = row;
    START_NODE_COL = col;
    updateGrid();
  } else if (draggingEndNode) {
    // Move the end node to the new location
    grid[previousEndNode.row][previousEndNode.col].isFinish = false;
    grid[row][col].isFinish = true;
    previousEndNode = { row, col };
    FINISH_NODE_ROW = row;
    FINISH_NODE_COL = col;
    updateGrid();
  } else {
    handleCellClick(row, col); // Handle wall/weight placement or removal
    updateGrid();
  }
}

// Main function to handle cell interactions (walls, weights, dragging start/end nodes)
function handleCellClick(row, col) {
  const cell = grid[row][col];
  
  if (row === START_NODE_ROW && col === START_NODE_COL) {
    draggingStartNode = true; // Start dragging the start node
  } else if (row === FINISH_NODE_ROW && col === FINISH_NODE_COL) {
    draggingEndNode = true; // Start dragging the end node
  } else if (addWeightMode && !cell.isWall && !cell.isStart && !cell.isFinish) {
    // Handle weight placement
    const weightValues = { light: 3, medium: 5, heavy: 10 };
    if (cell.isWeighted) {
      grid[row][col].isWeighted = false;
      grid[row][col].weight = 1; // Reset weight to default value
    } else {
      grid[row][col].isWeighted = true;
      grid[row][col].weight = weightValues[addWeightMode]; // Set weight based on selected mode
    }
    updateGrid();
  } else if (wallMode) {
    // Toggle wall state if wall mode is active
    grid = getNewGridWithWallToggled(grid, row, col);
    updateGrid();
  }
}

// Generate the grid dynamically in HTML
function createGrid() {
  const gridElement = document.querySelector('.grid');
  gridElement.innerHTML = ''; // Clear the existing grid content

  for (let row = 0; row < grid.length; row++) {
    const rowElement = document.createElement('div');
    rowElement.className = 'row';

    for (let col = 0; col < grid[row].length; col++) {
      const node = grid[row][col];
      const nodeElement = document.createElement('div');
      nodeElement.id = `node-${row}-${col}`;
      nodeElement.className = getNodeClassName(node);

      // Add event listeners for mousedown, mouseenter, and mouseup
      nodeElement.addEventListener('mousedown', () => handleMouseDown(row, col));
      nodeElement.addEventListener('mouseenter', () => handleMouseEnter(row, col));
      nodeElement.addEventListener('mouseup', handleMouseUp); // Ensure mouseup listener is added to each node

      rowElement.appendChild(nodeElement);
    }

    gridElement.appendChild(rowElement);
  }
} 

// Update the grid dynamically after changes (like wall toggling)
export function updateGrid() {
  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[row].length; col++) {
      const node = grid[row][col];
      const nodeElement = document.getElementById(`node-${row}-${col}`);
      nodeElement.className = getNodeClassName(node);
      if (node.isWeighted) {
        nodeElement.setAttribute('data-weight', node.weight);
      } else {
        nodeElement.removeAttribute('data-weight');
      }
    }
  }
}

// Function to reset the grid to its original state
function clearGrid() {
  
  // Reset grid state to its initial values
  grid = getInitialGrid();
  
  // Clear any pathfinding visualizations
  updateGrid();
  
  // Ensure no node is being dragged
  draggingStartNode = false;
  draggingEndNode = false;
  
  
  START_NODE_ROW = 10;
  START_NODE_COL = 15;
  FINISH_NODE_ROW = 10;
  FINISH_NODE_COL = 45;

  previousStartNode = { row: START_NODE_ROW, col: START_NODE_COL };
  previousEndNode = { row: FINISH_NODE_ROW, col: FINISH_NODE_COL };
  
  enableGrid(); 

  // Reset weights and walls in all nodes
  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[row].length; col++) {
      const node = grid[row][col];
      node.isWeighted = false; // Reset weights
      node.weight = 1; // Reset weight to default value
      node.isWall = false; // Reset walls
      node.isVisited = false; // Reset visited status
      node.previousNode = null; // Clear previous path
    }
  }

  // Force reflow to ensure the icons reset properly
  const gridElement = document.querySelector('.grid');
  gridElement.style.display = 'none'; // Temporarily hide
  void gridElement.offsetHeight; // Trigger reflow
  gridElement.style.display = ''; // Show again
}

// Function to disable the grid
export function disableGrid() {
  const gridElement = document.querySelector('.grid');
  gridElement.classList.add('grid-disabled');
}

// Function to enable the grid
function enableGrid() {
  const gridElement = document.querySelector('.grid');
  gridElement.classList.remove('grid-disabled');
}

function getInitialGrid() {
  const grid = [];
  
  // Create the grid with nodes
  for (let row = 0; row < gridHeight; row++) {
    const currentRow = [];
    for (let col = 0; col < gridWidth; col++) {
      currentRow.push(createNode(col, row));
    }
    grid.push(currentRow);
  }
  return grid;
}

// Function to calculate number of rows and columns based on the screen size
function adjustGridToScreenSize() {
  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;

  // Dynamically calculate columns based on the available width
  gridWidth = Math.floor(screenWidth / cellSize);
  
  // Dynamically calculate rows based on the available height
  gridHeight = Math.floor((screenHeight * 0.86) / cellSize); // 80% of the height for the grid

  // Ensure the new grid dimensions are valid
  if (gridWidth < 2 || gridHeight < 2) return; // At least 2x2 grid is needed

  // Generate a new grid
  grid = getInitialGrid();

  // Randomly place start and end nodes
  placeStartAndEndNodesRandomly();

  // Create the grid
  createGrid();

}

function placeStartAndEndNodesRandomly() {
  // Ensure the grid has been initialized and has valid dimensions
  if (!grid || grid.length === 0 || grid[0].length === 0) {
    console.error('Grid is not properly initialized.');
    return;
  }

  // Variables to store new positions
  let newStartRow, newStartCol, newEndRow, newEndCol;

  // Generate random positions for the start node
  do {
    newStartRow = Math.floor(Math.random() * gridHeight);
    newStartCol = Math.floor(Math.random() * gridWidth);
  } while (newStartRow === FINISH_NODE_ROW && newStartCol === FINISH_NODE_COL);

  // Generate random positions for the end node
  do {
    newEndRow = Math.floor(Math.random() * gridHeight);
    newEndCol = Math.floor(Math.random() * gridWidth);
  } while (newEndRow === newStartRow && newEndCol === newStartCol);

  // Ensure the positions are within the grid bounds
  if (
    newStartRow >= gridHeight || newStartRow < 0 || 
    newStartCol >= gridWidth || newStartCol < 0 ||
    newEndRow >= gridHeight || newEndRow < 0 || 
    newEndCol >= gridWidth || newEndCol < 0
  ) {
    console.error('Random positions are out of bounds.');
    return;
  }

  // Clear previous start and end node positions
  if (grid[START_NODE_ROW] && grid[START_NODE_ROW][START_NODE_COL]) {
    grid[START_NODE_ROW][START_NODE_COL].isStart = false;
  }
  if (grid[FINISH_NODE_ROW] && grid[FINISH_NODE_ROW][FINISH_NODE_COL]) {
    grid[FINISH_NODE_ROW][FINISH_NODE_COL].isFinish = false;
  }

  // Update the grid with new start and end positions
  if (grid[newStartRow] && grid[newStartRow][newStartCol]) {
    grid[newStartRow][newStartCol].isStart = true;
  }
  if (grid[newEndRow] && grid[newEndRow][newEndCol]) {
    grid[newEndRow][newEndCol].isFinish = true;
  }

  // Update global variables for start and end nodes
  START_NODE_ROW = newStartRow;
  START_NODE_COL = newStartCol;
  FINISH_NODE_ROW = newEndRow;
  FINISH_NODE_COL = newEndCol;

  previousStartNode = { row: START_NODE_ROW, col: START_NODE_COL };
  previousEndNode = { row: FINISH_NODE_ROW, col: FINISH_NODE_COL };
}

// Create a node with specific properties
function createNode(col, row) {
  return {
    col,
    row,
    isStart: row === START_NODE_ROW && col === START_NODE_COL,
    isFinish: row === FINISH_NODE_ROW && col === FINISH_NODE_COL,
    distance: Infinity,
    isVisited: false,
    isWall: false,
    previousNode: null,
    weight: 1,
    isWeighted: false,
    mouseIsPressed: false,
  };
}

// Toggle the wall state of a node
function getNewGridWithWallToggled(grid, row, col) {
  const newGrid = grid.slice();
  const node = newGrid[row][col];
  const newNode = {
    ...node,
    isWall: !node.isWall,
  };
  newGrid[row][col] = newNode;
  return newGrid;
}

// Get the CSS class name based on node properties
function getNodeClassName(node) {
  if (node.isStart) return 'node node-start';
  if (node.isFinish) return 'node node-finish';
  if (node.isWall) return 'node node-wall';
  if (node.isWeighted) return 'node node-weighted';
  return 'node';
}

// Function to disable buttons
function disableButtons() {
  document.getElementById('start-button').disabled = true;
  document.getElementById('clear-button').disabled = true;
}

// Function to enable buttons
function enableButtons() {
  document.getElementById('start-button').disabled = false;
  document.getElementById('clear-button').disabled = false;
}

function disableInteraction() {
  const overlay = document.createElement('div');
  overlay.id = 'interaction-blocker';
  overlay.style.position = 'fixed';
  overlay.style.top = '0';
  overlay.style.left = '0';
  overlay.style.width = '100%';
  overlay.style.height = '100%';
  overlay.style.zIndex = '1000';  // Make sure it's on top of everything
  document.body.appendChild(overlay);
}

function enableInteraction() {
  const overlay = document.getElementById('interaction-blocker');
  if (overlay) {
    overlay.remove();
  }
}

startButton.addEventListener('click', async () => {
  disableInteraction();
  disableButtons();
  
  if (selectedAlgorithm === 'dijkstra') {
    await visualizeDijkstra();
  } else if (selectedAlgorithm === 'astar') {
    await visualizeAStar();
  }
  
  enableButtons();
  enableInteraction();
});

let isAlgorithmRunning = false;

startButton.addEventListener('click', async () => {
  if (isAlgorithmRunning) return;  // Prevent starting another run

  isAlgorithmRunning = true;  // Set the flag to indicate algorithm is running
  disableButtons();
  disableInteraction();

  if (selectedAlgorithm === 'dijkstra') {
    await visualizeDijkstra();
  } else if (selectedAlgorithm === 'astar') {
    await visualizeAStar();
  }

  enableButtons();
  enableInteraction();
  isAlgorithmRunning = false;  // Reset the flag after completion
});


// Get button ID based on weight value
function getWeightButtonId(value) {
  if (value === 3) return 'light-weight-button';
  if (value === 5) return 'medium-weight-button';
  if (value === 10) return 'heavy-weight-button';
}




