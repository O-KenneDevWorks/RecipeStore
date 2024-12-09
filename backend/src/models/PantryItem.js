"use strict";
const mongoose = require('mongoose');
const PantryItemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    unit: {
        type: String,
        reqired: true
    }
});
module.exports = mongoose.model('PantryItem', PantryItemSchema);
