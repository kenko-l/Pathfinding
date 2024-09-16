export { 
  dijkstra,
  visualizeDijkstra, 
  animateDijkstra, 
  animateShortestPath,
  updateUnvisitedNeighbors,
  getUnvisitedNeighbors,
  getAllNodes,
  getNodesInShortestPathOrder,
 };

import {
  START_NODE_ROW,
  START_NODE_COL,
  FINISH_NODE_ROW,
  FINISH_NODE_COL,
  grid,
  disableGrid,
} from '../js/visualization.js';

// Performs Dijkstra's algorithm; returns *all* nodes in the order
// in which they were visited. Also makes nodes point back to their
// previous node, effectively allowing us to compute the shortest path
// by backtracking from the finish node.

function dijkstra(grid, startNode, finishNode) {
    const visitedNodesInOrder = [];
    startNode.distance = 0;
    const unvisitedNodes = getAllNodes(grid);
    while (unvisitedNodes.length) {
      sortNodesByDistance(unvisitedNodes);
      const closestNode = unvisitedNodes.shift();
      
      // If we encounter a wall, we skip it.
      if (closestNode.isWall) continue;
  
      // If the closest node is at a distance of infinity,
      // we must be trapped and should therefore stop.
      if (closestNode.distance === Infinity) return visitedNodesInOrder;
  
      closestNode.isVisited = true;
      visitedNodesInOrder.push(closestNode);
  
      if (closestNode === finishNode) return visitedNodesInOrder;
  
      updateUnvisitedNeighbors(closestNode, grid);
    }
    return visitedNodesInOrder;
  }
  
function sortNodesByDistance(unvisitedNodes) {
    unvisitedNodes.sort((nodeA, nodeB) => nodeA.distance - nodeB.distance);
  }
  
function updateUnvisitedNeighbors(node, grid) {
    const unvisitedNeighbors = getUnvisitedNeighbors(node, grid);
    for (const neighbor of unvisitedNeighbors) {
        // Include the weight of the neighbor when calculating the new distance
        const tentativeDistance = node.distance + neighbor.weight;
        if (tentativeDistance < neighbor.distance) {
            neighbor.distance = tentativeDistance;
            neighbor.previousNode = node;
        }
    }
  }

function getUnvisitedNeighbors(node, grid) {
    const neighbors = [];
    const { col, row } = node;
    if (row > 0) neighbors.push(grid[row - 1][col]); // Up
    if (row < grid.length - 1) neighbors.push(grid[row + 1][col]); // Down
    if (col > 0) neighbors.push(grid[row][col - 1]); // Left
    if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]); // Right
    return neighbors.filter(neighbor => !neighbor.isVisited);
  }

function getAllNodes(grid) {
    const nodes = [];
    for (const row of grid) {
      for (const node of row) {
        nodes.push(node);
      }
    }
    return nodes;
  }
  
  // Backtracks from the finishNode to find the shortest path.
  // Only works when called *after* the dijkstra method above.
function getNodesInShortestPathOrder(finishNode) {
    const nodesInShortestPathOrder = [];
    let currentNode = finishNode;
    while (currentNode !== null) {
      nodesInShortestPathOrder.unshift(currentNode);
      currentNode = currentNode.previousNode;
    }
    return nodesInShortestPathOrder;
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

