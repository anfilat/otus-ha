const db = require('../db');
const {subscribe} = require('./subscription');

async function addUser(login) {
    return db.addUser(login);
}

async function addFollowers(authorId, count) {
    const author = db.getUser(authorId);
    if (!author) {
        return {
            success: false,
            message: `User with ID ${authorId} doesn't exist`,
        }
    }

    for (let i = 0; i < count; i++) {
        try {
            const userId = await addUser(`Reader #${authorId}.${i}`)
            if (userId) {
                await subscribe(authorId, userId);
            }
        } catch (e) {
            console.log(`User ${i} couldn't be created`, e);
        }
    }

    return {
        success: true,
    };
}

module.exports = {
    addUser,
    addFollowers,
};
