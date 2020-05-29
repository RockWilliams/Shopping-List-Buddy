const express = require('express');
const router = express.Router();

const db = require('../models');

router.get('/', async function(req, res){
    try {
        const allStores = await db.Store.find({});
        const context = {stores: allStores}
        res.render("index", context);
    } catch (err) {
        console.log(err);
        res.send({message: "Internal Server Error"});
    }

    
});

module.exports = router;