const express = require('express');
const router = express.Router();

const db = require('../models');

// router.get('/', async function(req, res){
//     try {
//         const allStores = await db.Store.find({});
//         const context = {stores: allStores}
//         res.render("Store/index", context);
//     } catch (err) {
//         console.log(err);
//         res.send({message: "Internal Server Error"});
//     }
// });

router.get('/', function(req, res){
    db.User.findById(req.session.currentUser.id).populate('stores').exec(function(err, foundUser){
        if (err) {
            console.log(err);
        } else {
            const context = {user: foundUser};
            res.render("Store/index", context);
            console.log(context);
        }
    })
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
            db.User.findById(req.session.currentUser.id, function(err, foundUser){
                if (err){
                    console.log(err);
                } else{
                    foundUser.stores.push(createdStore);
                    foundUser.save();
                    res.redirect("/store");
                }
            })
        }
    });
});

router.get("/:id", function(request,res){
    db.Store.findById(request.params.id).populate('lists products').exec(function(err, foundStore){
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
    db.User.stores.findById(req.params.id).populate("lists products").exec(function(err, foundStore){
        if(err){
            console.log(err);
            res.send({message: "Internal Server Error"});
        } else{
            console.log(foundStore);
            const context = {stores: foundStore};
            res.render("List/new", context)
        }
    });


   /* try{
    const foundStore = await (await db.Store.findById(req.params.id)).populate("products");
    console.log(foundStore);
    const context = {stores: foundStore};
    console.log(context);
    res.render('List/new', context);
   } catch(err) {
    if(err){
        console.log(err);
        res.send({Message: 'Internal Server Error'});
    }
   } */
});

router.post("/:id", function(req,res){
    db.List.create(req.body, function(err, createdList){
        if(err){
            console.log(err);
            res.send({message: "Internal Server Error"});
        } else {
            db.Store.findById(req.params.id, function(err, foundStore){
                if(err){
                    console.log(err);
                    res.send({message: "Internal Server Error"});
                } else {
                    foundStore.lists.push(createdList);
                    foundStore.save();
                    console.log(createdList);
                    res.redirect(`/store/${foundStore._id}`);
                }
            });
            
        }
    });
});

router.get("/:id/:listId", function(req,res){
    db.List.findById(req.params.listId).populate("products store").exec(function(err, foundList){
        if(err){
            console.log(err);
            res.send({message: "Internal Server Error"});
        } else {
            const storeId = req.params.id;
            const context = {lists: foundList, store: storeId};
            res.render("List/show", context);
        }
    });
    
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