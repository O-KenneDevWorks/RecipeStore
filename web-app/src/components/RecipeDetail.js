import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './Styling/RecipeDetail.css';
 
const RecipeDetail = () => {
    const { id } = useParams();
    const [recipe, setRecipe] = useState(null);
 
    useEffect(() => {
        const fetchRecipe = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/recipes/${id}`);
                setRecipe(response.data);
            } catch (error) {
                console.error('Error fetching recipe:', error);
            }
        };
 
        fetchRecipe();
    }, [id]);
 
    if (!recipe) {
        return <div>Loading...</div>;
    }
 
    return (
        <div className="recipe-detail">
            <h1>{recipe.name}</h1>
            {recipe.image && <img src={recipe.image} alt={recipe.name} className="recipe-image" />}
            <p><strong>Prep Time:</strong> {recipe.prepTime}</p>
            <p><strong>Cook Time:</strong> {recipe.cookTime}</p>
            <p><strong>Total Time:</strong> {recipe.totalTime}</p>
            <p><strong>Servings:</strong> {recipe.servings}</p>
            <p><strong>Yield:</strong> {recipe.yield}</p>
            <h2>Ingredients</h2>
            <ul>
                {recipe.ingredients.map((ingredient, index) => (
                    <li key={index}>{ingredient.amount} {ingredient.unit} {ingredient.name}</li>
                ))}
            </ul>
            <h2>Directions</h2>
            <ol>
                {recipe.directions.map((direction, index) => (
                    <li key={index}>{direction}</li>
                ))}
            </ol>
        </div>
    );
};
 
export default RecipeDetail;