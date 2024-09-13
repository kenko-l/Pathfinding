// Function to create a node element in the grid
function createNodeElement(row, col, isFinish, isStart, isWall, onMouseDown, onMouseEnter, onMouseUp) {
    // Create a new div element for the node
    const nodeElement = document.createElement('div');
  
    // Assign an ID to the node based on its row and column
    nodeElement.id = node-${row}-${col};
  
    // Determine the extra class name based on the node's status (start, finish, wall)
    let extraClassName = '';
    if (isFinish) {
      extraClassName = 'node-finish';
    } else if (isStart) {
      extraClassName = 'node-start';
    } else if (isWall) {
      extraClassName = 'node-wall';
    }
  
    // Assign class names to the node element
    nodeElement.className = node ${extraClassName};
  
    // Add event listeners for mouse events
    nodeElement.addEventListener('mousedown', () => onMouseDown(row, col));
    nodeElement.addEventListener('mouseenter', () => onMouseEnter(row, col));
    nodeElement.addEventListener('mouseup', onMouseUp);
  
    // Return the created node element
    return nodeElement;
  }
  