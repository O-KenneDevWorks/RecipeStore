import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Styling/MealPlanner.css';

const MealPlanner = () => {
    const [recipes, setRecipes] = useState([]);
    const [pantryItems, setPantryItems] = useState([]);
    const [mealPlan, setMealPlan] = useState({});
    const [shoppingList, setShoppingList] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const recipesResponse = await axios.get('http://10.0.0.85:3000/recipes');
                const pantryResponse = await axios.get('http://10.0.0.85:3000/pantry');
                setRecipes(recipesResponse.data);
                setPantryItems(pantryResponse.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, []);

    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    const randomizeMeal = () => {
        const randomIndex = Math.floor(Math.random() * recipes.length);
        return recipes[randomIndex];
    };

    const randomizeWeek = () => {
        const newMealPlan = {};
        daysOfWeek.forEach(day => {
            newMealPlan[day] = { main: randomizeMeal(), sides: [randomizeMeal(), randomizeMeal()] };
        });
        setMealPlan(newMealPlan);
    };

    const randomizeDay = (day) => {
        setMealPlan({
            ...mealPlan,
            [day]: { main: randomizeMeal(), sides: [randomizeMeal(), randomizeMeal()] }
        });
    };

    const generateShoppingList = () => {
        const newShoppingList = [];
        Object.values(mealPlan).forEach(meal => {
            [meal.main, ...meal.sides].forEach(recipe => {
                recipe.ingredients.forEach(ingredient => {
                    const existingItem = newShoppingList.find(item => item.name === ingredient.name);
                    if (existingItem) {
                        existingItem.amount += ingredient.amount;
                    } else {
                        newShoppingList.push({ ...ingredient });
                    }
                });
            });
        });
        setShoppingList(newShoppingList);
    };

    const handleAddToShoppingList = (item) => {
        setShoppingList([...shoppingList, item]);
    };

    const handleRemoveFromShoppingList = (index) => {
        setShoppingList(shoppingList.filter((_, i) => i !== index));
    };

    return (
        <div className="meal-planner">
            <h1>Weekly Meal Planner</h1>
            <button onClick={randomizeWeek}>Randomize Week</button>
            <div className="meal-plan">
                {daysOfWeek.map(day => (
                    <div key={day} className="day-plan">
                        <h2>{day}</h2>
                        <button onClick={() => randomizeDay(day)}>Randomize Day</button>
                        <div>
                            <h3>Main Course</h3>
                            {mealPlan[day]?.main?.name || 'None'}
                        </div>
                        <div>
                            <h3>Sides</h3>
                            <ul>
                                {mealPlan[day]?.sides?.map((side, index) => (
                                    <li key={index}>{side.name}</li>
                                )) || 'None'}
                            </ul>
                        </div>
                    </div>
                ))}
            </div>
            <button onClick={generateShoppingList}>Generate Shopping List</button>
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
                <button onClick={() => handleAddToShoppingList({ name: 'New Item', amount: 1, unit: 'unit' })}>
                    Add Item
                </button>
            </div>
        </div>
    );
};

export default MealPlanner;
