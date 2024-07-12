import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import './Styling/RecipeCarousel.css'; // Ensure your CSS file path is correct

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
        dots: false,
        infinite: true,
        speed: 10000,
        slidesToShow: 4,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 0,
        cssEase: 'linear',
        responsive: [
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
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
                        <img src={recipe.image || placeholderImg} alt={recipe.name} />
                        <h3>{recipe.name}</h3>
                    </div>
                ))}
            </Slider>
        </div>
    );
};

export default RecipeCarousel;
