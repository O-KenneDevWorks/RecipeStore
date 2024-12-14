import express from 'express';

import { 
    createRecipes,
    getRecipes,
    getRecipeById,
    getRecipePreviews,
    getRecipeRandom,
    updateRecipes,
 } from '../../controllers/recipesController.js';

const router = express.Router();

 // GET /recipes - Get all recipes
router.get('/', getRecipes);

// GET /recipes - Get the name and image of all recipes
router.get('/previews', getRecipePreviews);

// GET /recipes - Get a random recipe
router.get('/random-recipe', getRecipeRandom);

// GET /recipes:id - Get a recipe by ID
router.get('/:id', getRecipeById);

// POST /recipes - Create a new recipe
router.post('/', createRecipes);

// PUT /recipes/:id - Update a recipe by ID
router.put('/:id', updateRecipes);

// DELETE /recipes/:id - Delete a recipe by ID
// router.delete('/', deleteRecipe);

export { router as recipeRouter };