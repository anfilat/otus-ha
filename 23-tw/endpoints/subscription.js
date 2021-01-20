const {body} = require('express-validator');
const subscriptionApi = require('../domain/subscription');

exports.checkSubscribe = [
    body('authorId')
        .toInt(10)
        .isInt(),
    body('followerId')
        .toInt(10)
        .isInt(),
];

exports.subscription = async (req, res) => {
    const {authorId, followerId} = req.body;

    const success = await subscriptionApi.subscribe(authorId, followerId);

    res
        .status(success ? 200 : 400)
        .json({success});
};
