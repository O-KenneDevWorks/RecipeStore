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
    deleteRecipe,
} from '../../controllers/recipesController.js';

// Import authentication middleware
import { authenticateToken } from '../../middleware/auth.js';

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
 * @description Fetch all recipes for authenticated user
 * @access Private
 */
router.get('/', authenticateToken, getRecipes);

/**
 * @route GET /recipes/previews
 * @description Fetch recipe previews with name and image only
 * @access Private
 */
router.get('/previews', authenticateToken, getRecipePreviews);

/**
 * @route GET /recipes/random-recipe
 * @description Fetch a random recipe
 * @access Private
 */
router.get('/random-recipe', authenticateToken, getRecipeRandom);

/**
 * @route GET /recipes/:id
 * @description Fetch a specific recipe by ID
 * @access Private
 */
router.get('/:id', authenticateToken, getRecipeById);

/**
 * @route POST /recipes
 * @description Create a new recipe
 * @access Private
 */
router.post('/', authenticateToken, createRecipes);

/**
 * @route PUT /recipes/:id
 * @description Update an existing recipe by ID
 * @access Private
 */
router.put('/:id', authenticateToken, updateRecipes);

/**
 * @route DELETE /recipes/:id
 * @description Delete a specific recipe by ID
 * @access Private
 */
router.delete('/:id', authenticateToken, deleteRecipe);

// ==========================
// Export
// ==========================

// Export the router to be used in the main application
export { router as recipeRouter };
