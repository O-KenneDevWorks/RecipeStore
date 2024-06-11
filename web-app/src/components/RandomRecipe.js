import React, { useState, useEffect } from 'react';
import axios from 'axios';

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
        <div className='random-recipe'>
            {error && <p>{error}</p>}
            {recipe ? (
                <div>
                    <h2>{recipe.name}</h2>
                    <p>{recipe.directions.join(', ')}</p>
                    <h3>Ingredients:</h3>
                    <ul>
                        {recipe.ingredients.map((ingredient, index) => (
                            <li key={index}>
                                {ingredient.amount} {ingredient.unit} {ingredient.name}
                            </li>
                        ))}
                    </ul>
                </div>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
};

export default RandomRecipe;