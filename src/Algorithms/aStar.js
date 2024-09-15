import {
    START_NODE_ROW,
    START_NODE_COL,
    FINISH_NODE_ROW,
    FINISH_NODE_COL,
    grid,
    disableGrid,
  } from '../js/visualization.js';

  import {
    getAllNodes,
    getUnvisitedNeighbors,
    getNodesInShortestPathOrder,
    animateShortestPath,
  } from '../Algorithms/dijkstra.js';

// Performs A* algorithm; returns all nodes in the order
// in which they were visited. Also makes nodes point back to their
// previous node, effectively allowing us to compute the shortest path
// by backtracking from the finish node.

function aStar(grid, startNode, finishNode) {
    const visitedNodesInOrder = [];
    startNode.distance = 0;
    startNode.heuristic = calculateHeuristic(startNode, finishNode);
    startNode.f = startNode.distance + startNode.heuristic;

    const unvisitedNodes = getAllNodes(grid);
    const priorityQueue = [];
    priorityQueue.push(startNode);

    while (priorityQueue.length) {
        priorityQueue.sort((nodeA, nodeB) => nodeA.f - nodeB.f);
        const closestNode = priorityQueue.shift();

        if (closestNode.isWall) continue;
        if (closestNode.distance === Infinity) return visitedNodesInOrder;

        closestNode.isVisited = true;
        visitedNodesInOrder.push(closestNode);

        if (closestNode === finishNode) return visitedNodesInOrder;

        updateUnvisitedNeighborsAStar(closestNode, grid, finishNode, priorityQueue);
    }
    return visitedNodesInOrder;
}

function updateUnvisitedNeighborsAStar(node, grid, finishNode, priorityQueue) {
    const unvisitedNeighbors = getUnvisitedNeighbors(node, grid);
    for (const neighbor of unvisitedNeighbors) {
        const tentativeDistance = node.distance + neighbor.weight;
        if (tentativeDistance < neighbor.distance) {
            neighbor.distance = tentativeDistance;
            neighbor.previousNode = node;
            neighbor.heuristic = calculateHeuristic(neighbor, finishNode);
            neighbor.f = neighbor.distance + neighbor.heuristic;
            if (!priorityQueue.includes(neighbor)) {
                priorityQueue.push(neighbor);
            }
        }
    }
}

function calculateHeuristic(node, finishNode) {
    // Manhattan distance
    return Math.abs(node.row - finishNode.row) + Math.abs(node.col - finishNode.col);
}

export async function visualizeAStar() {
    disableGrid();

    const startNode = grid[START_NODE_ROW][START_NODE_COL];
    const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
    const visitedNodesInOrder = aStar(grid, startNode, finishNode);
    const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);

    await new Promise(resolve => {
        animateAStar(visitedNodesInOrder, nodesInShortestPathOrder);
        resolve();
    });
}

function animateAStar(visitedNodesInOrder, nodesInShortestPathOrder) {
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
