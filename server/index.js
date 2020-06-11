const express = require('express');

const puzzles = require('../server/data/puzzles');

const app = express();
const SERVER_PORT = 8080;

app.use(express.static('dist'));
app.use(express.static('public'));

/**
 * GET a Minesweeper (MS) board.
 */
app.get('/api', (req, res) => {
  // Let the client handle custom MS boards.
  if (req.query.board) return res.status(204).end();

  // Send MS board based on layoutIndex.
  if (req.query.layoutIndex) {
    if (puzzles[req.query.layoutIndex]) {
      return res.status(200).json({
        board: puzzles[req.query.layoutIndex]
      });
    }

    return res.status(404).json({
      errorMessage: 'Puzzle not found at specified index.'
    });
  }

  // Send random MS board.
  const randomIndex = Math.floor(Math.random() * puzzles.length);
  return res.status(200).json({
    board: puzzles[randomIndex]
  });
});

app.listen(SERVER_PORT, () => console.log(`Node server listening on port ${SERVER_PORT}!`));
