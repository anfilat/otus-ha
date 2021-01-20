const {Router} = require('express');
const apiUser = require('../endpoints/user');
const apiSubscription = require('../endpoints/subscription');
const apiFeed = require('../endpoints/feed');
const apiTweet = require('../endpoints/tweet');
const {stopOnError} = require('./util');

const router = Router();

// /api/user
router.post(
    '/user',
    [
        ...apiUser.checkAddUser,
        stopOnError('Incorrect data'),
    ],
    apiUser.addUser
);

// /api/add_followers
router.post(
    '/add_followers',
    [
        ...apiUser.checkAddFollowers,
        stopOnError('Incorrect data'),
    ],
    apiUser.addFollowers
);

// /api/subscription
router.post(
    '/subscription',
    [
        ...apiSubscription.checkSubscribe,
        stopOnError('Incorrect data'),
    ],
    apiSubscription.subscription
);

// /api/tweet
router.post(
    '/tweet',
    [
        ...apiTweet.checkAddTweet,
        stopOnError('Incorrect data'),
    ],
    apiTweet.addTweet
);

// /api/feed
router.get(
    '/feed',
    [
        ...apiFeed.checkGetFeed,
        stopOnError('Incorrect data'),
    ],
    apiFeed.getFeed
);

module.exports = router;
