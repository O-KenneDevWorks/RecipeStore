import type { Request, Response } from 'express';
import { WeekMealPlan } from '../models/index.js';

const TEST_USER_ID = '12341234512413'; // Placeholder User ID for demonstration purposes

// ==========================
// Meal Plan Controller
// ==========================

/**
 * @route POST /mealPlan
 * @description Save or update a weekly meal plan for a specific user
 * @access Public
 */
export const createMealPlan = async (req: Request, res: Response) => {
    const { meals, year, weekOfYear } = req.body;

    // Define the filter to identify the specific meal plan by user, year, and week of the year
    const filter = { userId: TEST_USER_ID, year, weekOfYear };

    // Define the update object with the new data
    const update = { userId: TEST_USER_ID, meals, year, weekOfYear };

    // Options for findOneAndUpdate to create a new document if none exists
    const options = { upsert: true, new: true, setDefaultsOnInsert: true };

    try {
        // Save or update the meal plan in the database
        const mealPlan = await WeekMealPlan.findOneAndUpdate(filter, update, options);

        // Respond with the updated or newly created meal plan
        res.status(201).send(mealPlan);
    } catch (error) {
        // Handle any errors during the save/update process
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        res.status(500).send('Error saving meal plan: ' + errorMessage);
    }
};

/**
 * @route GET /mealPlan/:userId/:year/:weekOfYear
 * @description Retrieve a specific weekly meal plan for a user by year and week of the year
 * @access Public
 */
export const getMealPlan = async (req: Request, res: Response) => {
    try {
        const { userId, year, weekOfYear } = req.params;

        // Query the database for the specified meal plan
        const mealPlan = await WeekMealPlan.findOne({ userId, year, weekOfYear });

        // If no meal plan is found, return a 404 error
        if (!mealPlan) {
            res.status(404).send('Meal plan not found.');
            return;
        }

        // Respond with the retrieved meal plan
        res.status(200).send(mealPlan);
    } catch (error) {
        // Handle any errors during the retrieval process
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        res.status(500).send('Error fetching meal plan: ' + errorMessage);
    }
};
