// ===============================================
// CONSTANTS
// ===============================================

// MS board identifiers.
export const MINE = 'x';
export const EMPTY_SPACE = '-';
export const FLAG = 'F';

// The MS board dimensions.
export const WIDTH = 16;
export const HEIGHT = 16;

// ===============================================
// HELPER FUNCTIONS
// ===============================================

/**
 * Given a 2D matrix array and a specific postion (row x col),
 * determine the number of mines surrounding the position.
 */
export const surroundingMineCount = ({ mat, row, col }) => {
  let count = 0;

  // Check row above, if possible.
  if (row > 0) {
    if (col > 0 && mat[row - 1][col - 1].value === MINE) {
      count += 1;
    }
    if (mat[row - 1][col].value === MINE) {
      count += 1;
    }
    if (col < WIDTH - 1 && mat[row - 1][col + 1].value === MINE) {
      count += 1;
    }
  }

  // Check row below, if possible.
  if (row < HEIGHT - 1) {
    if (col > 0 && mat[row + 1][col - 1].value === MINE) {
      count += 1;
    }
    if (mat[row + 1][col].value === MINE) {
      count += 1;
    }
    if (col < WIDTH - 1 && mat[row + 1][col + 1].value === MINE) {
      count += 1;
    }
  }

  // Check left and right cells, if possible.
  if (col > 0 && mat[row][col - 1].value === MINE) {
    count += 1;
  }
  if (col < WIDTH - 1 && mat[row][col + 1].value === MINE) {
    count += 1;
  }

  return count;
};

/**
 * Given a 2D matrix array and a specific position (row x col),
 * update the matrix in-place with cell numbers.
 *
 * Assumes that a mine has not been clicked.
 *
 * Return the number of visited cells.
 */
export const updateCells = ({ mat, row, col }) => {
  // Base case - return if past matrix bounds.
  if (row < 0 || row >= WIDTH) return 0;
  if (col < 0 || col >= HEIGHT) return 0;

  // Base case - return if cell has been visited.
  if (mat[row][col].visited) return 0;

  // Determine the new value at position row x col.
  let newValue;
  if (mat[row][col].value === MINE) {
    newValue = MINE;
  } else {
    newValue = surroundingMineCount({ mat, row, col }) || EMPTY_SPACE;
  }

  // Update the matrix at row x col with the new value.
  mat[row][col] = {
    ...mat[row][col],
    visited: true,
    value: newValue,
  };

  // Recursion!
  //
  // In Minesweeper, if a selected cell has 0 surrounding mines,
  // then each surrounding mine is updated in turn.
  //
  // Recursively update surrounding cells and return the visited
  // cell count.
  if (newValue === EMPTY_SPACE) {
    return 1 + updateCells({ mat, row: row - 1, col: col - 1 })
    + updateCells({ mat, row: row - 1, col })
    + updateCells({ mat, row: row - 1, col: col + 1 })
    + updateCells({ mat, row, col: col - 1 })
    + updateCells({ mat, row, col: col + 1 })
    + updateCells({ mat, row: row + 1, col: col - 1 })
    + updateCells({ mat, row: row + 1, col })
    + updateCells({ mat, row: row + 1, col: col + 1 });
  }

  // If recursion isn't necessary, then return 1, since only
  // one cell has been visited.
  return 1;
};

/**
 * Given the board as a string of 256 characters,
 * build a 2D matrix representing this board.
 */
export const initializeMatrix = ({ template }) => {
  const mat = [[]];

  for (let i = 0; i < template.length; i += 1) {
    if (mat[mat.length - 1].length === WIDTH) {
      mat.push([]);
    }
    mat[mat.length - 1].push({
      value: template[i],
      visited: false,
      flagged: false
    });
  }

  return mat;
};

/**
 * Given the board as a string of 256 characters,
 * return the number of mines.
 */
export const countMines = ({ template }) => (
  template.split('').reduce((accum, curr) => {
    if (curr === MINE) return accum + 1;
    return accum;
  }, 0)
);
