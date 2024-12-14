import type { Request, Response } from 'express';
import { WeekMealPlan } from '../models/index.js';

const TEST_USER_ID = '12341234512413'

// Save or update a meal plan
export const createMealPlan = async (req: Request, res: Response) => {
    const { meals, year, weekOfYear } = req.body;
    const filter = { userId: TEST_USER_ID, year, weekOfYear }; // Filter includes userId, year, and weekOfYear
    const update = { userId: TEST_USER_ID, meals, year, weekOfYear };
    const options = { upsert: true, new: true, setDefaultsOnInsert: true };

    try {
        const mealPlan = await WeekMealPlan.findOneAndUpdate(filter, update, options);
        res.status(201).send(mealPlan);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        res.status(500).send('Error saving meal plan: ' + errorMessage);
    }
};

// Retrieve a meal plan
export const getMealPlan = async (req: Request, res: Response) => {
    try {
        const { userId, year, weekOfYear } = req.params;
        const mealPlan = await WeekMealPlan.findOne({ userId, year, weekOfYear });
        if (!mealPlan) {
            res.status(404).send('Meal plan not found.');
        }
        res.send(mealPlan);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        res.status(500).send('Error fetching meal plan: ' + errorMessage);
    }
};
