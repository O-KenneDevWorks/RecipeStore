import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, ActivityIndicator, FlatList } from 'react-native';
import { getRandomRecipe } from '../api/recipeAPI';
import { Recipe } from '../interfaces/Recipe';
import styles from '../styles/RandomRecipeStyles';

const RandomRecipeScreen = () => {
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const data = await getRandomRecipe();
        if (data) {
          setRecipe(data);
        } else {
          setError('Error fetching random recipe');
        }
      } catch (err) {
        setError('Error fetching random recipe');
      }
    };

    fetchRecipe();
  }, []);

  if (error) {
    return <Text style={styles.errorText}>{error}</Text>;
  }

  if (!recipe) {
    return <ActivityIndicator style={styles.loader} size="large" color="#2e86de" />;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{recipe.name}</Text>
      {recipe.image && <Image source={{ uri: recipe.image }} style={styles.image} />}

      <View style={styles.section}>
        <Text style={styles.subheading}>Details</Text>
        <Text>Prep Time: {recipe.prepTime}</Text>
        <Text>Cook Time: {recipe.cookTime}</Text>
        <Text>Total Time: {recipe.totalTime}</Text>
        <Text>Servings: {recipe.servings}</Text>
        <Text>Yield: {recipe.yield}</Text>
        <Text>Course: {recipe.course}</Text>
        <Text>Cuisine: {recipe.cuisine}</Text>
      </View>

      {recipe.tags?.length > 0 && (
        <View style={styles.detailSection}>
            <Text style={styles.sectionTitle}>Tags</Text>
            <FlatList
            data={recipe.tags}
            keyExtractor={(tag, index) => `tag-${index}`}
            renderItem={({ item: tag }) => <Text style={styles.tag}>{tag}</Text>}
            horizontal
            showsHorizontalScrollIndicator={false}
            />
        </View>
        )}

      <View style={styles.section}>
        <Text style={styles.subheading}>Ingredients</Text>
        {recipe.ingredients.map((ingredient, index) => (
          <Text key={index} style={styles.listItem}>
            - {ingredient.amount} {ingredient.unit} {ingredient.name}
          </Text>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.subheading}>Directions</Text>
        {recipe.directions.map((step, index) => (
          <Text key={index} style={styles.listItem}>
            {index + 1}. {step}
          </Text>
        ))}
      </View>

    </ScrollView>
  );
};

export default RandomRecipeScreen;
