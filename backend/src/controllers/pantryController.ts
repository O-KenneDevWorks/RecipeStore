import type { Request, Response } from 'express';
import { PantryItem } from '../models/index.js';


// Route to add a pantry item
export const createPantryItem = async (req: Request, res: Response) => {
    try {
        const pantryItem = new PantryItem(req.body);
        await pantryItem.save();
        res.status(201).send(pantryItem);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        res.status(400).send('Error adding pantry item: ' + errorMessage);
    }
};

// Route to get all pantry items
export const getPantry = async (_req: Request, res: Response) => {
    try {
        const pantryItems = await PantryItem.find({});
        res.status(200).send(pantryItems);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        res.status(500).send('Error fetching pantry items: ' + errorMessage);
    }
};