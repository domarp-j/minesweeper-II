const express = require('express');

const puzzles = require('./data/puzzles');
const { isValidBoard } = require('./utils');

const app = express();
const SERVER_PORT = 8080;

app.use(express.static('dist'));
app.use(express.static('public'));

/**
 * GET a Minesweeper (MS) board.
 */
app.get('/api', (req, res) => {
  // Validate custom MS boards.
  if (req.query.board) {
    if (isValidBoard(req.query.board)) {
      return res.status(200).json({
        board: req.query.board
      });
    }
    return res.status(404).json({
      error: 'We could not build your board. Please check your query parameters and try again.'
    });
  }

  // Send MS board based on layoutIndex.
  if (req.query.layoutIndex) {
    if (puzzles[req.query.layoutIndex]) {
      return res.status(200).json({
        board: puzzles[req.query.layoutIndex]
      });
    }

    return res.status(404).json({
      error: 'We could not find the puzzle you specified. Please check the query parameters and try again.'
    });
  }

  // Send random MS board.
  const randomIndex = Math.floor(Math.random() * puzzles.length);
  console.log(`Sending random board (index ${randomIndex})...`);
  return res.status(200).json({
    board: puzzles[randomIndex]
  });
});

app.listen(SERVER_PORT, () => console.log(`Node server listening on port ${SERVER_PORT}!`));
