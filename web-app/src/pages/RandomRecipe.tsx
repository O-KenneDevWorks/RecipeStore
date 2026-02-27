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
          {recipe.ingredients.map((section, si) => (
            <div key={si}>
              {section.title && <h3>{section.title}</h3>}
              <ul>
                {section.items.map((ingredient, ii) => (
                  <li key={ii}>
                    {ingredient.amount} {ingredient.unit} {ingredient.name}
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <h2>Directions</h2>
          {recipe.directions.map((section, si) => (
            <div key={si}>
              {section.title && <h3>{section.title}</h3>}
              <ol>
                {section.steps.map((step, di) => (
                  <li key={di}>{step}</li>
                ))}
              </ol>
            </div>
          ))}
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
