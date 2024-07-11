import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './Styling/RecipeCarousel.css';  // Assuming you have the CSS in a separate file

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

    // URL to a placeholder image
    const placeholderImg = '../No_Photo.jpg'; // Replace with your actual placeholder image URL

    return (
        <div className="carousel-container">
            <div className="carousel-track">
                {recipes.map((recipe) => (
                    <Link key={recipe._id} to={`http://10.0.0.85:3000/recipe/${recipe._id}`} className="carousel-item">
                        <img
                            src={recipe.image}
                            alt={recipe.name}
                            onError={(e) => {
                                e.target.onerror = null; // Prevents recursion if the placeholder image also fails
                                e.target.src = placeholderImg; // Fallback to placeholder image
                            }}
                        />
                        <h3>{recipe.name}</h3>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default RecipeCarousel;