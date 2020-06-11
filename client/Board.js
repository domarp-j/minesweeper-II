import React, { useState, useEffect } from "react";
import PropTypes from 'prop-types';

const Board = ({ template }) => {
  const [matrix, setMatrix] = useState([]);

  // Create a 2D board matrix based on the provided template.
  useEffect(() => {
    const mat = [[]];

    for (let i = 0; i < template.length; i += 1) {
      if (mat[mat.length - 1].length === 16) {
        mat.push([]);
      }
      mat[mat.length - 1].push({
        value: template[i],
        visited: false
      });
    }

    setMatrix(mat);
  }, [template]);

  const handleCellClick = (row, col) => {
    const mat = JSON.parse(JSON.stringify(matrix));

    mat[row][col] = {
      visited: true,
      value: mat[row][col].value
    };

    console.log(row, col, mat[row][col]);

    setMatrix(mat);
  };

  return (
    <div id="board">
      {matrix.map((row, i) => (
        <div key={i}>
          {row.map((cell, j) => (
            <button type="button" key={`${i}-${j}`} onClick={() => handleCellClick(i, j)}>
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
