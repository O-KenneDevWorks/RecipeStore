import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './Styling/RecipeDetail.css';

const RecipeDetail = () => {
    const { id } = useParams();
    const [recipe, setRecipe] = useState(null);

    console.log('Recipe ID: ', id);

    useEffect(() => {
        const fetchRecipe = async () => {
            try {
                const response = await axios.get(`http://10.0.0.85:3000/recipes/${id}`);
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
            <Link to={`/edit-recipe/${recipe._id}`}>Edit Recipe</Link>
            {recipe.image && <img src={recipe.image} alt={recipe.name} />}
            <ul>
                <li>Prep Time: {recipe.prepTime}</li>
                <li>Cook Time: {recipe.cookTime}</li>
                <li>Total Time: {recipe.totalTime}</li>
                <li>Servings: {recipe.servings}</li>
                <li>Yield: {recipe.yield}</li>
                <li>Course: {recipe.course}</li>
            </ul>
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
        </div>
    );
};

export default RecipeDetail;
