const {query} = require('./core');
const {getUser} = require('./user.db');

async function subscribe(authorId, followerId) {
    const author = await getUser(authorId);
    const follower = await getUser(followerId);
    if (!author || !follower) {
        return false;
    }

    const sql = `
        INSERT INTO "subscription" (author_id, follower_id)
        VALUES ($1, $2)
    `;
    const values = [authorId, followerId];
    await query(sql, values);
    return true;
}

async function getFollowerIds(authorId) {
    const sql = `
        SELECT follower_id
        FROM "subscription"
        WHERE author_id = $1
    `;
    const values = [authorId];
    const data = await query(sql, values);
    return data.rows.map(value => value.follower_id);
}

module.exports = {
    subscribe,
    getFollowerIds,
};
