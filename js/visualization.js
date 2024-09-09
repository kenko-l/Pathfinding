const START_NODE_ROW = 10;
const START_NODE_COL = 15;
const FINISH_NODE_ROW = 10;
const FINISH_NODE_COL = 35;
let mouseIsPressed = false;
let grid = [];

window.onload = () => {
  grid = getInitialGrid();
  createGrid();
};

// Handle mouse down event to toggle walls
function handleMouseDown(row, col) {
  grid = getNewGridWithWallToggled(grid, row, col);
  mouseIsPressed = true;
  updateGrid();
}

// Handle mouse enter event to toggle walls while the mouse is pressed
function handleMouseEnter(row, col) {
  if (!mouseIsPressed) return;
  grid = getNewGridWithWallToggled(grid, row, col);
  updateGrid();
}

// Handle mouse up event to stop toggling walls
function handleMouseUp() {
  mouseIsPressed = false;
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
  for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
    setTimeout(() => {
      const node = nodesInShortestPathOrder[i];
      const element = document.getElementById(`node-${node.row}-${node.col}`);
      if (element) {
        element.className = 'node node-shortest-path';
      }
    }, 50 * i);
  }
}

// Visualize Dijkstra's algorithm by animating the process
function visualizeDijkstra() {
  const startNode = grid[START_NODE_ROW][START_NODE_COL];
  const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
  const visitedNodesInOrder = dijkstra(grid, startNode, finishNode);
  const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
  animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder);
}

// Generate the grid dynamically in HTML
function createGrid() {
  const gridElement = document.querySelector('.grid');
  gridElement.innerHTML = '';
  for (let row = 0; row < grid.length; row++) {
    const rowElement = document.createElement('div');
    rowElement.className = 'row';
    for (let col = 0; col < grid[row].length; col++) {
      const node = grid[row][col];
      const nodeElement = document.createElement('div');
      nodeElement.id = `node-${row}-${col}`;
      nodeElement.className = getNodeClassName(node);
      nodeElement.addEventListener('mousedown', () => handleMouseDown(row, col));
      nodeElement.addEventListener('mouseenter', () => handleMouseEnter(row, col));
      nodeElement.addEventListener('mouseup', handleMouseUp);
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
  for (let row = 0; row < 20; row++) {
    const currentRow = [];
    for (let col = 0; col < 50; col++) {
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
  return 'node';
}

// Add event listener to visualize button
document.getElementById('start-button').addEventListener('click', visualizeDijkstra);
