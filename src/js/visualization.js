let START_NODE_ROW = 10;
let START_NODE_COL = 15;
let FINISH_NODE_ROW = 10;
let FINISH_NODE_COL = 35;
let mouseIsPressed = false;
let grid = [];
let draggingStartNode = false;
let draggingEndNode = false;
let previousStartNode = { row: START_NODE_ROW, col: START_NODE_COL };
let previousEndNode = { row: FINISH_NODE_ROW, col: FINISH_NODE_COL };
let addWeightMode = false;

window.onload = () => {
  grid = getInitialGrid();
  createGrid();

  // Get button elements
  const startButton = document.getElementById('start-button');
  const clearButton = document.getElementById('clear-button');
  const weightButton = document.getElementById('medium-weight-button');

  // Add event listeners
  startButton.addEventListener('click', () => {
    disableButtons();
    visualizeDijkstra().then(() => {
      enableButtons();
    });
  });
  
  clearButton.addEventListener('click', clearGrid);

  // Toggle weight mode
  weightButton.addEventListener('click', () => {
    addWeightMode = !addWeightMode; // Toggle weight mode
    weightButton.classList.toggle('active', addWeightMode); // Optional: Add active class for visual feedback
  });

  document.addEventListener('mouseup', handleMouseUp);
};

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

/*
// Handle mouse down event for dragging or wall placement
function handleMouseDown(row, col) {
  if (row === START_NODE_ROW && col === START_NODE_COL) {
    draggingStartNode = true; // Start dragging the start node
  } else if (row === FINISH_NODE_ROW && col === FINISH_NODE_COL) {
    draggingEndNode = true; // Start dragging the end node
  } else {
    grid = getNewGridWithWallToggled(grid, row, col); // Toggle wall
  }
  mouseIsPressed = true;
  handleCellClick(row, col);
  updateGrid();
}

// Handle mouse enter event for dragging or wall placement
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
    // Place walls if dragging elsewhere
    grid = getNewGridWithWallToggled(grid, row, col);
    handleCellClick(row, col);
    updateGrid();
  }
  
}
*/

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
/*
// Handle mouse down event for dragging or wall/weight placement
function handleMouseDown(row, col) {
  mouseIsPressed = true;
  handleCellClick(row, col); // Use handleCellClick for all interactions
  updateGrid();
}

// Handle mouse enter event for dragging or wall/weight placement
function handleMouseEnter(row, col) {
  if (!mouseIsPressed) return;

  handleCellClick(row, col); // Use handleCellClick for all interactions
  updateGrid();
}*/

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
    // Toggle weight: If already weighted, remove it. If not, add weight.
    if (cell.isWeighted) {
      grid[row][col].isWeighted = false;
      grid[row][col].weight = 1; // Reset weight to default value
    } else {
      grid[row][col].isWeighted = true;
      grid[row][col].weight = 5; // Set weight (customize as needed)
    }
    updateGrid();
  } else {
    // Toggle wall state
    grid = getNewGridWithWallToggled(grid, row, col);
  }
}

// Animate Dijkstra's algorithm traversal
function animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder) {
  for (let i = 0; i <= visitedNodesInOrder.length; i++) {
    if (i === visitedNodesInOrder.length) {
      setTimeout(() => {
        animateShortestPath(nodesInShortestPathOrder);
      }, 10 * i);
      return;
    }
    setTimeout(() => {
      const node = visitedNodesInOrder[i];
      const element = document.getElementById(`node-${node.row}-${node.col}`);
      if (element) {
        element.className = 'node node-visited';
      }
    }, 10 * i);
  }
}

// Animate the shortest path found by Dijkstra's algorithm
function animateShortestPath(nodesInShortestPathOrder) {
  const animateNode = (index) => {
    if (index >= nodesInShortestPathOrder.length) return;

    const node = nodesInShortestPathOrder[index];
    const element = document.getElementById(`node-${node.row}-${node.col}`);
    if (element) {
      element.className = 'node node-shortest-path';
    }

    requestAnimationFrame(() => {
      setTimeout(() => {
        animateNode(index + 1);
      }, 1); // Adjust delay as needed
    });
  };

  animateNode(0);
}


// Visualize Dijkstra's algorithm by animating the process
async function visualizeDijkstra() {
  disableGrid();

  const startNode = grid[START_NODE_ROW][START_NODE_COL];
  const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
  const visitedNodesInOrder = dijkstra(grid, startNode, finishNode);
  const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
  // Animate Dijkstra's algorithm traversal
  await new Promise(resolve => {
    animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder);
    resolve();
  });

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
function updateGrid() {
  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[row].length; col++) {
      const node = grid[row][col];
      const nodeElement = document.getElementById(`node-${row}-${col}`);
      nodeElement.className = getNodeClassName(node);
    }
  }
}

// Get the initial grid layout
function getInitialGrid() {
  const grid = [];
  for (let row = 0; row < 24; row++) {
    const currentRow = [];
    for (let col = 0; col <60; col++) {
      currentRow.push(createNode(col, row));
    }
    grid.push(currentRow);
  }
  return grid;
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
  FINISH_NODE_COL = 35;

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
function disableGrid() {
  const gridElement = document.querySelector('.grid');
  gridElement.classList.add('grid-disabled');
}

// Function to enable the grid
function enableGrid() {
  const gridElement = document.querySelector('.grid');
  gridElement.classList.remove('grid-disabled');
}
