import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom'
import AddRecipeForm from './components/Add_Recipe';
import ViewRecipes from './components/View_Recipes';
import RecipeDetail from './components/RecipeDetail';
import AddPantryItem from './components/AddPantryItem';
import PantryView from './components/PantryView';
import NavBar from './components/NavBar';

const Home = () => {
    return (
        <div className="home">
            <h1>The Recipe Store</h1>
            {/* <nav className="navbar">
                <ul>
                    <li>
                        <Link to="/add-recipe">Add Recipe</Link>
                    </li>
                    <li>
                        <Link to="/view-recipes">View All</Link>
                    </li>
                    <li>
                        <Link to="/add-pantry-item">Add Pantry Item</Link>
                    </li>
                </ul>
            </nav> */}
        </div>
    );
};

const App = () => {
    return (
        <Router>
            <div className="container">
                <NavBar />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/add-recipe" element={<AddRecipeForm />} />
                    <Route path="/view-recipes" element={<ViewRecipes />} />
                    <Route path="/recipe/:id" element={<RecipeDetail />} />
                    <Route path="/add-pantry-item" element={<AddPantryItem />} />
                    <Route path="/pantry" element={<PantryView/>} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;