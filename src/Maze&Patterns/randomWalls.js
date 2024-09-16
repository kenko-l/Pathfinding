import {

    grid,
    gridWidth,
    gridHeight,
    updateGrid,
  } from '../js/visualization.js';


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
  
  
  window.onload = () => {
    const randomWallButton = document.getElementById('random-wall-button');
    if (randomWallButton) {
      randomWallButton.addEventListener('click', () => {
        placeRandomWalls(0.2);
      });
    } else {
      console.error('Random wall button not found.');
    }
    

  // Existing code...
};
