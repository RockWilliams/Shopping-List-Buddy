const express = require('express');
const router = express.Router();
const bcrypt = require("bcryptjs");

const db = require("../models");

router.get("/register", function(req, res){
    res.render("User/register");
});

module.exports = router;

