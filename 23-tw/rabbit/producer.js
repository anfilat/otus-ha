const timersPromises = require('timers/promises');
const amqp = require('amqplib');
const {exchangePublish, exchangeUpdateFeed} = require('./common');

let conn;
let channel;
let ok;

async function init() {
    let data;
    for (let i = 0; i < 25; i++) {
        data = await connect();
        if (data.err) {
            await timersPromises.setTimeout(500);
        } else {
            conn = data.conn;
            channel = data.channel;
            ok = data.ok;
            console.log('RabbitMQ producer connected');
            return;
        }
    }
    console.error('Unexpected error on amqplib:', data.err);
    process.exit(1);
}

async function connect() {
    try {
        const conn = await amqp.connect(process.env.APP_RABBITMQ);
        const channel = await conn.createChannel();
        await channel.assertExchange(exchangePublish, 'direct', {durable: false});
        await channel.assertExchange(exchangeUpdateFeed, 'x-consistent-hash', {durable: false});

        return {conn, channel, ok: Promise.resolve()};
    } catch (err) {
        return {err};
    }
}

function publishTweet(message) {
    ok = ok.then(() => {
        return channel.publish(exchangePublish, 'tweet.published', Buffer.from(message));
    });
}

function publishUpdateFeed(message, routingKey) {
    ok = ok.then(() => {
        return channel.publish(exchangeUpdateFeed, routingKey, Buffer.from(message));
    });
}

async function close() {
    try {
        await channel.close();
        await conn.close();
    } catch (e) {
        console.log('Error on RabbitMQ producer close', e);
    }
}

module.exports = {
    init,
    close,
    publishTweet,
    publishUpdateFeed,
}
