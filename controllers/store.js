const express = require('express');
const router = express.Router();

const db = require('../models');

router.get('/', function(req, res){
    res.send("test");
});

module.exports = router;