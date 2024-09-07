import { startNode, endNode, grid } from './gridScript.js';

async function dijkstra(grid, startNode, endNode) {
    const distances = {};
    const previous = {};
    const unvisited = new Set();
    
    // Initialize distances and unvisited set
    grid.forEach(row => row.forEach(node => {
        distances[node] = node === startNode ? 0 : Infinity;
        unvisited.add(node);
    }));

    // While there are unvisited nodes
    while (unvisited.size) {
        // Get the closest unvisited node
        let closestNode = null;
        for (let node of unvisited) {
            if (!closestNode || distances[node] < distances[closestNode]) {
                closestNode = node;
            }
        }

        // If the closest node is at infinite distance, we are done
        if (distances[closestNode] === Infinity) break;

        // If we reached the end node, break
        if (closestNode === endNode) break;

        // Mark the node as visited
        unvisited.delete(closestNode);

        // Visualize node as being processed (light blue)
        closestNode.element.classList.add('visited');
        await new Promise(resolve => setTimeout(resolve, 50)); // Delay to visualize each step

        // Update distances to the neighboring nodes
        for (let neighbor of closestNode.neighbors) {
            let newDistance = distances[closestNode] + 1; // Assuming equal weights for neighbors
            if (newDistance < distances[neighbor]) {
                distances[neighbor] = newDistance;
                previous[neighbor] = closestNode;
            }
        }
    }

    // Reconstruct path
    let path = [];
    let currentNode = endNode;
    while (currentNode) {
        path.push(currentNode);
        currentNode = previous[currentNode];
    }

    return path.reverse();
}

// Helper function to visualize the path
async function visualizePath(path) {
    for (let node of path) {
        node.element.classList.add('path'); // Add a class to highlight the final path
        await new Promise(resolve => setTimeout(resolve, 100)); // Delay to animate each step
    }
}

export { dijkstra };
