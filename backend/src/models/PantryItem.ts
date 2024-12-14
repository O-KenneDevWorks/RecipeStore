import mongoose from "mongoose";

/**
 * Pantry Item Schema
 * Defines the structure of documents for the PantryItem collection in MongoDB.
 */
const PantryItemSchema = new mongoose.Schema({
    // Name of the pantry item (required)
    name: {
        type: String,
        required: true,
    },
    // Amount or quantity of the pantry item (required)
    amount: {
        type: Number,
        required: true,
    },
    // Unit of measurement for the pantry item (required)
    unit: {
        type: String,
        required: true, // Fixed typo from 'reqired' to 'required'
    },
});

/**
 * Pantry Item Model
 * Represents the PantryItem collection in MongoDB.
 */
const PantryItem = mongoose.model('PantryItem', PantryItemSchema);

export default PantryItem;
