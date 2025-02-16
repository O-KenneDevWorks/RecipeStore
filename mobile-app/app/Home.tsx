import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function Home() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to RecipeApp</Text>
      <Button title="View Recipes" onPress={() => navigation.navigate('ViewRecipes')} />
      <Button title="Add Recipe" onPress={() => navigation.navigate('AddRecipeForm')} />
      <Button title="Edit Recipe" onPress={() => navigation.navigate('EditRecipe')} />
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
