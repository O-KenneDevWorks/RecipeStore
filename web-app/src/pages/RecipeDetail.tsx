import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../Styling/RecipeDetail.css';
import BurgerMenu from '../components/BurgerMenu';
import { getRecipeById, deleteRecipe } from '../api/recipeAPI';
import { Recipe } from '../interfaces/Recipe';

const RecipeDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState<Recipe | null>(null);

  console.log('Recipe ID:', id);

  useEffect(() => {
    const fetchRecipe = async () => {
      if (!id) return;

      const data = await getRecipeById(id);
      if (data) {
        setRecipe(data);
      }
    };

    fetchRecipe();
  }, [id]);

  const handleDelete = async () => {
    if (!id) return;
    
    if (window.confirm('Are you sure you want to delete this recipe?')) {
      try {
        await deleteRecipe(id);
        navigate('/view-recipes');
      } catch (err) {
        console.error('Error deleting recipe:', err);
        alert('Failed to delete recipe. Please try again.');
      }
    }
  };

  if (!recipe) {
    return <div>Loading...</div>;
  }

  return (
    <div className="recipe-detail">
      <BurgerMenu
        buttonLabel=""
        items={[
        { label: 'Edit', to: `/edit-recipe/${id}` },
        { label: 'Duplicate', to: `/duplicate-recipe/${id}` },
        { label: 'Delete', onClick: handleDelete },
        ]}
      />
      <h1>{recipe.name}</h1>
      {recipe.image && <img src={recipe.image} alt={recipe.name} />}
      <ul>
        <li>Prep Time: {recipe.prepTime}</li>
        <li>Cook Time: {recipe.cookTime}</li>
        <li>Total Time: {recipe.totalTime}</li>
        <li>Servings: {recipe.servings}</li>
        <li>Yield: {recipe.yield}</li>
        <li>Course: {recipe.course}</li>
        <li>Cuisine: {recipe.cuisine}</li>
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
      <h2>Notes</h2>
      {recipe.notes && (
        <>
          <p>{recipe.notes}</p>
        </>
      )}
    </div>
  );
};

export default RecipeDetail;
