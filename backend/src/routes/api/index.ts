import { Router } from 'express';
import { recipeRouter } from './recipe-routes.js';
import { pantryRouter } from './pantry-routes.js'

const router = Router();

router.use('/recipes', recipeRouter);

router.use('/pantry', pantryRouter);

router.use('/mealPlan', pantryRouter);

export default router;