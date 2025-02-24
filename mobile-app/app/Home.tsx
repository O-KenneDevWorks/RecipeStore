import React from 'react';
import { useRouter } from 'expo-router';
import { View, Text, Button, StyleSheet } from 'react-native';
import { Link } from 'expo-router';

export default function Home() {
    const router = useRouter();

    const handlePress = (pathname: String) => {
          console.log(`Navigating to ${pathname}`);
          router.push({ pathname });
        };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to RecipeApp</Text>
      <Button title="View Recipes" onPress={() => handlePress('/ViewRecipes')} />
      <Button title="Add Recipes" onPress={() => handlePress('/AddRecipe')} />
      <Button title="Pantry" onPress={() => handlePress('/Pantry')} />
      <Button title="Add Pantry" onPress={() => handlePress('/AddPantry')} />
      <Button title="Random Recipe" onPress={() => handlePress('/RandomRecipe')} />
      <Button title="Meal Planner" onPress={() => handlePress('/MealPlanner')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
});
