const timersPromises = require('timers/promises');
const amqp = require('amqplib');
const {exchange} = require('./common');
const db = require('../db');
const {putTweet} = require('../domain/feed');

let conn;
let channel;

async function init() {
    let data;
    for (let i = 0; i < 10; i++) {
        data = await connect();
        if (data.err) {
            await timersPromises.setTimeout(500);
        } else {
            conn = data.conn;
            channel = data.channel;
            console.log('RabbitMQ consumer connected');
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
        await channel.assertExchange(exchange, 'direct', {durable: false});
        const queue = (await channel.assertQueue('consumer.tweet.published', {exclusive: true})).queue;
        channel.prefetch(1);
        channel.bindQueue(queue, exchange, 'tweet.published');
        channel.consume(queue, consume, {noAck: false});
        return {conn, channel};
    } catch (err) {
        return {err};
    }
}

async function consume(msg) {
    try {
        const tweetId = JSON.parse(msg.content.toString()).tweetId;
        const tweet = await db.getTweet(tweetId);
        if (!tweet) {
            console.log(`Tweet ID ${tweetId} was not found`);
            channel.nack(msg);
        }

        const followerIds = await db.getFollowerIds(tweet.author.id);
        for (let id of followerIds) {
            await putTweet(tweet, id);
        }

        channel.ack(msg);
    } catch (err) {
        console.log('Incorrect message:', err);
        channel.nack(msg);
    }
}

async function close() {
    try {
        await channel.close();
        await conn.close();
    } catch (e) {
        console.log('Error on RabbitMQ consumer close', e);
    }
}

module.exports = {
    init,
    close,
}
