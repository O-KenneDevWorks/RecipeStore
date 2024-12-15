import type { Request, Response } from 'express';
import { PantryItem } from '../models/index.js';

// ==========================
// Pantry Controller
// ==========================

/**
 * @route POST /pantry
 * @description Add a new pantry item to the database
 * @access Public
 */
export const createPantryItem = async (req: Request, res: Response) => {
    try {
        // Create a new PantryItem document using the request body
        const pantryItem = new PantryItem(req.body);

        // Save the new pantry item to the database
        await pantryItem.save();

        // Respond with the newly created pantry item
        res.status(201).send(pantryItem);
    } catch (error) {
        // Handle errors during the creation process
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        res.status(400).send('Error adding pantry item: ' + errorMessage);
    }
};

/**
 * @route GET /pantry
 * @description Retrieve all pantry items from the database
 * @access Public
 */
export const getPantry = async (_req: Request, res: Response) => {
    try {
        // Fetch all pantry items from the database
        const pantryItems = await PantryItem.find({});

        // Respond with the retrieved pantry items
        res.status(200).send(pantryItems);
    } catch (error) {
        // Handle errors during the retrieval process
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        res.status(500).send('Error fetching pantry items: ' + errorMessage);
    }
};
