const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    name: {type: String, required: true},
    price: {type:String, required: true},
    category: {type: String, required: true},
    stores: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Store'
    }]
});

const Store = mongoose.model("Store", storeSchema);
module.exports = Store;