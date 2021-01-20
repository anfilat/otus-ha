const express = require('express');
require('express-async-errors');
const morgan = require('morgan');
require('dotenv').config();
const setupAPI = require('./app.api');
const db = require('./db');
const amqpProducer = require('./rabbit/producer');
const amqpConsumer = require('./rabbit/consumer');

async function init() {
    const app = express();

    app.disable('x-powered-by');

    app.use(morgan('common'));

    db.initDb();
    await amqpProducer.init();
    await amqpConsumer.init();

    setupAPI(app);

    return app;
}

module.exports = init;
