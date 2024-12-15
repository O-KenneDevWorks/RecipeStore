// ==========================
// External Imports
// ==========================

// Import Express for routing
import express from 'express';

// Import recipe controller methods for handling recipe-related requests
import { 
    createRecipes,
    getRecipes,
    getRecipeById,
    getRecipePreviews,
    getRecipeRandom,
    updateRecipes,
} from '../../controllers/recipesController.js';

// ==========================
// Router Initialization
// ==========================

// Create a router instance using Express
const router = express.Router();

// ==========================
// Route Definitions
// ==========================

/**
 * @route GET /recipes
 * @description Fetch all recipes
 * @access Public
 */
router.get('/', getRecipes);

/**
 * @route GET /recipes/previews
 * @description Fetch recipe previews with name and image only
 * @access Public
 */
router.get('/previews', getRecipePreviews);

/**
 * @route GET /recipes/random-recipe
 * @description Fetch a random recipe
 * @access Public
 */
router.get('/random-recipe', getRecipeRandom);

/**
 * @route GET /recipes/:id
 * @description Fetch a specific recipe by ID
 * @access Public
 */
router.get('/:id', getRecipeById);

/**
 * @route POST /recipes
 * @description Create a new recipe
 * @access Public
 */
router.post('/', createRecipes);

/**
 * @route PUT /recipes/:id
 * @description Update an existing recipe by ID
 * @access Public
 */
router.put('/:id', updateRecipes);

/**
 * @route DELETE /recipes/:id
 * @description Delete a specific recipe by ID
 * @access Public
 * 
 * Note: Uncomment the route below and implement the deleteRecipe controller
 * in `recipesController.js` to enable this functionality.
 */
// router.delete('/:id', deleteRecipe);

// ==========================
// Export
// ==========================

// Export the router to be used in the main application
export { router as recipeRouter };
