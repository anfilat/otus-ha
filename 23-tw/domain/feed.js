const db = require('../db');

async function getFeed(userId, count = 20) {
    const tweets = await db.getFeed(userId);

    return tweets ? tweets.slice(0, count) : [];
}

async function putTweet(tweet, followerId) {
    const tweets = await db.getFeed(followerId);
    if (!tweets) {
        return false;
    }

    tweets.push(tweet.toFeed());
    await db.saveFeed(followerId, tweets);
    return true;
}

module.exports = {
    getFeed,
    putTweet,
};
