import type { Request, Response } from 'express';
import { Recipe, PantryItem } from '../models/index.js';

// Route to add a recipe
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

// Route to get all recipes
export const getRecipes = async (_req: Request, res: Response) => {
    try {
        const recipes = await Recipe.find({});
        res.status(200).send(recipes);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        res.status(500).send('Error fetching recipes: ' + errorMessage);
    }
};

// Route to get recipe previews for the homepage
export const getRecipePreviews = async (_req: Request, res: Response) => {
    try {
        // Select only the fields needed for the recipe previews: name, imageUrl, and _id
        const recipes = await Recipe.find({}, 'name image _id');
        res.status(200).json(recipes);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        res.status(500).send('Error fetching recipe previews: ' + errorMessage);
    }
};

// Route to get a specific recipe by ID
export const getRecipeById = async (req: Request, res: Response) => {
    try {
        const recipe = await Recipe.findById(req.params.id);
        if (!recipe) {
            res.status(404).send('Recipe not found');
        }
        res.status(200).send(recipe);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        res.status(500).send('Error fetching recipe: ' + errorMessage);
    }
};

// Route to update a recipe by ID
export const updateRecipes = async (req: Request, res: Response) => {
    try {
        const recipe = await Recipe.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!recipe) {
            res.status(404).send('Recipe not found');
        }
        res.status(200).send(recipe);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        res.status(400).send('Error updating recipe: ' + errorMessage);
    }
};

export const getRecipeRandom = async (_req: Request, res: Response) => {
    try {
        const pantryItems = await PantryItem.find();
        const pantryIngredients = pantryItems.map(item => item.name.toLowerCase());
        const recipes = await Recipe.find();
        const matchingRecipes = recipes.filter(recipe =>
            recipe.ingredients.some(ingredient => pantryIngredients.includes(ingredient.name.toLowerCase()))
        );
        if (matchingRecipes.length > 0) {
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