const express = require('express');
const router = express.Router();

const db = require('../models');

router.get("/new", function(req,res){
    db.User.findById(req.session.currentUser.id).populate('stores lists').exec(function(err, foundUser){
        if (err) {
            console.log(err);
            res.send({Message: "Internal Server Error"});
        } else {
            const context = {stores: foundUser.stores, lists: foundUser.lists} 
            res.render("Store/new", context);
        }
    
    })
});

router.get("/lists", function(req, res){
    db.User.findById(req.session.currentUser.id).populate('lists').exec(function(err, foundUser){
        if(err) {
            console.log(err);
            res.send({Message: "Internal Server Error"});
        } else {
            const context = {lists: foundUser.lists};
            console.log(context);
            res.render('List/display', context);
        }
    })
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
                    res.redirect(`/store/${createdStore._id}`);
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
            db.User.findById(request.session.currentUser.id).populate('stores').populate('lists').exec(function(err, foundUser){
                if(err) {
                    console.log(err);
                    res.send({Message: "Internal Server Error"});
                } else {
                    const context = {
                        stores: foundUser.stores,
                        lists: foundUser.lists,
                        store: foundStore
                    };
                    console.log(foundStore);
                    res.render("Store/show", context);
                    
                }
            });
        }});
});

router.get("/:id/edit", function(req,res){
    db.Store.findById(req.params.id, function(err, foundStore){
        if (err) {
            console.log(err);
            res.send({Message: "Internal Server Error"});
        } else {
            db.User.findById(req.session.currentUser.id).populate('stores').populate('lists').exec(function(err, foundUser){
                if(err) {
                    console.log(err);
                    res.send({Message: "Internal Server Error"});
                } else {
                    const context = {
                        store: foundStore,
                        stores: foundUser.stores,
                        lists: foundUser.lists,
                    };
                    console.log(foundStore);
                    res.render("Store/edit", context);
                    
                }
            });
        }
    });
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
});

router.delete("/:id", async function(req,res){
    try {
        const deletedStore = await db.Store.findByIdAndDelete(req.params.id);
        const deletedProducts = await db.Product.remove({
            store: deletedStore._id,
        });
        const deletedList = await db.List.remove({
            store: deletedStore._id,
        })
        res.redirect("/homepage");
    } catch (err) {
        console.log(err);
        res.send({message: "Internal Server Error"});
    }
});

router.get('/:id/new-list', async function(req, res){
    db.Store.findById(req.params.id).populate("lists products").exec(function(err, foundStore){
        if(err){
            console.log(err);
            res.send({message: "Internal Server Error"});
        } else{ 
            db.User.findById(req.session.currentUser.id).populate('stores').populate('lists').exec(function(err, foundUser){
            if(err) {
                console.log(err);
                res.send({Message: "Internal Server Error"});
            } else {
                const context = {
                    stores: foundUser.stores,
                    lists: foundUser.lists,
                    store: foundStore
                };
                console.log(foundStore);
                res.render("List/new", context);
        }
    });
     } });
});

router.post("/:id", function(req,res){
    console.log(req.body);
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
                    db.User.findById(req.session.currentUser.id, function(err, foundUser){
                        if(err) {
                            console.log(err)
                            res.send({message: "Internal Server Error"});
                        } else {
                            foundUser.lists.push(createdList);
                            foundUser.save();
                            foundStore.lists.push(createdList);
                            foundStore.save();

                            createdList.store.push(foundStore);
                            createdList.save();
                            console.log(createdList.products);
                            res.redirect(`/store/${foundStore._id}`);
                        }
                    })
                   
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
            db.User.findById(req.session.currentUser.id).populate("stores lists").exec(function(err, foundUser){
                if (err) {
                    console.log(err);
                    res.send({message: "Internal Server Error"});
                } else {
                    const storeId = req.params.id;
                    const context = {list: foundList, store: storeId, stores: foundUser.stores, lists: foundUser.lists};
                    res.render("List/show", context);
                }
            })
        }
    });
    
});

router.delete('/:id/:listId', async function(req,res){
try{
    console.log('test');
    const findList = await db.List.findByIdAndDelete(req.params.listId);
    res.redirect(`/store/${req.params.id}`);
} catch(err){
    console.log(err);
    res.send({Message: "Internal Server Error"});
}
});

module.exports = router;