import type { Request, Response } from 'express';
import WeekMealPlan from '../models/MealPlan.js';

// ==========================
// Meal Plan Controller
// ==========================

/**
 * @route POST /mealPlan
 * @description Save or update a weekly meal plan for the authenticated user
 * @access Private
 */
export const createMealPlan = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.userId;
        
        if (!userId) {
            res.status(401).send('User not authenticated');
            return;
        }

        const { meals, year, weekOfYear } = req.body;

        console.log('Request body:', { meals, year, weekOfYear, userId });

        // Validate week of year
        if (weekOfYear < 1 || weekOfYear > 53) {
            res.status(400).send('weekOfYear must be between 1 and 53');
            return;
        }

        // Validate required fields
        if (!meals || !year || !weekOfYear) {
            res.status(400).send('Missing required fields: meals, year, or weekOfYear');
            return;
        }

        // Define the filter to identify the specific meal plan by user, year, and week of the year
        const filter = { userId, year, weekOfYear };

        // Define the update object with the new data
        const update = { userId, meals, year, weekOfYear };

        // Options for findOneAndUpdate to create a new document if none exists
        const options = { upsert: true, new: true, setDefaultsOnInsert: true, runValidators: true };

        console.log('Data sent from client:', meals);

        // Save or update the meal plan in the database
        const mealPlan = await WeekMealPlan.findOneAndUpdate(filter, update, options);

        console.log('Saved meal plan:', mealPlan);

        res.status(201).json(mealPlan);
    } catch (err: any) {
        res.status(500).send('Error saving meal plan: ' + err.message);
    }
};

/**
 * @route GET /mealPlan/:year/:weekOfYear
 * @description Retrieve a specific weekly meal plan for the authenticated user
 * @access Private
 */
export const getMealPlan = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.userId;
        
        if (!userId) {
            res.status(401).send('User not authenticated');
            return;
        }

        const { year, weekOfYear } = req.params;
        
        const mealPlan = await WeekMealPlan.findOne({ 
            userId, 
            year: Number(year), 
            weekOfYear: Number(weekOfYear) 
        });
        
        if (!mealPlan) {
            res.status(404).send('Meal plan not found');
            return;
        }
        
        res.status(200).json(mealPlan);
    } catch (err: any) {
        res.status(500).send('Error fetching meal plan: ' + err.message);
    }
};
