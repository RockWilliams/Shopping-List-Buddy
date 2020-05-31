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
            res.redirect("/store");
        }
    });
});

router.get("/:id", function(request,res){
    db.Store.findById(request.params.id).populate('products').exec(function(err, foundStore){
        if(err){
            console.log(err);
            res.send({message: "Internal Server Error"});
        } else{
            console.log(foundStore);
            const context = {stores: foundStore};
            res.render("Store/show", context);
        
        }
    });
        //const foundList = await db.Store.findById({});
    }
);

router.get("/:id/edit", async function(req,res){
    try {
        const foundStore = await db.Store.findById(req.params.id);
        const context = {stores: foundStore};
        res.render("Store/edit", context);
    } catch (err) {
        console.log(err);
        res.send({message: "Internal Server Error"});
    }
    
});

router.put("/:id", function(req,res){

    db.Store.findByIdAndUpdate(req.params.id, req.body, {new: true}, function(err, updatedStore){
        if(err) {
            console.log(err);
            res.send({message: "Internal Server Error"});
        } else {
            const context = {stores: updatedStore};
            res.redirect(`/store/${updatedStore._id}`)
        }
    });

    /* try {
        const updatedStore = await db.Store.findByIdAndUpdate(req.params.id, req.body, {new: true});
        const context = {stores: updatedStore};
        res.redirect(`/store/${updatedStore._id}`)
    } catch (err) {
        console.log(err);
        res.send({message: "Internal Server Error"});
    } */
});

router.delete("/:id", async function(req,res){
    try {
        const deletedStore = await db.Store.findByIdAndDelete(req.params.id);
        // const deletedStore = await db.Store.findById(req.params.id); // to test if products are removed
        const deletedProducts = await db.Product.remove({
            store: deletedStore._id,
        });
        res.redirect("/store");
    } catch (err) {
        console.log(err);
        res.send({message: "Internal Server Error"});
    }
});

router.get('/:id/new-list', async function(req, res){
   try{
    const foundStore = await db.findById(req.params.id);
    const context = {stores: foundStore};
    res.render('List/new');
   } catch(err) {
    if(err){
        console.log(err);
        res.send({Message: 'Internal Server Error'});
    }
   }
});



// router.get("/:id", async function(request,res){
//     try {
//         const foundStore = await db.Store.findById(request.params.id);
//         //const foundList = await db.Store.findById({});
//         const context = {stores: foundStore};
//         res.render("Store/show", context);
//     } catch (err) {
//         console.log(err);
//         res.send({message: "Internal Server Error"});
//     }
// });

module.exports = router;