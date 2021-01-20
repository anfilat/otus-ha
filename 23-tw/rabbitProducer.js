const amqp = require('amqplib');

const exchange = 'tweet.published';

let conn;
let channel;
let ok;

async function initProducer() {
    try {
        conn = await amqp.connect(process.env.APP_RABBITMQ);
        channel = await conn.createChannel();
        ok = channel.assertExchange(exchange, 'direct', {durable: false});
    } catch (err) {
        console.error('Unexpected error on amqplib:', err);
        process.exit(1);
    }
}

function publish(message) {
    ok = ok.then(() => {
        channel.publish(exchange, 'tweet.published', Buffer.from(message));
    });
}

async function closeProducer() {
    await channel.close()
    await conn.close()
}

module.exports = {
    initProducer,
    closeProducer,
    publish,
}
