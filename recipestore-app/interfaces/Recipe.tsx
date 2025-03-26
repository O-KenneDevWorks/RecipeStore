import { Ingredient } from "./Ingredient";

export interface Recipe {
    _id?: string;
    name: string;
    image?: string;
    prepTime: string;
    cookTime: string;
    totalTime: string;
    servings: string;
    yield: string;
    course: string;
    cuisine?: string;
    tags?: string[];
    ingredients: Ingredient[];
    directions: string[];
    notes: string;
  }

export interface RecipePreview {
    _id: string;
    name: string;
    image?: string;
}

export interface RecipeFormData {
  name: string;
  prepTime: string;
  cookTime: string;
  totalTime: string;
  servings: string;
  yield: string;
  tags: string[];
  course: string;
  cuisine: string;
  notes: string;
  image: string;
}