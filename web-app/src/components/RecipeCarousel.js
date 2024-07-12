import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './Styling/RecipeCarousel.css';  // Assuming you have the CSS in a separate file

const RecipeCarousel = () => {
    const [recipes, setRecipes] = useState([]);

    const fetchRecipes = useCallback(async () => {
        try {
            const response = await axios.get('http://10.0.0.85:3000/recipes/previews');
            setRecipes(response.data);
        } catch (error) {
            console.error('Failed to fetch recipes:', error);
        }
    }, []); 

    useEffect(() => {
        fetchRecipes();
    }, []);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        fetchRecipes().then(() => setLoading(false));
    }, [fetchRecipes]);

    if (loading) {
        return <div>Loading...</div>;
    }
    
    // URL to a placeholder image
    const placeholderImg = '../No_Photo.jpg'; // Replace with your actual placeholder image URL

    return (
        <div className="carousel-container">
            <div className="carousel-track">
                {recipes.map((recipe) => (
                    <Link key={recipe._id} to={`http://10.0.0.85:3000/recipe/${recipe._id}`} className="carousel-item">
                        <img
                            src={recipe.image || placeholderImg}
                            alt={recipe.name}
                            onError={(e) => {
                                if (e.target.src !== placeholderImg) {
                                    e.target.src = placeholderImg; // Only set placeholder if it's not already set
                                }
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