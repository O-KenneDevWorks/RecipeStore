import { useState, useEffect } from 'react';
import axios from 'axios';

interface Recipe {
    _id: string;
    name: string;
}

interface Props {
    userId: string;
}

const MealPlanner = ({ userId }: Props) => {
    const [weekPlan, setWeekPlan] = useState<string[][]>(Array(7).fill([]));
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    useEffect(() => {
        // Fetch recipes at component mount
        const fetchRecipes = async () => {
            const response = await axios.get(`/recipes/${userId}`);
            setRecipes(response.data);
        };
        fetchRecipes();
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

    return (
        <div className="meal-planner">
            <h1>Meal Planner</h1>
            {daysOfWeek.map((day, index) => (
                <div key={index} className="day-plan">
                    <h2>{day}</h2>
                    <ul>
                        {weekPlan[index].map((recipeId, idx) => {
                            const recipe = recipes.find(r => r._id === recipeId);
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
                            {recipes.map(recipe => (
                                <option key={recipe._id} value={recipe._id}>{recipe.name}</option>
                            ))}
                        </select>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default MealPlanner;
