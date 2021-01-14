const express = require('express');
const router = express.Router();
const whoWeAre = require('../controllers/whoWeAre');

router.get('/', whoWeAre);

module.exports = router;