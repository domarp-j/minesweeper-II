import React, { useState, useEffect } from "react";
import ReplayIcon from '@material-ui/icons/Replay';

import {
  FLAG, MINE, WIDTH, HEIGHT, initializeMatrix, countMines, updateCells
} from './utils';

import "./app.css";

const App = () => {
  // ===============================================
  // STATE
  // ===============================================

  // The board template, as a 256-char string with x's and dashes.
  const [board, setBoard] = useState('');

  // The board as a 2D matrix.
  const [matrix, setMatrix] = useState([]);

  // Determine if the player has lost the game.
  const [lost, setLost] = useState(false);

  // Track the number of mines to determine if the user has won.
  const [mineCount, setMineCount] = useState(0);

  // Track the number of visited cells to determine if the user has won.
  const [visitedCounter, setVisitedCounter] = useState(0);

  // Loading state.
  const [loading, setLoading] = useState(true);

  // Error tracking.
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // ===============================================
  // EFFECTS
  // ===============================================

  /**
   * Game setup.
   *
   * This effect runs on mount and whenever the board is reset.
   */
  useEffect(() => {
    // Reset the game.
    setVisitedCounter(0);
    setLost(false);

    // Parse query params.
    const params = new URLSearchParams(window.location.search);

    // Build the API route.
    let route = '/api';
    if (params.get('board')) {
      route += `?board=${params.get('board')}`;
    } else if (params.get('layoutIndex')) {
      route += `?layoutIndex=${params.get('layoutIndex')}`;
    }

    // Reach out to API for board data.
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

  // ===============================================
  // HELPERS
  // ===============================================

  // Given the position of a cell,
  // determine if the cell has been visited.
  const isVisitedCell = (row, col) => (
    matrix[row][col].visited
  );

  // Given the position of a cell,
  // determine if it is a visited mine.
  const isVisitedMine = (row, col) => (
    isVisitedCell(row, col) && matrix[row][col].value === MINE
  );

  // Reveal a cell on click.
  const revealCell = (row, col, event) => {
    // Do nothing if user has already won or lost.
    if (lost || visitedCounter === WIDTH * HEIGHT - mineCount) return;

    // This is a quick method to copy a multi-dimensional array.
    const mat = JSON.parse(JSON.stringify(matrix));

    // Keep track of the number of cells that become "visited"
    // based on this cell click.
    let newVisited = 0;

    // Once the user clicks on a cell, the following can occur:
    // - If a cell is shift-clicked, then it becomes flagged.
    // - If a cell is clicked and it's a mine, game over!
    // - If a cell is clicked and its not a mine, we need to display the
    //   surrounding mine count.
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

    // Finally, update state based on new data.
    setMatrix(mat);
    setVisitedCounter(visitedCounter + newVisited);
  };

  // Reset the game by clearing the board template.
  // This will re-trigger the setup effect above.
  const resetGame = () => {
    setBoard('');
  };

  // ===============================================
  // RENDER
  // ===============================================

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
                        className={`cell ${isVisitedMine(i, j) ? 'hit-mine' : isVisitedCell(i, j) ? 'hit-cell' : ''}`}
                        type="button"
                        key={`${i}-${j}`}
                        disabled={lost || visitedCounter === WIDTH * HEIGHT - mineCount}
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
