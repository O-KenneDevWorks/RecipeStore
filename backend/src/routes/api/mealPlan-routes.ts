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
 * @description Save or update a meal plan for a specific user, year, and week
 * @access Public
 */
router.post('/', createMealPlan);

/**
 * @route GET /mealPlan/:userId/:year/:weekOfYear
 * @description Fetch a meal plan for a specific user, year, and week
 * @access Public
 */
router.get('/:userId/:year/:weekOfYear', getMealPlan);

// ==========================
// Export
// ==========================

/**
 * Export the meal plan router to be used in the main application
 */
export { router as mealPlanRouter };
