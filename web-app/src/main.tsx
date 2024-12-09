// main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import Home from './components/Home';
import AddRecipeForm from './components/Add_Recipe';
import ViewRecipes from './components/View_Recipes';
import RecipeDetail from './components/RecipeDetail';
import AddPantryItem from './components/AddPantryItem';
import PantryView from './components/PantryView';
import RandomRecipe from './components/RandomRecipe';
import MealPlanner from './components/MealPlanner';
import EditRecipeForm from './components/EditRecipeForm';

import './components/Styling/Global.css';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    children: [
      { path: "add-recipe", element: <AddRecipeForm /> },
      { path: "view-recipes", element: <ViewRecipes /> },
      { path: "recipes/:id", element: <RecipeDetail /> },
      { path: "add-pantry-item", element: <AddPantryItem /> },
      { path: "pantry", element: <PantryView /> },
      { path: "random-recipe", element: <RandomRecipe /> },
      { path: "meal-planner", element: <MealPlanner userId="dummyUserId" /> },
      { path: "edit-recipe/:id", element: <EditRecipeForm /> },
    ],
  },
]);

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error("Root element not found. Check your HTML file.");
}

const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);