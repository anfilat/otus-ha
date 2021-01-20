const timersPromises = require('timers/promises');
const amqp = require('amqplib');
const {exchangePublish, exchangeUpdateFeed} = require('./common');
const amqpProducer = require('./producer');
const metrics = require('../graphite');
const db = require('../db');
const {putTweet} = require('../domain/feed');

let conn;
let channel;

async function init() {
    let data;
    for (let i = 0; i < 25; i++) {
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
        await channel.assertExchange(exchangePublish, 'direct', {durable: false});
        await channel.assertExchange(exchangeUpdateFeed, 'x-consistent-hash', {durable: false});
        channel.prefetch(1);

        await addPublishConsumer(channel);
        for (let i = 0; i < 10; i++) {
            await addUpdateFeedConsumer(channel, i);
        }

        return {conn, channel};
    } catch (err) {

        return {err};
    }
}

async function addPublishConsumer(channel) {
    const queue = (await channel.assertQueue('consumer.tweet.published', {exclusive: true})).queue;
    await channel.bindQueue(queue, exchangePublish, 'tweet.published');
    await channel.consume(queue, onTweet, {noAck: false});
}

async function addUpdateFeedConsumer(channel, ind) {
    const queue = (await channel.assertQueue(`consumer.update_feed.received-${ind}`, {exclusive: true})).queue;
    await channel.bindQueue(queue, exchangeUpdateFeed, '1');
    await channel.consume(queue, onUpdateFeed.bind(null, ind), {noAck: false});
}

async function onTweet(msg) {
    try {
        const {tweetId} = JSON.parse(msg.content.toString());
        const tweet = await db.getTweet(tweetId);
        if (!tweet) {
            console.log(`Tweet ID ${tweetId} was not found`);
            channel.nack(msg);
        }

        const followerIds = await db.getFollowerIds(tweet.author.id);
        for (let recipientId of followerIds) {
            amqpProducer.publishUpdateFeed(JSON.stringify({tweetId, recipientId}), recipientId);
        }

        await channel.ack(msg);
    } catch (err) {
        console.log('Incorrect message:', err);
        await channel.nack(msg);
    }
}

async function onUpdateFeed(ind, msg) {
    try {
        const {tweetId, recipientId} = JSON.parse(msg.content.toString());
        const tweet = await db.getTweet(tweetId);
        if (!tweet) {
            console.log(`Tweet ID ${tweetId} was not found`);
            channel.nack(msg);
        }

        await putTweet(tweet, recipientId);
        metrics.increment(`update_feed_received_${ind}`);

        await channel.ack(msg);
    } catch (err) {
        console.log('Incorrect message:', err);
        await channel.nack(msg);
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
