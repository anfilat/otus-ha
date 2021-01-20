const {initDb, closeDb} = require('./core');
const {addUser, getUser} = require('./user.db');
const {subscribe, getFollowerIds} = require('./subscription.db');
const {getFeed, saveFeed} = require('./feed.db');
const {addTweet, getTweet} = require('./tweet.db');

module.exports = {
    initDb,
    closeDb,

    addUser,
    getUser,

    subscribe,
    getFollowerIds,

    getFeed,
    saveFeed,

    addTweet,
    getTweet,
};
