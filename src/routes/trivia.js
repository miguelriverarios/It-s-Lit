const express = require('express');
const router = express.Router();
const trivia = require('../controllers/trivia');

router.get('/', trivia);

module.exports = router;