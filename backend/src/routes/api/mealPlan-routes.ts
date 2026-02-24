// ==========================
// External Imports
// ==========================

// Import Express for creating routes
import express from 'express';

// Import meal plan controller methods for handling meal plan-related requests
import {
    getMealPlan,
    createMealPlan,
} from '../../controllers/mealPlanController.js';

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
 * @route POST /mealPlan
 * @description Save or update a meal plan for the authenticated user
 * @access Private
 */
router.post('/', authenticateToken, createMealPlan);

/**
 * @route GET /mealPlan/:year/:weekOfYear
 * @description Fetch a meal plan for the authenticated user
 * @access Private
 */
router.get('/:year/:weekOfYear', authenticateToken, getMealPlan);

// ==========================
// Export
// ==========================

/**
 * Export the meal plan router to be used in the main application
 */
export { router as mealPlanRouter };
