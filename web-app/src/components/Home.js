import React from 'react';
import RecipeCarousel from './RecipeCarousel';  // Make sure the path is correct


const Home = () => {
    const [recipes, setRecipes] = useState([]);

    useEffect(() => {
        const fetchRecipes = async () => {
            try {
                const response = await axios.get('http://10.0.0.85:3000/recipes/previews');  // Updated endpoint
                setRecipes(response.data);  // Set the fetched recipes to state
            } catch (error) {
                console.error('Failed to fetch recipe previews:', error);
            }
        };

        fetchRecipes();
    }, []);

    // return (
    //     <div className="carousel-container">
    //         <div className="carousel-track">
    //             {recipes.map((recipe) => (
    //                 <Link key={recipe._id} to={`/recipe/${recipe._id}`} className="carousel-item">
    //                     <img src={recipe.imageUrl} alt={recipe.name} />
    //                     <h3>{recipe.name}</h3>
    //                 </Link>
    //             ))}
    //         </div>
    //     </div>
    // );

    return (
        <div>
            <h1>The Recipe Store</h1>
            <h2>Your Personal Digital Cookbook</h2>
            <RecipeCarousel />
        </div>
    );
};