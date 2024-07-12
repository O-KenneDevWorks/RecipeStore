import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Slider from 'react-slick'; // Import the Slider component
import "slick-carousel/slick/slick.css"; // Slick carousel CSS
import "slick-carousel/slick/slick-theme.css"; // Slick carousel theme CSS
import './Styling/RecipeCarousel.css'; // Assuming you have the CSS in a separate file

const RecipeCarousel = () => {
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchRecipes = useCallback(async () => {
        try {
            const response = await axios.get('http://10.0.0.85:3000/recipes/previews');
            setRecipes(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Failed to fetch recipes:', error);
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchRecipes();
    }, [fetchRecipes]);

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 3,
        autoplay: true,
        autoplaySpeed: 2000,
        responsive: [
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    infinite: true,
                    dots: true
                }
            }
        ]
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    const placeholderImg = '../No_Photo.jpg'; // Placeholder image URL

    return (
        <div className="carousel-container">
            <Slider {...settings}>
                {recipes.map((recipe) => (
                    <div key={recipe._id} className="carousel-item">
                        <Link to={`http://10.0.0.85:3000/recipe/${recipe._id}`}>
                            <img
                                src={recipe.image || placeholderImg}
                                alt={recipe.name}
                                onError={(e) => {
                                    if (e.target.src !== placeholderImg) {
                                        e.target.src = placeholderImg;
                                    }
                                }}
                            />
                            <h3>{recipe.name}</h3>
                        </Link>
                    </div>
                ))}
            </Slider>
        </div>
    );
};

export default RecipeCarousel;
