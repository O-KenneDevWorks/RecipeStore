import { MealPlan } from '../interfaces/MealPlan';
// import { ShortRecipe } from '../interfaces/MealPlan';
import { Recipe } from '../interfaces/Recipe';
import { fetchWithAuth } from '../utils/auth';

// Fetch all recipes for a user
export const fetchRecipes = async (): Promise<Recipe[]> => {
    try {
        const response = await fetchWithAuth('/api/recipes');

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
export const fetchMealPlan = async (year: number, weekOfYear: number): Promise<MealPlan | null> => {
    try {
        const response = await fetchWithAuth(`/api/mealPlan/${year}/${weekOfYear}`);

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
export const saveMealPlan = async (mealPlan: MealPlan): Promise<void> => {
    try {
        const response = await fetchWithAuth('/api/mealPlan', {
            method: 'POST',
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
