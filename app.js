const express = require('express');
const cors = require('cors');
const userRouter = require('./routes/userRoutes');
const errorController = require('./controllers/errorController');

const app = express();

app.use(cors());

app.use(express.json());

app.use('/api/v1', userRouter);

app.use('*', errorController);

module.exports = app;
