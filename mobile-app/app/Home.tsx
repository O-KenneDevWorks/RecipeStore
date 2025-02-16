import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { Link } from 'expo-router';

export default function Home() {

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to RecipeApp</Text>
      <Link href="/ViewRecipes" style={styles.button}>
            View Recipes
      </Link>
      <Link href="/AddRecipe" style={styles.button}>
          Add Recipes
    </Link>
      <Link href="/EditRecipe" style={styles.button}>
          Edit Recipe
    </Link>
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
