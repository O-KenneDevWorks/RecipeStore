import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Styling/MealPlanner.css';

const MealPlanner = () => {
    const [recipes, setRecipes] = useState([]);
    const [weeklyPlan, setWeeklyPlan] = useState({});

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

    const generateShoppingList = () => {
        const ingredients = {};
        Object.values(weeklyPlan).forEach(dayPlan => {
            ['mainCourse', 'side1', 'side2'].forEach(course => {
                if (dayPlan[course] && dayPlan[course].ingredients) {
                    dayPlan[course].ingredients.forEach(ingredient => {
                        const key = `${ingredient.amount} ${ingredient.unit} ${ingredient.name}`;
                        if (ingredients[key]) {
                            ingredients[key].amount += ingredient.amount;
                        } else {
                            ingredients[key] = { ...ingredient };
                        }
                    });
                }
            });
        });
        return ingredients;
    };

    const shoppingList = generateShoppingList();

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
                        <button onClick={() => regenerateDayPlan(day)}>Regenerate {day}</button>
                    </div>
                ))}
            </div>
            <h2>Shopping List</h2>
            <ul>
                {Object.keys(shoppingList).map(key => (
                    <li key={key}>
                        {shoppingList[key].amount} {shoppingList[key].unit} {shoppingList[key].name}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default MealPlanner;
