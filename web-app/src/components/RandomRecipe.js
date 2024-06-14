import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Styling/RandomRecipe.css';

const RandomRecipe = () => {
    const [recipe, setRecipe] = useState(null);
    const [error, setError] = useState(null);

    const fetchRandomRecipe = async () => {
        try {
            const response = await axios.get('http://10.0.0.85:3000/random-recipe');
            setRecipe(response.data);
        } catch (error) {
            setError(error.response?.data?.error || 'Error fetching random recipe');
        }
    };

    useEffect(() => {
        fetchRandomRecipe();
    }, []);

    return (
        <div>
            {error && <p>{error}</p>}
            {recipe ? (
                <div className="random-recipe">
                <h1>{recipe.name}</h1>
                {recipe.image && <img src={recipe.image} alt={recipe.name} />}
                <ul>
                    <li>Prep Time: {recipe.prepTime}</li>
                    <li>Cook Time: {recipe.cookTime}</li>
                    <li>Total Time: {recipe.totalTime}</li>
                    <li>Servings: {recipe.servings}</li>
                    <li>Yield: {recipe.yield}</li>
                </ul>
                <h2>Ingredients</h2>
                <ul>
                    {recipe.ingredients.map((ingredient, index) => (
                        <li key={index}>
                            {ingredient.amount} {ingredient.unit} {ingredient.name}
                        </li>
                    ))}
                </ul>
                <h2>Directions</h2>
                <ol>
                    {recipe.directions.map((direction, index) => (
                        <li key={index}>{direction}</li>
                    ))}
                </ol>
                {recipe.tags && (
                    <div>
                        <h3>Tags</h3>
                        <ul>
                            {recipe.tags.map((tag, index) => (
                                <li key={index}>{tag}</li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
};

export default RandomRecipe;