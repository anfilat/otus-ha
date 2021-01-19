const {getValue, query} = require('./core');
const {getUser} = require('./user.db');

async function getFeed(userId) {
    const user = await getUser(userId);
    if (!user) {
        return null;
    }

    const sql = `
        SELECT tweets FROM "feed"
        WHERE reader_id = $1
    `;
    const values = [userId];
    const tweets = await getValue(sql, values, 'tweets');
    return tweets ?? [];
}

async function saveFeed(userId, tweets) {
    const sql = `
        INSERT INTO "feed" (reader_id, tweets)
        VALUES ($1, $2)
        ON CONFLICT (reader_id)
        DO UPDATE SET tweets = $2
    `;
    const values = [userId, JSON.stringify(tweets)];
    return query(sql, values);
}

module.exports = {
    getFeed,
    saveFeed,
};
