import type { Request, Response } from 'express';
import WeekMealPlan from '../models/MealPlan.js';

// ───────────────────────────────────────────────────────────
// POST /mealPlan        body: { week: '2025-W15', meals:[…] }
// ───────────────────────────────────────────────────────────
export const createMealPlan = async (req: Request, res: Response) => {
  const { week, meals } = req.body;

  if (typeof week !== 'string' || !Array.isArray(meals)) {
    return res.status(400).send('Body must contain { week:string, meals:DayPlan[] }');
  }

  // Extract year & week number from the ISO‑like key  YYYY-W##
  const match = week.match(/^(\d{4})-W(\d{1,2})$/);
  if (!match) return res.status(400).send('Invalid week format (expected YYYY-W##)');

  const year       = Number(match[1]);
  const weekOfYear = Number(match[2]);

  // Accept only 1‑53 to avoid DB junk
  if (weekOfYear < 1 || weekOfYear > 53) {
    return res.status(400).send('weekOfYear must be between 1 and 53');
  }

  try {
    const filter  = { year, weekOfYear };
    const update = {
        $set: { meals },                // cast & validate each DayPlan
        $setOnInsert: { year, weekOfYear },
      };
    const options = { upsert: true, new: true, setDefaultsOnInsert: true, runValidators: true };

    console.log('Data sent from client:', meals);

    const mealPlan = await WeekMealPlan.findOneAndUpdate(filter, update, options);

    console.log(mealPlan)

    return res.status(201).json(mealPlan);
  } catch (err: any) {
    return res.status(500).send('Error saving meal plan: ' + err.message);
  }
};

// ───────────────────────────────────────────────────────────
// GET /mealPlan?week=2025-W15
// ───────────────────────────────────────────────────────────
export const getMealPlan = async (req: Request, res: Response) => {
  const week = req.query.week as string | undefined;
  if (!week) return res.status(400).send('Query param "week" is required');

  const match = week.match(/^(\d{4})-W(\d{1,2})$/);
  if (!match) return res.status(400).send('Invalid week format (expected YYYY-W##)');

  const year       = Number(match[1]);
  const weekOfYear = Number(match[2]);

  try {
    const mealPlan = await WeekMealPlan.findOne({ year, weekOfYear });
    if (!mealPlan) return res.status(404).send('Meal plan not found');
    return res.status(200).json(mealPlan);
  } catch (err: any) {
    return res.status(500).send('Error fetching meal plan: ' + err.message);
  }
};
