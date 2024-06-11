import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Navigation from './NavBar';

const ViewRecipes = () => {
    const [recipes, setRecipes] = useState([]);

    useEffect(() => {
        const fetchRecipes = async () => {
            try {
                const response = await axios.get('http://10.0.0.85:3000/recipes');    
                setRecipes(response.data);    
            } catch (error) {
                console.error('Error fetching recipes: ', error);
            }
        };

        fetchRecipes();
    }, []);

    return (
        <div className="recipe-list">
            <h1>All Recipes</h1>
            <ul>
                {recipes.map((recipe) => (
                    <li key={recipe._id}>
                        <Link to={`/recipe/${recipe._id}`}>{recipe.name}</Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ViewRecipes