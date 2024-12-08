"use strict";
const mongoose = require('mongoose');
const RecipeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    ingredients: [{
            amount: {
                type: String,
                required: true
            },
            unit: {
                type: String,
                required: true
            },
            name: {
                type: String,
                required: true
            }
        }],
    directions: [{
            type: String,
            required: true
        }],
    prepTime: {
        type: String
    },
    cookTime: {
        type: String
    },
    totalTime: {
        type: String
    },
    servings: {
        type: Number
    },
    yield: {
        type: String
    },
    image: {
        type: String
    },
    tags: {
        type: [String]
    },
    course: {
        type: String,
        enum: ['Main Course', 'Side', 'Salad', 'Soup', 'Appetizer', 'Dessert', 'Breakfast'],
        required: true
    },
    cuisine: {
        type: String,
        required: true
    }
});
module.exports = mongoose.model('Recipe', RecipeSchema);
