import React from 'react';
import '../Styling/DayPlan.css'; // Import the CSS file
import { Recipe } from '../interfaces/MealPlan';

interface DayPlanProps {
    day: string;
    dayIndex: number;
    recipes: Recipe[];
    selectedRecipes: {
        main: string | null;
        sides: string[];
    };
    onAddRecipe: (dayIndex: number, type: 'main' | 'side', recipeId: string, sideIndex?: number) => void;
    onRemoveRecipe: (dayIndex: number, type: 'main' | 'side', sideIndex?: number) => void;
    onRandomRecipe: (dayIndex: number, type: 'main' | 'side', sideIndex?: number) => void;
    onClearDay: (dayIndex: number) => void;
}

const DayPlan: React.FC<DayPlanProps> = ({
    day,
    dayIndex,
    recipes,
    selectedRecipes,
    onAddRecipe,
    onRemoveRecipe,
    onRandomRecipe,
    onClearDay,
}) => {
    return (
        <div className="day-plan">
            <h2>{day}</h2>

            {/* Main Course */}
            <div className="meal-section">
                <h3>Main Course</h3>
                {selectedRecipes.main ? (
                    <div>
                        {recipes.find((r) => r._id === selectedRecipes.main)?.name || 'Recipe not found'}
                        <button onClick={() => onRemoveRecipe(dayIndex, 'main')}>Remove</button>
                    </div>
                ) : (
                    <p>No main course selected</p>
                )}
                <select onChange={(e) => onAddRecipe(dayIndex, 'main', e.target.value)} value={selectedRecipes.main || ''}>
                    <option value="">Select Main Course</option>
                    {recipes.map((recipe) => (
                        <option key={recipe._id} value={recipe._id}>
                            {recipe.name}
                        </option>
                    ))}
                </select>
                <button onClick={() => onRandomRecipe(dayIndex, 'main')}>Randomize Main</button>
            </div>

            {/* Sides */}
            <div className="meal-section">
                <h3>Sides</h3>
                {selectedRecipes.sides.map((sideId, idx) => (
                    <div key={idx}>
                        {recipes.find((r) => r._id === sideId)?.name || 'Recipe not found'}
                        <button onClick={() => onRemoveRecipe(dayIndex, 'side', idx)}>Remove</button>
                    </div>
                ))}
                {selectedRecipes.sides.length < 2 && (
                    <div>
                        <select onChange={(e) => onAddRecipe(dayIndex, 'side', e.target.value, selectedRecipes.sides.length)}>
                            <option value="">Select Side</option>
                            {recipes.map((recipe) => (
                                <option key={recipe._id} value={recipe._id}>
                                    {recipe.name}
                                </option>
                            ))}
                        </select>
                        
                        <button onClick={() => onRandomRecipe(dayIndex, 'side', selectedRecipes.sides.length)}>Randomize Side</button>
                    </div>
                )}
            </div>

            {/* Randomize Day */}
            <button
                onClick={() => {
                    onRandomRecipe(dayIndex, 'main');
                    onRandomRecipe(dayIndex, 'side', 0);
                    onRandomRecipe(dayIndex, 'side', 1);
                }}
            >
                Randomize Day
            </button>

            {/* Clear Day */}
            <button onClick={() => onClearDay(dayIndex)}>Clear Day</button>
        </div>
    );
};

export default DayPlan;
