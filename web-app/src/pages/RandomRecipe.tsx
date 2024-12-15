// src/components/RandomRecipe.tsx
import { useState, useEffect } from 'react';
import '../Styling/RandomRecipe.css';
import { getRandomRecipe } from '../api/recipeAPI';
import { Recipe } from "../interfaces/Recipe"

const RandomRecipe = () => {
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecipe = async () => {
      const data = await getRandomRecipe();
      if (data) {
        setRecipe(data);
      } else {
        setError('Error fetching random recipe');
      }
    };

    fetchRecipe();
  }, []);

  return (
    <div>
      {error && <p>{error}</p>}
      {recipe ? (
        <div className="random-recipe">
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
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default RandomRecipe;
