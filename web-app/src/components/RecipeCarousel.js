import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const RecipeCarousel = () => {
    const [recipes, setRecipes] = useState([]);

    useEffect(() => {
        const fetchRecipes = async () => {
            try {
                const response = await axios.get('http://10.0.0.85:3000/recipes/previews');  // Make sure this endpoint is correctly set up
                setRecipes(response.data);
            } catch (error) {
                console.error('Failed to fetch recipes:', error);
            }
        };

        fetchRecipes();
    }, []);

    return (
        <div className="carousel-container">
            <div className="carousel-track">
                {recipes.map((recipe) => (
                    <Link key={recipe._id} to={`/recipe/${recipe._id}`} className="carousel-item">
                        <img src={recipe.imageUrl} alt={recipe.name} />
                        <h3>{recipe.name}</h3>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default RecipeCarousel;