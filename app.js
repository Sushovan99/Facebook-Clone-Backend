const express = require('express');

const app = express();

app.get('/', (req, res) => {
  res.end('Welcome to Backend');
});

module.exports = app;
