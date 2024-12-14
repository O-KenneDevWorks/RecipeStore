import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import '../Styling/RecipeCarousel.css'; // Ensure your CSS file path is correct

interface Recipe {
    _id: string;
    name: string;
    image?: string;
}

const RecipeCarousel = () => {
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchRecipes = useCallback(async () => {
        try {
            const response = await axios.get('http://localhost:3001/api/recipes/previews');
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
        autoplaySpeed: 3000,
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

    return (
        <div className="carousel-container">
            <Slider {...settings}>
                {recipes.map((recipe) => (
                    <div key={recipe._id} className="carousel-item">
                        <div className="carousel-item-inner">
                            <Link to={`/recipes/${recipe._id}`}>
                                <img src={recipe.image || 'https://via.placeholder.com/150'} alt={recipe.name} />
                                <h3>{recipe.name}</h3>
                            </Link>
                        </div>
                    </div>
                ))}
            </Slider>
        </div>
    );
};

export default RecipeCarousel;
