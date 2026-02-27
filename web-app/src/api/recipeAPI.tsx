import { Recipe } from "../interfaces/Recipe"
import { RecipePreview } from "../interfaces/Recipe";
import { IngredientSection, DirectionSection } from "../interfaces/Ingredient";
import { fetchWithAuth } from "../utils/auth";

// Normalize old flat ingredients/directions arrays from pre-subsection recipes
function normalizeIngredients(raw: any[]): IngredientSection[] {
    if (!raw || raw.length === 0) return [{ title: '', items: [] }];
    // New format has an 'items' property
    if ('items' in raw[0]) return raw as IngredientSection[];
    // Old flat format — wrap in a single untitled section
    return [{ title: '', items: raw }];
}

function normalizeDirections(raw: any[]): DirectionSection[] {
    if (!raw || raw.length === 0) return [{ title: '', steps: [] }];
    // New format has a 'steps' property
    if (typeof raw[0] === 'object' && 'steps' in raw[0]) return raw as DirectionSection[];
    // Old flat format — wrap in a single untitled section
    return [{ title: '', steps: raw as string[] }];
}

function normalizeRecipe(data: any): Recipe {
    return {
        ...data,
        ingredients: normalizeIngredients(data.ingredients ?? []),
        directions: normalizeDirections(data.directions ?? []),
    };
}

// Fetch a single recipe by ID
export const getRecipeById = async (id: string): Promise<Recipe | null> => {
    try {
        const response = await fetchWithAuth(`/api/recipes/${id}`);

        if (!response.ok) {
            throw new Error('Invalid recipe API response, check network tab!');
        }

        return normalizeRecipe(await response.json());
    } catch (err) {
        console.error('Error fetching recipe:', err);
        return null;
    }
};

// Fetch all recipes
export const getRecipes = async (): Promise<Recipe[]> => {
    try {
        const response = await fetchWithAuth('/api/recipes');

        if (!response.ok) {
            throw new Error('Invalid recipes API response, check network tab!');
        }

        const data = await response.json();
        return (data as any[]).map(normalizeRecipe);
    } catch (err) {
        console.error('Error fetching recipes:', err);
        return [];
    }
};

// Fetch a random recipe
export const getRandomRecipe = async (): Promise<Recipe | null> => {
    try {
        const response = await fetchWithAuth('/api/recipes/random-recipe');

        const data = await response.json();

        if (!response.ok) {
            throw new Error('Error fetching random recipe');
        }

        return normalizeRecipe(data);
    } catch (err) {
        console.error('Error fetching random recipe:', err);
        return null;
    }
};

// Update a single recipe by ID
export const updateRecipe = async (id: string, recipe: Recipe): Promise<void> => {
    try {
        const response = await fetchWithAuth(`/api/recipes/${id}`, {
            method: 'PUT',
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

  const response = await fetchWithAuth("/api/recipes", {
    method: "POST",
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
      const response = await fetchWithAuth('/api/recipes/previews');
  
      if (!response.ok) {
        throw new Error('Failed to fetch recipe previews');
      }
  
      return await response.json();
    } catch (error) {
      console.error('Error fetching recipe previews:', error);
      return [];
    }
  };

// Delete a recipe by ID
export const deleteRecipe = async (id: string): Promise<void> => {
    try {
        const response = await fetchWithAuth(`/api/recipes/${id}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            throw new Error('Failed to delete recipe');
        }
    } catch (err) {
        console.error('Error deleting recipe:', err);
        throw err;
    }
};