import React, { useState, useEffect } from "react";

import Board from './Board';

import "./app.css";

const App = () => {
  const [board, setBoard] = useState('');
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Fetch minesweeper (MS) board data from server.
  useEffect(() => {
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
      if (data.error) {
        setError(true);
        setErrorMessage(data.error);
      }
      if (data.board) {
        setBoard(data.board);
      }
    });
  }, []);

  return (
    <div>
      <h1 id="title">minesweeper</h1>
      {error
        ? <div id="error-message">{errorMessage || "Something went wrong. Please try again later."}</div>
        : <Board template={board} />}

    </div>
  );
};

export default App;
