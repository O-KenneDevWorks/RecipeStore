import mongoose from "mongoose";
import { COURSE_OPTIONS } from "../constants/options.js"

/**
 * Recipe Schema
 * Defines the structure of documents for the Recipe collection in MongoDB.
 */
const RecipeSchema = new mongoose.Schema({
    // User who created the recipe (required for authenticated users)
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    // Recipe name (required)
    name: {
        type: String,
        required: true,
    },
    // List of ingredient sections (each with an optional title and items)
    ingredients: [
        {
            _id: false,
            title: { type: String, default: '' },
            items: [
                {
                    _id: false,
                    amount: { type: String, required: true },
                    unit:   { type: String, required: true },
                    name:   { type: String, required: true },
                },
            ],
        },
    ],
    // Sections of step-by-step directions (each with an optional title and steps)
    directions: [
        {
            _id: false,
            title: { type: String, default: '' },
            steps: [{ type: String }],
        },
    ],
    notes: {
        type: String,
    },
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
        enum: COURSE_OPTIONS,
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
