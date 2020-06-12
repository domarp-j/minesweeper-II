import React, { useState, useEffect } from "react";
import PropTypes from 'prop-types';

const MINE = 'x';

const WIDTH = 16;
const HEIGHT = 16;

const surroundingMineCount = ({ mat, row, col }) => {
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

const Board = ({ template }) => {
  const [matrix, setMatrix] = useState([]);

  // Create a 2D board matrix based on the provided template.
  useEffect(() => {
    const mat = [[]];

    for (let i = 0; i < template.length; i += 1) {
      if (mat[mat.length - 1].length === WIDTH) {
        mat.push([]);
      }
      mat[mat.length - 1].push({
        value: template[i],
        visited: false
      });
    }

    setMatrix(mat);
  }, [template]);

  const revealCell = (row, col) => {
    const mat = JSON.parse(JSON.stringify(matrix));

    mat[row][col] = {
      visited: true,
      value: mat[row][col].value === MINE ? MINE : surroundingMineCount({ mat, row, col })
    };

    setMatrix(mat);
  };

  return (
    <div id="board">
      {matrix.map((row, i) => (
        <div className="row" key={i}>
          {row.map((cell, j) => (
            <button className="cell" type="button" key={`${i}-${j}`} onClick={() => revealCell(i, j)}>
              {cell.visited && cell.value}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
};

Board.propTypes = {
  // The template to build the board, passed in as a 256-char string.
  template: PropTypes.string
};

Board.defaultProps = {
  template: ''
};

export default Board;
