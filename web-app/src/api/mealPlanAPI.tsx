import { DayPlan } from '../interfaces/MealPlan';
// import { ShortRecipe } from '../interfaces/MealPlan';
import { Recipe } from '../interfaces/Recipe';

// Fetch all recipes for a user
export const fetchRecipes = async (): Promise<Recipe[]> => {
    try {
        const response = await fetch('/api/recipes', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch recipes');
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching recipes:', error);
        return [];
    }
};

// Fetch the meal plan for a user
export const fetchMealPlan = async (weekKey: string) => {
    try {
        const response = await fetch(`/api/mealPlan?week=${encodeURIComponent(weekKey)}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        });

        if (response.status === 404) return null;

        if (!response.ok) {
            throw new Error('Failed to fetch meal plan');
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching meal plan:', error);
        return null;
    }
};

// Update or save the meal plan
export const saveMealPlan = async (weekKey: string, meals: DayPlan[]): Promise<void> => {
    try {
        const response = await fetch('/api/mealPlan', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ week: weekKey, meals }),
        });

        if (!response.ok) {
            throw new Error('Failed to save meal plan');
        }
    } catch (error) {
        console.error('Error saving meal plan:', error);
        throw error;
    }
};
