const express = require('express');
const router = express.Router();
const whoWeAre = require('../controllers/who-we-are');

router.get('/', whoWeAre);

module.exports = router;