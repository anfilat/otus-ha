const timersPromises = require('timers/promises');
const amqp = require('amqplib');
const {exchange} = require('./common');

let conn;
let channel;
let ok;

async function init() {
    let data;
    for (let i = 0; i < 10; i++) {
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
        const ok = channel.assertExchange(exchange, 'direct', {durable: false});
        return {conn, channel, ok};
    } catch (err) {
        return {err};
    }
}

function publish(message) {
    ok = ok.then(() => {
        channel.publish(exchange, 'tweet.published', Buffer.from(message));
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
    publish,
}
