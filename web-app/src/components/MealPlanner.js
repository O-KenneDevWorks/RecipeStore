import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import AddRecipeForm from './Add_Recipe';
import './Styling/MealPlanner.css';

const MealPlanner = () => {
    const [recipes, setRecipes] = useState([]);
    const [weeklyPlan, setWeeklyPlan] = useState(Array(7).fill({ main: null, sides: [null, null] }));
    const [shoppingList, setShoppingList] = useState([]);
    const [showAddRecipe, setShowAddRecipe] = useState(false);
    const [newRecipeName, setNewRecipeName] = useState("");

    useEffect(() => {
        loadMealPlan();
    }, []);
    
    useEffect(() => {
        fetchRecipes();
    }, []);


    const fetchRecipes = async () => {
        try {
            const response = await axios.get('http://10.0.0.85:3000/recipes');
            setRecipes(response.data);
        } catch (error) {
            console.error('Error fetching recipes:', error);
        }
    };

    const handleAddNewRecipeClick = () => {
        setNewRecipeName("Suggested Recipe Name"); // Set based on user input or other logic
        setShowAddRecipe(true);
    };

    const closeAddRecipeModal = () => {
        setShowAddRecipe(false);
    };

    const getRandomRecipeByCourse = (course) => {
        const filteredRecipes = recipes.filter(recipe => recipe.course === course);
        return filteredRecipes.length > 0 ? filteredRecipes[Math.floor(Math.random() * filteredRecipes.length)] : null;
    };

    const handleSetRecipe = (dayIndex, type, recipeId) => {
        const newPlan = [...weeklyPlan];
        const recipe = recipes.find(r => r._id === recipeId) || { name: newRecipeName };
        if (type === 'main') {
            newPlan[dayIndex].main = recipe;
        } else {
            const sideIndex = type === 'side1' ? 0 : 1;
            newPlan[dayIndex].sides[sideIndex] = recipe;
        }
        setWeeklyPlan(newPlan);
    };

    const regenerateDayPlan = (dayIndex) => {
        const newPlan = [...weeklyPlan];
        newPlan[dayIndex] = {
            main: getRandomRecipeByCourse('Main Course'),
            sides: [getRandomRecipeByCourse('Side'), getRandomRecipeByCourse('Side')]
        };
        setWeeklyPlan(newPlan);
    };

    const regenerateMealComponent = (dayIndex, type) => {
        const recipe = getRandomRecipeByCourse(type.includes('main') ? 'Main Course' : 'Side');
        handleSetRecipe(dayIndex, type, recipe ? recipe._id : null);
    };

    const generateWeeklyPlan = () => {
        const newPlan = weeklyPlan.map(() => ({
            main: getRandomRecipeByCourse('Main Course'),
            sides: [getRandomRecipeByCourse('Side'), getRandomRecipeByCourse('Side')]
        }));
        setWeeklyPlan(newPlan);
    };

    const createShoppingList = () => {
        const list = {};
        weeklyPlan.forEach(day => {
            [day.main, ...day.sides].forEach(recipe => {
                if (recipe) {
                    recipe.ingredients.forEach(ingredient => {
                        const key = `${ingredient.name}-${ingredient.unit}`;
                        list[key] = list[key] ? { ...ingredient, amount: list[key].amount + ingredient.amount } : { ...ingredient };
                    });
                }
            });
        });
        setShoppingList(Object.values(list));
    };

    const saveMealPlan = async () => {
        try {
            await axios.post('http://10.0.0.85:3000/mealPlan', { plan: weeklyPlan });
            alert('Meal plan saved successfully!');
        } catch (error) {
            console.error('Error saving meal plan:', error);
            alert('Failed to save meal plan.');
        }
    };

    const handleRemoveFromShoppingList = (index) => {
        // Create a new array excluding the item at the provided index
        const updatedShoppingList = shoppingList.filter((item, itemIndex) => itemIndex !== index);
        // Update the state with the new shopping list
        setShoppingList(updatedShoppingList);
    };

    return (
        <div className="meal-planner">
            <h1>Weekly Meal Planner</h1>
            <button onClick={generateWeeklyPlan}>Generate Whole Week</button>
            {weeklyPlan.map((day, index) => (
                <div key={index} className="day-plan">
                    <h2>Day {index + 1}</h2>
                    <p>Main Course: {day.main ? day.main.name : 'None'}
                        <button onClick={() => regenerateMealComponent(index, 'main')}>Randomize Main</button>
                    </p>
                    <p>Side 1: {day.sides[0] ? day.sides[0].name : 'None'}
                        <button onClick={() => regenerateMealComponent(index, 'side1')}>Randomize Side 1</button>
                    </p>
                    <p>Side 2: {day.sides[1] ? day.sides[1].name : 'None'}
                        <button onClick={() => regenerateMealComponent(index, 'side2')}>Randomize Side 2</button>
                    </p>
                    <button onClick={() => regenerateDayPlan(index)}>Randomize Day</button>
                    <button onClick={handleAddNewRecipeClick}>Add New Recipe</button>
                    <Modal isOpen={showAddRecipe} onRequestClose={closeAddRecipeModal}>
                        <AddRecipeForm initialRecipeName={newRecipeName} onSuccess={closeAddRecipeModal} />
                    </Modal>
                </div>
            ))}
            <button onClick={createShoppingList}>Generate Shopping List</button>
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
            <button onClick={saveMealPlan}>Save Meal Plan</button>
        </div>
    );
};

export default MealPlanner;
