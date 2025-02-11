import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from './Home';
import AddRecipeForm from './AddRecipeForm';
import ViewRecipes from './ViewRecipes';
import RecipeDetail from './RecipeDetail';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Add Recipe" component={AddRecipeForm} />
        <Stack.Screen name="View Recipes" component={ViewRecipes} />
        <Stack.Screen name="RecipeDetail" component={RecipeDetail} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
