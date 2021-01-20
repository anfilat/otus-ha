const {body} = require('express-validator');
const userApi = require('../domain/user.js');

exports.checkAddUser = [
    body('login')
        .not().isEmpty().withMessage('Empty login'),
];

exports.addUser = async (req, res) => {
    const {login} = req.body;

    const userId = await userApi.addUser(login);

    const [status, data] = userId ?
        [200, {success: true, userId}] :
        [400, {success: false}];

    res
        .status(status)
        .json(data);
};

exports.checkAddFollowers = [
    body('authorId')
        .toInt(10)
        .isInt(),
    body('count')
        .toInt(10)
        .isInt()
        .withMessage('Count should be positive integer'),
];

exports.addFollowers = async (req, res) => {
    const {authorId, count} = req.body;

    const data = await userApi.addFollowers(authorId, count);

    res
        .status(data.success ? 200 : 400)
        .json(data);
}
