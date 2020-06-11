import React, { useState, useEffect } from "react";

import Board from './Board';

import "./app.css";

const App = () => {
  const [board, setBoard] = useState('');
  const [hasError, setErrorState] = useState(false);

  // Fetch minesweeper (MS) board data from server.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    // Build API route.
    let route = '/api';
    if (params.get('layoutIndex')) {
      route += `?layoutIndex=${params.get('layoutIndex')}`;
    }

    // Fetch board from API.
    fetch(new Request(route)).then((res) => {
      const result = res.json();
      if (!res.ok) {
        setErrorState(true);
      }
      return result;
    }).then((data) => {
      setBoard(data.board);
    });
  });

  return (
    <div>
      <h1 id="title">minesweeper</h1>
      <div id="message">
        {hasError
          && "Something went wrong when trying to build your board. Please check your query parameters and try again."}
      </div>
      <Board template={board} />
    </div>
  );
};

export default App;
