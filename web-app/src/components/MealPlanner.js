import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Styling/MealPlanner.css';

const MealPlanner = () => {
    const [recipes, setRecipes] = useState([]);
    const [pantryItems, setPantryItems] = useState([]);
    const [mealPlan, setMealPlan] = useState(Array(7).fill({ main: null, sides: [] }));
    const [shoppingList, setShoppingList] = useState([]);

    useEffect(() => {
        const fetchRecipesAndPantry = async () => {
            try {
                const [recipeResponse, pantryResponse] = await Promise.all([
                    axios.get('http://10.0.0.85:3000/recipes'),
                    axios.get('http://10.0.0.85:3000/pantry')
                ]);
                setRecipes(recipeResponse.data);
                setPantryItems(pantryResponse.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchRecipesAndPantry();
    }, []);

    const getRandomRecipeByCourse = (course) => {
        const filteredRecipes = recipes.filter(recipe => recipe.course === course);
        if (filteredRecipes.length === 0) return null;
        return filteredRecipes[Math.floor(Math.random() * filteredRecipes.length)];
    };

    const generateMealPlan = () => {
        const newMealPlan = Array(7).fill(null).map(() => ({
            main: getRandomRecipeByCourse('Main Course'),
            sides: [getRandomRecipeByCourse('Side'), getRandomRecipeByCourse('Side')].filter(Boolean)
        }));
        setMealPlan(newMealPlan);
    };

    const randomizeDay = (dayIndex) => {
        const newMealPlan = [...mealPlan];
        newMealPlan[dayIndex] = {
            main: getRandomRecipeByCourse('Main Course'),
            sides: [getRandomRecipeByCourse('Side'), getRandomRecipeByCourse('Side')].filter(Boolean)
        };
        setMealPlan(newMealPlan);
    };

    const createShoppingList = () => {
        const list = {};
        mealPlan.forEach(day => {
            if (day.main) {
                day.main.ingredients.forEach(ingredient => {
                    const key = `${ingredient.name}-${ingredient.unit}`;
                    if (!list[key]) {
                        list[key] = { ...ingredient };
                    } else {
                        list[key].amount += ingredient.amount;
                    }
                });
            }
            day.sides.forEach(side => {
                side.ingredients.forEach(ingredient => {
                    const key = `${ingredient.name}-${ingredient.unit}`;
                    if (!list[key]) {
                        list[key] = { ...ingredient };
                    } else {
                        list[key].amount += ingredient.amount;
                    }
                });
            });
        });
        setShoppingList(Object.values(list));
    };

    const handleRemoveFromShoppingList = (index) => {
        const newList = [...shoppingList];
        newList.splice(index, 1);
        setShoppingList(newList);
    };

    const handleAddToShoppingList = (ingredient) => {
        setShoppingList([...shoppingList, ingredient]);
    };

    return (
        <div className="meal-planner">
            <h1>Meal Planner</h1>
            <button onClick={generateMealPlan}>Randomize Week</button>
            <div className="meal-plan">
                {mealPlan.map((day, index) => (
                    <div key={index} className="meal-day">
                        <h2>Day {index + 1}</h2>
                        {day.main && <p>Main Course: {day.main.name}</p>}
                        {day.sides.map((side, idx) => (
                            <p key={idx}>Side: {side.name}</p>
                        ))}
                        <button onClick={() => randomizeDay(index)}>Randomize Day</button>
                    </div>
                ))}
            </div>
            <button onClick={createShoppingList}>Create Shopping List</button>
            <div className="shopping-list">
                <h2>Shopping List</h2>
                <ul>
                    {shoppingList.map((item, index) => (
                        <li key={index}>
                            {item.amount} {item.unit} {item.name}
                            <button onClick={() => handleRemoveFromShoppingList(index)}>Remove</button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default MealPlanner;
