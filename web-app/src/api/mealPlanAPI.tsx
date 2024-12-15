// api/mealPlanAPI.tsx
import { MealPlan, Recipe } from '../interfaces/MealPlan';

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
export const fetchMealPlan = async (userId: string): Promise<MealPlan | null> => {
    try {
        const response = await fetch(`/api/mealPlan/${userId}/2024/50`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        });

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
export const saveMealPlan = async (mealPlan: MealPlan): Promise<void> => {
    try {
        const response = await fetch('/api/mealPlan', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(mealPlan),
        });

        if (!response.ok) {
            throw new Error('Failed to save meal plan');
        }
    } catch (error) {
        console.error('Error saving meal plan:', error);
        throw error;
    }
};
