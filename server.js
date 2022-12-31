const mongoose = require('mongoose');
const dotenv = require('dotenv');

process.on('uncaughtException', (err) => {
  console.log(err.name, err.message);
  console.log('UNCAUGHT EXCEPTION 💥. Shutting down...');
  process.exit(1);
});

dotenv.config({
  path: './config.env',
});

const URI = process.env.DB_URI.replace('<password>', process.env.DB_PASSWORD);

mongoose.set('strictQuery', true);
mongoose
  .connect(URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('DB connection established'))
  .catch((err) => console.error(err));

const PORT = process.env.PORT || 8000;
const app = require('./app');

const server = app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

process.on('unhandledRejection', (err) => {
  console.error(err.name, err.message);
  console.log('UNHANLDED REJECTION 💥. Shutting down...');
  server.close(() => {
    process.exit(1);
  });
});
