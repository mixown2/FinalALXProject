/* eslint-disable import/extensions */
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import app from './app.js';

dotenv.config({ path: 'config.env' });

mongoose
  .connect(process.env.DATABASE_URL)
  .then(() => {
    console.log('Database connected');
  })
  .catch((err) => {
    console.log('Database Error');
    process.exit();
  });

const port = process.env.PORT || 5000;

const server = app.listen(port, () => {
  console.log(`Server listening on port ${port} ...`);
});

export default server;
