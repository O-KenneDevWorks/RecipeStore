import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom'
import axios from 'axios';
import AddRecipeForm from './components/Add_Recipe';
import ViewRecipes from './components/View_Recipes';
import RecipeDetail from './components/RecipeDetail';
import AddPantryItem from './components/AddPantryItem';
import PantryView from './components/PantryView';
import RandomRecipe from './components/RandomRecipe'
import MealPlanner from './components/MealPlanner';
import EditRecipeForm from './components/EditRecipeForm';
import NavBar from './components/NavBar';
import './components/Styling/Global.css'
import './components/Styling/theme.css'

const Home = () => {
    const [recipes, setRecipes] = useState([]);

    useEffect(() => {
        const fetchRecipes = async () => {
            try {
                const response = await axios.get('/api/recipes/previews');  // Updated endpoint
                setRecipes(response.data);  // Set the fetched recipes to state
            } catch (error) {
                console.error('Failed to fetch recipe previews:', error);
            }
        };

        fetchRecipes();
    }, []);

    return (
        <div className="recipe-grid">
            <h1>The Recipe Store</h1>
            <H2>Your Personal Digital Cookbook</H2>
            {recipes.map((recipe) => (
                <div key={recipe._id} className="recipe-preview">
                    <Link to={`/recipe/${recipe._id}`}>
                        <img src={recipe.imageUrl} alt={recipe.name} style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
                        <h3>{recipe.name}</h3>
                    </Link>
                </div>
            ))}
        </div>
    );
};

const App = () => {
    const [theme, setTheme] = useState('light');

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme)
    }, [theme]);

    const toggleTheme = () => {
        setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
    };

    return (
        <Router>
            <div className="app">
                <NavBar />
                <button className='theme-toggle' onClick={toggleTheme}>
                    Switch to {theme === 'light' ? 'Dark' : 'Light'} Mode
                </button>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/add-recipe" element={<AddRecipeForm />} />
                    <Route path="/view-recipes" element={<ViewRecipes />} />
                    <Route path="/recipes/:id" element={<RecipeDetail />} />
                    <Route path="/add-pantry-item" element={<AddPantryItem />} />
                    <Route path="/pantry" element={<PantryView/>} />
                    <Route path="/random-recipe" element={<RandomRecipe />} />
                    <Route path="/meal-planner" element={<MealPlanner />} />
                    <Route path="/edit-recipe/:id" element={<EditRecipeForm />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;