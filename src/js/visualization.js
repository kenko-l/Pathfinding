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
let weightValue = 5;
let wallMode = false; 

window.onload = () => {
  grid = getInitialGrid();
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
 

  // Add event listeners
  startButton.addEventListener('click', () => {
    disableButtons();
    visualizeDijkstra().then(() => {
      enableButtons();
    });
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

  document.addEventListener('mouseup', handleMouseUp);
};

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
function updateGrid() {
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

// Function to update button states (optional visual feedback)
function updateWeightButtonStates() {
  const buttons = document.querySelectorAll('#light-weight-button, #medium-weight-button, #heavy-weight-button');
  buttons.forEach(button => button.classList.remove('active'));
  document.querySelector(`#${getWeightButtonId(weightValue)}`).classList.add('active');
}

// Get button ID based on weight value
function getWeightButtonId(value) {
  if (value === 3) return 'light-weight-button';
  if (value === 5) return 'medium-weight-button';
  if (value === 10) return 'heavy-weight-button';
}

// Visualize Dijkstra's algorithm by animating the process
// Responsible for the entire Dijkstra's algorithm visualization flow.
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

// Handles the step-by-step animation of the algorithm.
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


