const express = require('express');
const router = express.Router();
const events = require('../controllers/events');

router.get('/', events);

module.exports = router;