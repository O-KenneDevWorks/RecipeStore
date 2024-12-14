// ==========================
// External Imports
// ==========================

// Import Express for creating and managing routes
import { Router } from 'express';

// Import routers for specific features/modules
import { recipeRouter } from './recipe-routes.js';
import { pantryRouter } from './pantry-routes.js';
import { mealPlanRouter } from './mealPlan-routes.js';

// ==========================
// Router Initialization
// ==========================

// Create a router instance using Express
const router = Router();

// ==========================
// Route Definitions
// ==========================

/**
 * @route /recipes
 * @description Routes for managing recipes (CRUD operations, fetching previews, etc.)
 */
router.use('/recipes', recipeRouter);

/**
 * @route /pantry
 * @description Routes for managing pantry items (CRUD operations)
 */
router.use('/pantry', pantryRouter);

/**
 * @route /mealPlan
 * @description Routes for managing meal plans (saving and retrieving meal plans)
 */
router.use('/mealPlan', mealPlanRouter);

// ==========================
// Export
// ==========================

/**
 * Export the main router to be used in the application entry point
 */
export default router;
