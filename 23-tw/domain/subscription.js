const db = require('../db');

async function subscribe(authorId, followerId) {
    return db.subscribe(authorId, followerId);
}

module.exports = {
    subscribe,
};
