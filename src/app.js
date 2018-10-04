import 'babel-polyfill';
import express from 'express';
import logger from 'morgan';
import bodyParser from 'body-parser';
import cors from 'cors';
// import path from 'path';

import routes from './api/routers/routes';

// Set up the express app
const app = express();
// const env = process.env.NODE_ENV || 'development';

app.use(logger('dev')); // Log requests to the console.
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors()); // enabling cors

// app.use(cors({
//   origin: 'http://localhost:3001'
//   origin: 'http://firdausamasa.com'
//   origin: 'http://firdausamasa.herokuapp.com'
// }));

/**
 * API routes call.
*/
routes(app);

module.exports = app;
