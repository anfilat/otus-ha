const db = require('../db');
const {putTweet} = require('./feed');
const amqpProducer = require('../rabbit/producer');

async function save(authorId, text, async) {
    return (async ?
        saveTweetAsync(authorId, text) :
        saveTweetSync(authorId, text)
    );
}

async function saveTweetSync(authorId, text) {
    const tweet = await saveTweet(authorId, text);
    if (!tweet) {
        return null;
    }

    await spreadTweet(tweet);

    return true;
}

async function saveTweetAsync(authorId, text) {
    const tweet = await saveTweet(authorId, text);
    if (!tweet) {
        return null;
    }

    amqpProducer.publish(tweet.toAMPQMessage());

    return true;
}

async function spreadTweet(tweet) {
    const followerIds = await db.getFollowerIds(tweet.author.id);
    for (let id of followerIds) {
        await putTweet(tweet, id);
    }
}

async function saveTweet(authorId, text) {
    const author = await db.getUser(authorId);
    if (!author) {
        return null;
    }
    return db.addTweet(author, text);
}

module.exports = {
    save,
};
