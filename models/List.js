const mongoose = require("mongoose");

const listSchema = new mongoose.Schema({
    name: {type: String, required: true},
    store: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Store'
    }],
    products: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    }]
});

const List = mongoose.model("List", listSchema);
module.exports = List;