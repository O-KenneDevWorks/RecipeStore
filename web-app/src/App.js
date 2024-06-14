import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import AddRecipeForm from './components/Add_Recipe';
import ViewRecipes from './components/View_Recipes';
import RecipeDetail from './components/RecipeDetail';
import AddPantryItem from './components/AddPantryItem';
import PantryView from './components/PantryView';
import RandomRecipe from './components/RandomRecipe'
import NavBar from './components/NavBar';
import './components/Styling/Global.css'
import './components/Styling/theme.css'

const Home = () => {
    return (
        <div className="home">
            <h1>The Recipe Store</h1>
            <div className='page-links'>
                <a href='/add-recipe'>Add Recipe</a>
                <a href='/view-recipes'>View Recipes</a>
                <a href='/pantry'>Pantry</a>
                <a href='/add-pantry-item'>Add Pantry Item</a>
                <a href='/random-recipe'>Random Recipe</a>
            </div>
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
                    <Route path="/recipe/:id" element={<RecipeDetail />} />
                    <Route path="/add-pantry-item" element={<AddPantryItem />} />
                    <Route path="/pantry" element={<PantryView/>} />
                    <Route path="/random-recipe" element={<RandomRecipe />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;