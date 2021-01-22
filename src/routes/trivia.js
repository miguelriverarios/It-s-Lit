const express = require('express');
const router = express.Router();
const trivia = require('../controllers/trivia');
const submitResponse = require('../controllers/submitResponse');
const yourResults = require('../controllers/your-results');

router.get('/', trivia(false));
router.get('/your-results', yourResults);
router.get('/runoff', trivia(true));

// will figure out if this is the best way to post data at a later date
//router.post('/submit-response', submitResponse);

module.exports = router;