import type { Request, Response } from 'express';
import { Recipe, PantryItem } from '../models/index.js';

// ==========================
// Recipe Controller
// ==========================

/**
 * @route POST /recipes
 * @description Create a new recipe and save it to the database
 * @access Public
 */
export const createRecipes = async (req: Request, res: Response) => {
    try {
        const recipe = new Recipe(req.body);
        await recipe.save();
        res.status(201).send(recipe);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        res.status(400).send('Error adding recipe: ' + errorMessage);
    }
};

/**
 * @route GET /recipes
 * @description Fetch all recipes from the database
 * @access Public
 */
export const getRecipes = async (_req: Request, res: Response) => {
    try {
        const recipes = await Recipe.find({});
        res.status(200).send(recipes);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        res.status(500).send('Error fetching recipes: ' + errorMessage);
    }
};

/**
 * @route GET /recipes/previews
 * @description Fetch recipe previews for the homepage
 * @access Public
 */
export const getRecipePreviews = async (_req: Request, res: Response) => {
    try {
        // Select only the fields needed for the recipe previews: name, image, and _id
        const recipes = await Recipe.find({}, 'name image _id');
        res.status(200).json(recipes);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        res.status(500).send('Error fetching recipe previews: ' + errorMessage);
    }
};

/**
 * @route GET /recipes/:id
 * @description Fetch a specific recipe by its ID
 * @access Public
 */
export const getRecipeById = async (req: Request, res: Response) => {
    try {
        const recipe = await Recipe.findById(req.params.id);
        if (!recipe) {
            res.status(404).send('Recipe not found');
            return;
        }
        res.status(200).send(recipe);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        res.status(500).send('Error fetching recipe: ' + errorMessage);
    }
};

/**
 * @route PUT /recipes/:id
 * @description Update a specific recipe by its ID
 * @access Public
 */
export const updateRecipes = async (req: Request, res: Response) => {
    try {
        const recipe = await Recipe.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!recipe) {
            res.status(404).send('Recipe not found');
            return;
        }
        res.status(200).send(recipe);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        res.status(400).send('Error updating recipe: ' + errorMessage);
    }
};

/**
 * @route GET /recipes/random-recipe
 * @description Fetch a random recipe that matches ingredients from the pantry
 * @access Public
 */
export const getRecipeRandom = async (_req: Request, res: Response) => {
    try {
        // Fetch pantry items and extract their names
        const pantryItems = await PantryItem.find();
        const pantryIngredients = pantryItems.map(item => item.name.toLowerCase());

        // Find recipes that match pantry ingredients
        const recipes = await Recipe.find();
        const matchingRecipes = recipes.filter(recipe =>
            recipe.ingredients.some(ingredient => pantryIngredients.includes(ingredient.name.toLowerCase()))
        );

        if (matchingRecipes.length > 0) {
            // Select a random recipe from the matching recipes
            const randomIndex = Math.floor(Math.random() * matchingRecipes.length);
            const randomRecipe = matchingRecipes[randomIndex];
            res.status(200).send(randomRecipe);
        } else {
            res.status(404).send({ error: 'No matching recipes found' });
        }
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        res.status(500).send({ error: 'Error fetching random recipe: ' + errorMessage });
    }
};
