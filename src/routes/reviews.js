const express = require('express');
const router = express.Router();
const reviews = require('../controllers/reviews');

router.get('/', reviews);

module.exports = router;