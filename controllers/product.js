const express = require('express');
const router = express.Router();

const db = require('../models');

router.get('/', function(req,res){
    res.render('Product/index');
})

router.get("/new", function(req, res){
    db.User.findById(req.session.currentUser.id).populate('stores').exec(function(err, foundUser){
        if(err){
            console.log(err);
        } else{
            const context = {user: foundUser}
            res.render('Product/new', context);
        }
    }); 
});
router.post('/', function(req,res){
    db.Product.create(req.body, function(err, createdProduct){
        if (err){
            console.log(err);
        } else {
            console.log(createdProduct);
            db.Store.findById(createdProduct.store, function(err, foundStore){
                if (err){
                    console.log(err);
                } else {
                    foundStore.products.push(createdProduct);
                    foundStore.save();
                    res.redirect(`/store/${foundStore._id}`);
                    console.log(foundStore);
                }
            })
        }
    })
});
module.exports = router;