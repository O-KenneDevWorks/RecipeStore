import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Styling/MealPlanner.css';

const MealPlanner = () => {
    const [recipes, setRecipes] = useState([]);
    const [weeklyPlan, setWeeklyPlan] = useState({});
    const [mealPlan, setMealPlan] = useState(Array(7).fill({ main: null, sides: [] }));
    const [shoppingList, setShoppingList] = useState([]);

    useEffect(() => {
        const fetchRecipes = async () => {
            try {
                const response = await axios.get('http://10.0.0.85:3000/recipes');
                setRecipes(response.data);
            } catch (error) {
                console.error('Error fetching recipes:', error);
            }
        };

        fetchRecipes();
    }, []);

    const getRandomRecipeByCourse = (course) => {
        const filteredRecipes = recipes.filter(recipe => recipe.course === course);
        if (filteredRecipes.length === 0) {
            console.error(`No recipes found for course: ${course}`);
            return null;
        }
        const randomIndex = Math.floor(Math.random() * filteredRecipes.length);
        return filteredRecipes[randomIndex];
    };

    const generateWeeklyPlan = () => {
        const plan = {};
        ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].forEach(day => {
            plan[day] = {
                mainCourse: getRandomRecipeByCourse('Main Course'),
                side1: getRandomRecipeByCourse('Salad') || getRandomRecipeByCourse('Soup') || getRandomRecipeByCourse('Side'),
                side2: getRandomRecipeByCourse('Salad') || getRandomRecipeByCourse('Soup') || getRandomRecipeByCourse('Side')
            };

            if (!plan[day].mainCourse) {
                console.error(`No main course found for ${day}`);
            }
            if (!plan[day].side1) {
                console.error(`No side 1 found for ${day}`);
            }
            if (!plan[day].side2) {
                console.error(`No side 2 found for ${day}`);
            }
        });
        setWeeklyPlan(plan);
    };

    const regenerateDayPlan = (day) => {
        setWeeklyPlan(prevPlan => ({
            ...prevPlan,
            [day]: {
                mainCourse: getRandomRecipeByCourse('Main Course'),
                side1: getRandomRecipeByCourse('Salad') || getRandomRecipeByCourse('Soup') || getRandomRecipeByCourse('Side'),
                side2: getRandomRecipeByCourse('Salad') || getRandomRecipeByCourse('Soup') || getRandomRecipeByCourse('Side')
            }
        }));
    };

    // const generateShoppingList = () => {
    //     const ingredients = {};
    //     Object.values(weeklyPlan).forEach(dayPlan => {
    //         ['mainCourse', 'side1', 'side2'].forEach(course => {
    //             if (dayPlan[course] && dayPlan[course].ingredients) {
    //                 dayPlan[course].ingredients.forEach(ingredient => {
    //                     const key = `${ingredient.amount} ${ingredient.unit} ${ingredient.name}`;
    //                     if (ingredients[key]) {
    //                         ingredients[key].amount += ingredient.amount;
    //                     } else {
    //                         ingredients[key] = { ...ingredient };
    //                     }
    //                 });
    //             }
    //         });
    //     });
    //     return ingredients;
    // };

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

    const handleAddToShoppingList = (item) => {
        setShoppingList([...shoppingList, item]);
    };

    const handleRemoveFromShoppingList = (index) => {
        setShoppingList(shoppingList.filter((_, i) => i !== index));
    };

    // const shoppingList = generateShoppingList();

    return (
        <div className="meal-planner">
            <h1>Weekly Meal Planner</h1>
            <button onClick={generateWeeklyPlan}>Generate Weekly Plan</button>
            <div className="weekly-plan">
                {Object.keys(weeklyPlan).map(day => (
                    <div key={day} className="day-plan">
                        <h2>{day}</h2>
                        {weeklyPlan[day].mainCourse && <p>Main Course: {weeklyPlan[day].mainCourse.name}</p>}
                        {weeklyPlan[day].side1 && <p>Side 1: {weeklyPlan[day].side1.name}</p>}
                        {weeklyPlan[day].side2 && <p>Side 2: {weeklyPlan[day].side2.name}</p>}
                        {console.log({weeklyPlan})}
                        <button onClick={() => regenerateDayPlan(day)}>Regenerate {day}</button>
                    </div>
                ))}
            </div>
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
                <button onClick={() => handleAddToShoppingList({ name: 'New Item', amount: 1, unit: 'unit' })}>
                    Add Item
                </button>
            </div>
        </div>
    );
};

export default MealPlanner;
