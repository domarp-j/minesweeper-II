import React, { useState, useEffect } from "react";
import ReplayIcon from '@material-ui/icons/Replay';

import {
  FLAG, MINE, WIDTH, HEIGHT, initializeMatrix, countMines, updateCells
} from './utils';

import "./app.css";

const App = () => {
  const [board, setBoard] = useState('');
  const [matrix, setMatrix] = useState([]);
  const [lost, setLost] = useState(false);
  const [mineCount, setMineCount] = useState(0);
  const [visitedCounter, setVisitedCounter] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Fetch minesweeper (MS) board data from server.
  useEffect(() => {
    setVisitedCounter(0);
    setLost(false);

    const params = new URLSearchParams(window.location.search);

    // Build API route.
    let route = '/api';
    if (params.get('board')) {
      route += `?board=${params.get('board')}`;
    } else if (params.get('layoutIndex')) {
      route += `?layoutIndex=${params.get('layoutIndex')}`;
    }

    // Fetch board from API.
    fetch(new Request(route)).then((res) => {
      const result = res.json();
      if (!res.ok) setError(true);
      return result;
    }).then((data) => {
      setLoading(false);
      if (data.error) {
        setError(true);
        setErrorMessage(data.error);
      } else if (data.board) {
        setBoard(data.board);
        setMineCount(countMines({ template: data.board }));
        setMatrix(initializeMatrix({ template: data.board }));
      }
    });
  }, [board]);

  const isVisitedMine = (row, col) => (
    matrix[row][col].visited && matrix[row][col].value === MINE
  );

  const revealCell = (row, col, event) => {
    if (lost) return;

    const mat = JSON.parse(JSON.stringify(matrix));
    let newVisited = 0;

    if (event.shiftKey) {
      mat[row][col].flagged = true;
    } else {
      mat[row][col].flagged = false;

      if (mat[row][col].value === MINE) {
        mat[row][col].visited = true;
        setLost(true);
      } else {
        newVisited += updateCells({ mat, row, col });
      }
    }

    setMatrix(mat);
    setVisitedCounter(visitedCounter + newVisited);
  };

  const resetGame = () => {
    setBoard('');
  };

  return (
    loading ? <main>Loading...</main> : (
      <main>
        <header>
          <h1 id="title">minesweeper</h1>
          <span id="game-message">
            {lost && "You lost! Restart and try again."}
            {!lost && visitedCounter === WIDTH * HEIGHT - mineCount && "You won!"}
          </span>
          <span id="actions">
            <button
              type="button"
              className="reset-button"
              onClick={resetGame}
            >
              <ReplayIcon />
            </button>
          </span>
        </header>
        {error
          ? (
            <div id="error-message">
              {errorMessage || "Something went wrong. Please try again later."}
            </div>
          )
          : (
            <React.Fragment>
              <div id="board">
                {matrix.map((row, i) => (
                  <div className="row" key={i}>
                    {row.map((cell, j) => (
                      <button
                        className={`cell ${isVisitedMine(i, j) ? 'hit-mine' : ''}`}
                        type="button"
                        key={`${i}-${j}`}
                        onClick={event => revealCell(i, j, event)}
                      >
                        {cell.flagged
                          ? FLAG
                          : (cell.visited ? cell.value : <span>&nbsp;</span>)}
                      </button>
                    ))}
                  </div>
                ))}
              </div>
              <div id="instructions">
                <h2>instructions</h2>
                <p>
                  You are a minesweeper looking for mines in a field of cells.
                  Your job is to reveal all of the cells that don&apos;t have mines.
                  But be careful - step on a mine, and you&apos;ll lose!
                </p>
                <p>
                  Click on each cell to reveal the number of mines around it.
                </p>
                <p>Shift + click on a cell to add a flag.</p>
              </div>
            </React.Fragment>
          )}
      </main>
    )
  );
};

export default App;
