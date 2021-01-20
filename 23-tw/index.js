const initApp = require('./app');
const db = require('./db');
const amqpProducer = require('./rabbit/producer');
const amqpConsumer = require('./rabbit/consumer');

(async function () {
    const app = await initApp();

    const PORT = process.env.APP_PORT ?? 5000;

    const server = app.listen(PORT, () => {
        console.log(`App has been started on port ${PORT}...`);
    });

    server.on('error', error => {
        console.error('Server Error:', error);
        process.exit(1);
    });

    process.once('SIGTERM', shutDown);
    process.once('SIGINT', shutDown);
    process.once('SIGUSR2', shutDown);

    function shutDown(signal) {
        console.log(`${signal} signal received.`);
        closeServer(server)
            .then(() => {
                return Promise.all([
                    closeDb(),
                    closeAmqpProducer(),
                    closeAmqpConsumer(),
                ]);
            })
            .finally(() => {
                console.log('exit');
                process.exit(0)
            })
    }
})();

function closeServer(server) {
    return new Promise((resolve) => {
        server.close((err) => {
            if (err) {
                console.error(err)
            }
            console.log('Http server closed.');
            resolve();
        });
    });
}

function closeDb() {
    return new Promise((resolve) => {
        db.closeDb(() => {
            console.log('DB connect closed.');
            resolve();
        });
    });
}

async function closeAmqpProducer() {
    await amqpProducer.close();
    console.log('RabbitMQ Producer closed.');
}

async function closeAmqpConsumer() {
    await amqpConsumer.close();
    console.log('RabbitMQ Consumer closed.');
}
