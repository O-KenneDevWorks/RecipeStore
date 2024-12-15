import { useState, useEffect } from 'react';
import { fetchRecipes, fetchMealPlan, saveMealPlan } from '../api/mealPlanAPI';
import { Recipe, MealPlan } from '../interfaces/MealPlan';

interface Props {
    userId: string;
}

const MealPlanner = ({ userId }: Props) => {
    const [weekPlan, setWeekPlan] = useState<string[][]>(Array(7).fill([]));
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    useEffect(() => {
        // Fetch recipes and meal plan at component mount
        const loadData = async () => {
            try {
                const recipeData = await fetchRecipes();
                setRecipes(recipeData);

                const mealPlanData = await fetchMealPlan(userId);
                if (mealPlanData) {
                    setWeekPlan(mealPlanData.meals);
                }
            } catch (error) {
                console.error('Error loading data:', error);
            }
        };

        loadData();
    }, [userId]);

    const handleAddRecipe = (dayIndex: number, recipeId: string) => {
        const updatedDay = [...weekPlan[dayIndex], recipeId];
        const updatedWeekPlan = [...weekPlan];
        updatedWeekPlan[dayIndex] = updatedDay;
        setWeekPlan(updatedWeekPlan);
    };

    const handleRemoveRecipe = (dayIndex: number, recipeIndex: number) => {
        const updatedDay = [...weekPlan[dayIndex]];
        updatedDay.splice(recipeIndex, 1);
        const updatedWeekPlan = [...weekPlan];
        updatedWeekPlan[dayIndex] = updatedDay;
        setWeekPlan(updatedWeekPlan);
    };

    const handleRandomRecipe = (dayIndex: number) => {
        const randomRecipe = recipes[Math.floor(Math.random() * recipes.length)];
        handleAddRecipe(dayIndex, randomRecipe._id);
    };

    const handleSaveMealPlan = async () => {
        const mealPlan: MealPlan = {
            userId,
            weekOfYear: 50,
            year: 2024,
            meals: weekPlan,
        };

        try {
            await saveMealPlan(mealPlan);
            alert('Meal plan saved successfully!');
        } catch (error) {
            console.error('Error saving meal plan:', error);
        }
    };

    return (
        <div className="meal-planner">
            <h1>Meal Planner</h1>
            {daysOfWeek.map((day, index) => (
                <div key={index} className="day-plan">
                    <h2>{day}</h2>
                    <ul>
                        {weekPlan[index].map((recipeId, idx) => {
                            const recipe = recipes.find((r) => r._id === recipeId);
                            return (
                                <li key={idx}>
                                    {recipe ? recipe.name : 'Recipe not found'}
                                    <button onClick={() => handleRemoveRecipe(index, idx)}>Remove</button>
                                </li>
                            );
                        })}
                    </ul>
                    <div>
                        <button onClick={() => handleRandomRecipe(index)}>Add Random Recipe</button>
                        <select onChange={(e) => handleAddRecipe(index, e.target.value)} value="">
                            <option value="">Select a Recipe</option>
                            {recipes.map((recipe) => (
                                <option key={recipe._id} value={recipe._id}>
                                    {recipe.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            ))}
            <button onClick={handleSaveMealPlan}>Save Meal Plan</button>
        </div>
    );
};

export default MealPlanner;
