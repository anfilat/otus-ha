const {get} = require('./core');
const {Tweet} = require('../entity/tweet');

async function addTweet(author, text) {
    const sql = `
        INSERT INTO "tweet" (author_id, text)
        VALUES ($1, $2)
        RETURNING id, created_at
    `;
    const values = [author.id, text];
    const data = await get(sql, values);
    return new Tweet(data.id, author, text, data.created_at);
}

async function getTweet(tweetId) {
    const sql = `
        SELECT tweet.id, text, created_at, author_id, u.login
        FROM "tweet"
                 JOIN "user" as u on u.id = tweet.author_id
        WHERE tweet.id = $1
    `;
    const values = [tweetId];
    const data = await get(sql, values);
    if (!data) {
        return null;
    }
    return new Tweet(data.id, {id: data.author_id, login: data.login}, data.text, data.created_at);
}

module.exports = {
    addTweet,
    getTweet,
};
