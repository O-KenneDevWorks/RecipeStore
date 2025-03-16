import { Recipe } from "../interfaces/Recipe";
import { RecipePreview } from "../interfaces/Recipe";

const BASE_URL = "http://10.0.0.85:3001/api"; // Replace with your backend's base URL

// Fetch a single recipe by ID
export const getRecipeById = async (id: string): Promise<Recipe | null> => {
  try {
    const response = await fetch(`${BASE_URL}/recipes/${id}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });

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
    const response = await fetch(`${BASE_URL}/recipes`, {
      headers: {
        "Content-Type": "application/json",
      },
    });

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
    const response = await fetch(`${BASE_URL}/recipes/random-recipe`, {
      headers: {
        "Content-Type": "application/json",
      },
    });

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
    const response = await fetch(`${BASE_URL}/recipes/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
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
  console.log("Sending request to:", `${BASE_URL}/recipes`);
  console.log("Payload:", JSON.stringify(recipe, null, 2)); // ✅ Debugging

  try {
    const response = await fetch(`${BASE_URL}/recipes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
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
    const response = await fetch(`${BASE_URL}/recipes/previews`, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch recipe previews");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching recipe previews:", error);
    return [];
  }
};
