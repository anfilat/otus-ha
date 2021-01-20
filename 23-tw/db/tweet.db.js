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

module.exports = {
    addTweet,
};
