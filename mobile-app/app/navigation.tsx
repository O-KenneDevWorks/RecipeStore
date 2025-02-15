import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {NavigationContainer} from '@react-navigation/native';
import Home from './Home';
import AddRecipeForm from './AddRecipeForm';
import ViewRecipes from './ViewRecipes';
import RecipeDetail from './RecipeDetail';
import EditRecipeForm from './EditRecipeForm'

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="AddRecipe" component={AddRecipeForm} />
          <Stack.Screen name="ViewRecipes" component={ViewRecipes} />
          <Stack.Screen name="RecipeDetail" component={RecipeDetail} />
          <Stack.Screen name="EditRecipe" component={EditRecipeForm} />
        </Stack.Navigator>
      </NavigationContainer>
  );
}

