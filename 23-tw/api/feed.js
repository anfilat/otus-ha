const {query} = require('express-validator');
const feedApi = require('../domain/feed');

exports.checkGetFeed = [
    query('userId')
        .toInt(10)
        .isInt(),
    query('count')
        .optional()
        .toInt(10)
        .isInt(),
];

exports.getFeed = async (req, res) => {
    const {userId, count} = req.query;

    const tweets = await feedApi.getFeed(userId, count);

    res
        .status(tweets.length > 0 ? 200 : 204)
        .json({tweets});
};
