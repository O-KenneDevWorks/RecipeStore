// ==========================
// External Imports
// ==========================

// Import Express for routing
import express from 'express';

// Import pantry controller methods for handling pantry-related requests
import {
    getPantry,
    createPantryItem
} from "../../controllers/pantryController.js";

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
 * @route GET /pantry
 * @description Fetch all pantry items for authenticated user
 * @access Private
 */
router.get('/', authenticateToken, getPantry);

/**
 * @route POST /pantry
 * @description Add a new pantry item
 * @access Private
 */
router.post('/', authenticateToken, createPantryItem);

// ==========================
// Export
// ==========================

/**
 * Export the pantry router to be used in the main application
 */
export { router as pantryRouter };
