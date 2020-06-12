import React, { useState, useEffect } from "react";
import PropTypes from 'prop-types';

import {
  MINE, WIDTH, HEIGHT, updateCells
} from './utils';

const Board = ({ template }) => {
  const [matrix, setMatrix] = useState([]);
  const [lost, setLost] = useState(false);
  const [resetCounter, setResetCounter] = useState(0);
  const [visitedCounter, setVisitedCounter] = useState(0);

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
  }, [template, resetCounter]);

  const revealCell = (row, col) => {
    if (lost) return;

    const mat = JSON.parse(JSON.stringify(matrix));
    let newVisited = 0;

    if (mat[row][col].value === MINE) {
      mat[row][col].visited = true;
      newVisited += 1;
      setLost(true);
    } else {
      newVisited += updateCells({ mat, row, col });
    }

    setMatrix(mat);
    setVisitedCounter(visitedCounter + newVisited);
  };

  const resetGame = () => {
    setResetCounter(resetCounter + 1);
    setVisitedCounter(0);
    setLost(false);
  };

  const isVisitedMine = (row, col) => (
    matrix[row][col].visited && matrix[row][col].value === MINE
  );

  return (
    <React.Fragment>
      <div id="actions">
        <button type="button" onClick={resetGame}>Restart</button>
      </div>
      <div id="board">
        {matrix.map((row, i) => (
          <div className="row" key={i}>
            {row.map((cell, j) => (
              <button
                className={`cell ${isVisitedMine(i, j) ? 'hit-mine' : ''}`}
                type="button"
                key={`${i}-${j}`}
                onClick={() => revealCell(i, j)}
              >
                {cell.visited ? cell.value : <span>&nbsp;</span>}
              </button>
            ))}
          </div>
        ))}
      </div>
    </React.Fragment>
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
