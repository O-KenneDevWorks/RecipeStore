import type { Request, Response } from 'express';
import { Recipe, PantryItem } from '../models/index.js';

// ==========================
// Recipe Controller
// ==========================

/**
 * @route POST /recipes
 * @description Create a new recipe and save it to the database
 * @access Private
 */
export const createRecipes = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.userId;
        
        if (!userId) {
            res.status(401).send('User not authenticated');
            return;
        }

        const recipe = new Recipe({
            ...req.body,
            userId
        });
        await recipe.save();
        res.status(201).send(recipe);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        res.status(400).send('Error adding recipe: ' + errorMessage);
    }
};

/**
 * @route GET /recipes
 * @description Fetch all recipes from the database for the authenticated user
 * @access Private
 */
export const getRecipes = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.userId;
        
        if (!userId) {
            res.status(401).send('User not authenticated');
            return;
        }

        const recipes = await Recipe.find({ userId });
        res.status(200).send(recipes);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        res.status(500).send('Error fetching recipes: ' + errorMessage);
    }
};

/**
 * @route GET /recipes/previews
 * @description Fetch recipe previews for the homepage
 * @access Private
 */
export const getRecipePreviews = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.userId;
        
        if (!userId) {
            res.status(401).send('User not authenticated');
            return;
        }

        // Select only the fields needed for the recipe previews: name, image, and _id
        const recipes = await Recipe.find({ userId }, 'name image _id');
        res.status(200).json(recipes);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        res.status(500).send('Error fetching recipe previews: ' + errorMessage);
    }
};

/**
 * @route GET /recipes/:id
 * @description Fetch a specific recipe by its ID
 * @access Private
 */
export const getRecipeById = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.userId;
        
        if (!userId) {
            res.status(401).send('User not authenticated');
            return;
        }

        const recipe = await Recipe.findOne({ _id: req.params.id, userId });
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
 * @access Private
 */
export const updateRecipes = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.userId;
        
        if (!userId) {
            res.status(401).send('User not authenticated');
            return;
        }

        const recipe = await Recipe.findOneAndUpdate(
            { _id: req.params.id, userId },
            req.body,
            { new: true, runValidators: true }
        );
        if (!recipe) {
            console.log(`Recipe ${req.params.id} not found`);
            res.status(404).send('Recipe not found');
            return;
        }
        console.log("Updated recipe:", recipe);
        res.status(200).send(recipe);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        res.status(400).send('Error updating recipe: ' + errorMessage);
    }
};

/**
 * @route GET /recipes/random-recipe
 * @description Fetch a random recipe that matches ingredients from the pantry
 * @access Private
 */
export const getRecipeRandom = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.userId;
        
        if (!userId) {
            res.status(401).send('User not authenticated');
            return;
        }

        // Fetch pantry items and extract their names for the authenticated user
        const pantryItems = await PantryItem.find({ userId });
        const pantryIngredients = pantryItems.map(item => item.name.toLowerCase());

        // Find recipes that match pantry ingredients for the authenticated user
        const recipes = await Recipe.find({ userId });
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

/**
 * @route DELETE /recipes/:id
 * @description Delete a specific recipe by its ID
 * @access Private
 */
export const deleteRecipe = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.userId;
        
        if (!userId) {
            res.status(401).send('User not authenticated');
            return;
        }

        const recipe = await Recipe.findOneAndDelete({ _id: req.params.id, userId });
        if (!recipe) {
            res.status(404).send('Recipe not found');
            return;
        }
        res.status(200).send({ message: 'Recipe deleted successfully' });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        res.status(500).send('Error deleting recipe: ' + errorMessage);
    }
};
