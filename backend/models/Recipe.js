const mongoose = require('mongoose');
 
const RecipeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    ingredients: [{
        amount: {
            type: Number,
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
    }
});
 
module.exports = mongoose.model('Recipe', RecipeSchema);