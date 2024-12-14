import express from 'express';

import {
    getPantry,
    createPantryItem
} from "../../controllers/pantryController.js"

const router = express.Router();

 // GET /pantry - Get all pantry items
 router.get('/', getPantry);

// POST /pantry - Create a new recipe
router.post('/', createPantryItem);

export { router as pantryRouter };