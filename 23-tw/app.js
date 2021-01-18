const express = require('express');
require('express-async-errors');
const morgan = require('morgan');
require('dotenv').config();
const setupAPI = require('./app.api');
const db = require('./db');

const app = express();

app.disable('x-powered-by');

app.use(morgan('common'));

setupAPI(app);

db.initDb();

module.exports = app;
