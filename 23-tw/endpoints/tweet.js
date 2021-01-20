const {body} = require('express-validator');
const tweetApi = require('../domain/tweet');

exports.checkAddTweet = [
    body('authorId')
        .toInt(10)
        .isInt(),
    body('text')
        .not().isEmpty(),
    body('async')
        .toBoolean(),
];

exports.addTweet = async (req, res) => {
    const {authorId, text, async} = req.body;

    const success = await tweetApi.save(authorId, text, async);

    res
        .status(success ? 200 : 400)
        .json({success});
};
