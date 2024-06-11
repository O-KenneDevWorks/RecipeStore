import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Navigation from './NavBar';

const RecipeDetail = () => {
    const { id } = useParams();
    const [recipe, setRecipe] = useState(null);

    useEffect(() => {
        const fetchRecipe = async () => {
            try {
                const response = await axios.get(`http://10.0.0.85:3000/recipes/${id}`);
                setRecipe(response.data);
            } catch (error) {
                console.error('Error fetching recipe', error);
            }
        };

        fetchRecipe();
    }, [id]);

    if (!recipe) {
        return <div>Loading...</div>;
    }

    return (
        <div className="recipe-details">
            <h2>{recipe.name}</h2>
            <Navigation />
            <div className="info">
                <div>Prep Time: {recipe.prepTime}</div>
                <div>Cook Time: {recipe.cookTime}</div>
                <div>Total Time: {recipe.totalTime}</div>
                <div>Servings: {recipe.servings}</div>
                <div>Yield: {recipe.yield}</div>
            </div>
            <h3>Ingredients</h3>
            <ul>
                {recipe.ingredients.map((ingredient, index) => (
                    <li key={index}>
                        {ingredient.amount} {ingredient.name} {ingredient.ingredient}
                    </li>
                ))}
            </ul>
            <h3>Directions</h3>
            <ol>
                {Array.isArray(recipe.directions) ? (
                    recipe.directions.map((direction, index) => (
                        <li key={index}>{direction}</li>
                    ))
                ) : (
                    <li>No directions listed</li>
                )}
            </ol>
        </div>
    );
};

export default RecipeDetail;