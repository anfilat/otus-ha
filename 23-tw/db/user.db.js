const {getValue, get} = require('./core');

async function addUser(login) {
    const sql = `
        INSERT INTO "user" (login)
        VALUES ($1)
        RETURNING id
    `;
    const values = [login];
    return getValue(sql, values, 'id');
}

async function getUser(id) {
    const sql = `
        SELECT id, login
        FROM "user"
        WHERE id = $1
    `;
    const values = [id];
    return get(sql, values);
}

module.exports = {
    addUser,
    getUser,
};
