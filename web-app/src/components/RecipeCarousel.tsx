import { useEffect, useState } from 'react';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import '../Styling/RecipeCarousel.css';
import { getRecipePreviews } from '../api/recipeAPI';
import { RecipePreview } from "../interfaces/Recipe";
import RecipeCard from './RecipeCard';

const RecipeCarousel = () => {
    const [recipes, setRecipes] = useState<RecipePreview[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRecipes = async () => {
            const data = await getRecipePreviews();
            setRecipes(data);
            setLoading(false);
        };

        fetchRecipes();
    }, []);

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
                {recipes
                    .filter(recipe => recipe.image)
                    .map((recipe) => (
                        <div key={recipe._id} className="carousel-item">
                            <RecipeCard {...recipe} />
                        </div>
                    ))}
            </Slider>
        </div>
    );
};

export default RecipeCarousel;
