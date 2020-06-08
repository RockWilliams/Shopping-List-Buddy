const mongoose = require("mongoose");

const listSchema = new mongoose.Schema({
    name: {type: String, required: true},
    quantity: [Number],
    store: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Store'
    }],
    products: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    }],
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});

const List = mongoose.model("List", listSchema);
module.exports = List;