const express = require('express');
const router = express.Router();

const db = require('../models');

router.get('/', async function(req, res){
    try {
        const allStores = await db.Store.find({});
        const context = {stores: allStores}
        res.render("Store/index", context);
    } catch (err) {
        console.log(err);
        res.send({message: "Internal Server Error"});
    }
});

router.get("/new", function(req,res){
    res.render("Store/new");
});

router.post("/", function(req,res){
    db.Store.create(req.body, function(err, createdStore){
        if(err){
            console.log(err);
            res.send({message: "Internal Server Error"});
        } else {
            res.redirect("/");
        }
    });
});

module.exports = router;