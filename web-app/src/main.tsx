// main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import App from './App';

import Home from './pages/Home';
import AddRecipeForm from './pages/Add_Recipe';
import ViewRecipes from './pages/View_Recipes';
import RecipeDetail from './pages/RecipeDetail';
import AddPantryItem from './pages/AddPantryItem';
import PantryView from './pages/PantryView';
import RandomRecipe from './pages/RandomRecipe';
import MealPlanner from './pages/MealPlanner';
import EditRecipeForm from './pages/EditRecipeForm';
import DuplicateRecipeForm from './pages/DuplicateRecipeForm';

import './Styling/Global.css';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      { path: "add-recipe", element: <AddRecipeForm /> },
      { path: "view-recipes", element: <ViewRecipes /> },
      { path: "recipes/:id", element: <RecipeDetail /> },
      { path: "add-pantry-item", element: <AddPantryItem /> },
      { path: "pantry", element: <PantryView /> },
      { path: "random-recipe", element: <RandomRecipe /> },
      { path: "meal-planner", element: <MealPlanner userId="dummyUserId" /> },
      { path: "edit-recipe/:id", element: <EditRecipeForm /> },
      { path: "duplicate-recipe/:id", element: <DuplicateRecipeForm /> },
    ],
  },
], {
  future: {
    v7_startTransition: true,
  },
});

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