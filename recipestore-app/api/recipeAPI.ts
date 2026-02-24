import { Recipe } from "../interfaces/Recipe";
import { RecipePreview } from "../interfaces/Recipe";
import { fetchWithAuth, buildApiUrl } from "../utils/auth";

// Fetch a single recipe by ID
export const getRecipeById = async (id: string): Promise<Recipe | null> => {
  try {
    const response = await fetchWithAuth(buildApiUrl(`/api/recipes/${id}`));

    if (!response.ok) {
      throw new Error("Invalid recipe API response, check network tab!");
    }

    return await response.json();
  } catch (err) {
    console.error("Error fetching recipe:", err);
    return null;
  }
};

// Fetch all recipes
export const getRecipes = async (): Promise<Recipe[]> => {
  try {
    const response = await fetchWithAuth(buildApiUrl('/api/recipes'));

    if (!response.ok) {
      throw new Error("Invalid recipes API response, check network tab!");
    }

    return await response.json();
  } catch (err) {
    console.error("Error fetching recipes:", err);
    return [];
  }
};

// Fetch a random recipe
export const getRandomRecipe = async (): Promise<Recipe | null> => {
  try {
    const response = await fetchWithAuth(buildApiUrl('/api/recipes/random-recipe'));

    const data: Recipe = await response.json();

    if (!response.ok) {
      throw new Error("Error fetching random recipe");
    }

    return data;
  } catch (err) {
    console.error("Error fetching random recipe:", err);
    return null;
  }
};

// Update a single recipe by ID
export const updateRecipe = async (id: string, recipe: Recipe): Promise<void> => {
  try {
    const response = await fetchWithAuth(buildApiUrl(`/api/recipes/${id}`), {
      method: "PUT",
      body: JSON.stringify(recipe),
    });

    if (!response.ok) {
      throw new Error("Failed to update recipe");
    }
  } catch (err) {
    console.error("Error updating recipe:", err);
    throw err;
  }
};

// Add a new recipe
// export const addRecipe = async (recipe: Recipe): Promise<Recipe | null> => {
//   console.log("Sending request to:", BASE_URL);

//   try {
//     const response = await fetch(`${BASE_URL}/recipes`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(recipe),
//     });

//     if (!response.ok) {
//       throw new Error("Failed to add recipe");
//     }

//     return await response.json();
//   } catch (err) {
//     console.error("Error adding recipe:", err);
//     throw err;
//   }
// };

export const addRecipe = async (recipe: Recipe): Promise<Recipe | null> => {
  console.log("Sending request to add recipe");
  console.log("Payload:", JSON.stringify(recipe, null, 2)); // ✅ Debugging

  try {
    const response = await fetchWithAuth(buildApiUrl('/api/recipes'), {
      method: "POST",
      body: JSON.stringify(recipe),
    });

    console.log("Response Status:", response.status);
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Server Response:", errorText);
      throw new Error("Failed to add recipe: " + errorText);
    }

    const data = await response.json();
    console.log("Success:", data);
    return data;
  } catch (err) {
    console.error("Error adding recipe:", err);
    throw err;
  }
};

// Fetch recipe previews
export const getRecipePreviews = async (): Promise<RecipePreview[]> => {
  try {
    const response = await fetchWithAuth(buildApiUrl('/api/recipes/previews'));

    if (!response.ok) {
      throw new Error("Failed to fetch recipe previews");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching recipe previews:", error);
    return [];
  }
};

// Delete a recipe by ID
export const deleteRecipe = async (id: string): Promise<void> => {
  try {
    const response = await fetchWithAuth(buildApiUrl(`/api/recipes/${id}`), {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Failed to delete recipe");
    }
  } catch (err) {
    console.error("Error deleting recipe:", err);
    throw err;
  }
};
