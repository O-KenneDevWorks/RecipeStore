import mongoose from "mongoose";

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

const PantryItem = mongoose.model('PantryItem', PantryItemSchema)

export default PantryItem;