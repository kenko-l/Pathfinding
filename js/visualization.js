import { startNode, endNode, grid } from './gridScript.js';
import { dijkstra } from './algorithms.js';

// Helper function to animate the path
async function visualizePath(path) {
    for (let node of path) {
        node.element.classList.add('path'); // Add a class to highlight the path
        await new Promise(resolve => setTimeout(resolve, 100)); // Delay to animate each step
    }
}

// Run Dijkstra's algorithm and visualize
async function runDijkstraAndAnimate() {
    const path = await dijkstra(grid, startNode, endNode);
    await visualizePath(path);
}

// Make sure the script waits for the DOM to be fully loaded before adding the event listener
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('start-button').addEventListener('click', runDijkstraAndAnimate);
});
