const express = require('express');

const app = express();
const SERVER_PORT = 8080;

app.use(express.static('dist'));
app.use(express.static('public'));

// add server code here

app.listen(SERVER_PORT, () => console.log(`Node server listening on port ${SERVER_PORT}!`));
