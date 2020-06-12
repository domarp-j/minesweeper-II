export const MINE = 'x';
export const WIDTH = 16;
export const HEIGHT = 16;

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

/* eslint-disable no-param-reassign */
export const updateCells = ({ mat, row, col }) => {
  if (row < 0 || row >= WIDTH) return 0;
  if (col < 0 || col >= HEIGHT) return 0;

  if (mat[row][col].visited) return 0;

  let newValue;
  if (mat[row][col].value === MINE) {
    newValue = MINE;
  } else {
    newValue = surroundingMineCount({ mat, row, col });
  }

  mat[row][col] = {
    visited: true,
    value: newValue
  };

  if (newValue === 0) {
    return 1 + updateCells({ mat, row: row - 1, col: col - 1 })
    + updateCells({ mat, row: row - 1, col })
    + updateCells({ mat, row: row - 1, col: col + 1 })
    + updateCells({ mat, row, col: col - 1 })
    + updateCells({ mat, row, col: col + 1 })
    + updateCells({ mat, row: row + 1, col: col - 1 })
    + updateCells({ mat, row: row + 1, col })
    + updateCells({ mat, row: row + 1, col: col + 1 });
  }

  return 1;
};
/* eslint-enable no-param-reassign */
