import { Recipe } from "../interfaces/Recipe"
import { RecipePreview } from "../interfaces/Recipe";

// Fetch a single recipe by ID
export const getRecipeById = async (id: string): Promise<Recipe | null> => {
    try {
        const response = await fetch(`/api/recipes/${id}`, {
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Invalid recipe API response, check network tab!');
        }

        return await response.json();
    } catch (err) {
        console.error('Error fetching recipe:', err);
        return null;
    }
};

// Fetch all recipes
export const getRecipes = async (): Promise<Recipe[]> => {
    try {
        const response = await fetch('/api/recipes', {
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Invalid recipes API response, check network tab!');
        }

        return await response.json();
    } catch (err) {
        console.error('Error fetching recipes:', err);
        return [];
    }
};

// Fetch a random recipe
export const getRandomRecipe = async (): Promise<Recipe | null> => {
    try {
        const response = await fetch('/api/recipes/random-recipe', {
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const data: Recipe = await response.json();

        if (!response.ok) {
            throw new Error('Error fetching random recipe');
        }

        return data;
    } catch (err) {
        console.error('Error fetching random recipe:', err);
        return null;
    }
};

// Update a single recipe by ID
export const updateRecipe = async (id: string, recipe: Recipe): Promise<void> => {
    try {
        const response = await fetch(`/api/recipes/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(recipe),
        });

        if (!response.ok) {
            throw new Error('Failed to update recipe');
        }
    } catch (err) {
        console.error('Error updating recipe:', err);
        throw err;
    }
};

// Add a new recipe
export const addRecipe = async (recipe: Recipe): Promise<Recipe> => {
  // strip any existing ids from duplicates/edits
  const { _id, ...cleanedRecipe } = recipe;

  const response = await fetch("/api/recipes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(cleanedRecipe),
  });

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(`Failed to add recipe (${response.status}): ${text}`);
  }

  const created: Recipe = await response.json();
  return created;
};

export const getRecipePreviews = async (): Promise<RecipePreview[]> => {
    try {
      const response = await fetch('/api/recipes/previews', {
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (!response.ok) {
        throw new Error('Failed to fetch recipe previews');
      }
  
      return await response.json();
    } catch (error) {
      console.error('Error fetching recipe previews:', error);
      return [];
    }
  };