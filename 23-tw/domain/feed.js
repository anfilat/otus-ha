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

    tweets.push(tweetToFeed(tweet))
    await db.saveFeed(followerId, tweets);
    return true;
}

function tweetToFeed(tweet) {
    return {
        id: tweet.id,
        author: tweet.author.login,
        text: tweet.text,
        createdAt: tweet.createdAt.toISOString()
    };
}

module.exports = {
    getFeed,
    putTweet,
};
