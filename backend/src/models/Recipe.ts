import mongoose from "mongoose";

/**
 * Recipe Schema
 * Defines the structure of documents for the Recipe collection in MongoDB.
 */
const RecipeSchema = new mongoose.Schema({
    // Recipe name (required)
    name: {
        type: String,
        required: true,
    },
    // List of ingredients for the recipe
    ingredients: [
        {
            // Quantity of the ingredient (required)
            amount: {
                type: String,
                required: true,
            },
            // Measurement unit of the ingredient (required)
            unit: {
                type: String,
                required: true,
            },
            // Name of the ingredient (required)
            name: {
                type: String,
                required: true,
            },
        },
    ],
    // Step-by-step directions for preparing the recipe (required)
    directions: [
        {
            type: String,
            required: true,
        },
    ],
    // Preparation time for the recipe (optional)
    prepTime: {
        type: String,
    },
    // Cooking time for the recipe (optional)
    cookTime: {
        type: String,
    },
    // Total time (prep + cook) for the recipe (optional)
    totalTime: {
        type: String,
    },
    // Number of servings the recipe yields (optional)
    servings: {
        type: Number,
    },
    // Description of the recipe's yield (e.g., "2 loaves", optional)
    yield: {
        type: String,
    },
    // URL or path to the recipe's image (optional)
    image: {
        type: String,
    },
    // Tags to classify the recipe (e.g., "vegetarian", "quick", optional)
    tags: {
        type: [String],
    },
    // Course type of the recipe (required, restricted to specific values)
    course: {
        type: String,
        enum: ['Main Course', 'Side', 'Salad', 'Soup', 'Appetizer', 'Dessert', 'Breakfast'],
        required: true,
    },
    // Cuisine type of the recipe (required)
    cuisine: {
        type: String,
        required: true,
    },
});

/**
 * Recipe Model
 * Represents the Recipe collection in MongoDB.
 */
const Recipe = mongoose.model('Recipe', RecipeSchema);

export default Recipe;
