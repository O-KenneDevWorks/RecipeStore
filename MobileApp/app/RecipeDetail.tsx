import React, { useEffect, useState } from 'react';
import { View, Text, Image, FlatList, ActivityIndicator } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { getRecipeById } from '../api/recipeAPI';
import { Recipe } from '../interfaces/Recipe';
import styles from '../styles/RecipeDetailStyles';

const RecipeDetail = () => {
  const route = useRoute();
  const { id } = route.params as { id: string };
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchRecipe = async () => {
      if (!id) return;

      const data = await getRecipeById(id);
      if (data) {
        setRecipe(data);
      }
      setLoading(false);
    };

    fetchRecipe();
  }, [id]);

  if (loading) {
    return <ActivityIndicator size="large" color="#007bff" style={styles.loader} />;
  }

  if (!recipe) {
    return (
      <View style={styles.center}>
        <Text>Recipe not found.</Text>
      </View>
    );
  }

  // **Prepare FlatList Data (Combining all Sections)**
  const flatListData = [
    { type: 'header' },
    ...(recipe.tags.length > 0 ? [{ type: 'tags', data: recipe.tags }] : []),
    { type: 'ingredients', data: recipe.ingredients },
    { type: 'directions', data: recipe.directions },
    ...(recipe.notes ? [{ type: 'notes', data: recipe.notes }] : []),
  ];

  return (
    <FlatList
      data={flatListData}
      keyExtractor={(item, index) => `${item.type}-${index}`}
      renderItem={({ item }) => {
        switch (item.type) {
          case 'tags':
            return (
              <View style={styles.detailSection}>
                <Text style={styles.sectionTitle}>Tags</Text>
                <FlatList
                  data={item.data}
                  keyExtractor={(tag, index) => `tag-${index}`}
                  renderItem={({ item: tag }) => <Text style={styles.tag}>{tag}</Text>}
                  horizontal
                />
              </View>
            );

          case 'ingredients':
            return (
              <View style={styles.detailSection}>
                <Text style={styles.sectionTitle}>Ingredients</Text>
                {item.data.map((ingredient, index) => (
                  <Text key={index}>{ingredient.amount} {ingredient.unit} {ingredient.name}</Text>
                ))}
              </View>
            );

          case 'directions':
            return (
              <View style={styles.detailSection}>
                <Text style={styles.sectionTitle}>Directions</Text>
                {item.data.map((direction, index) => (
                  <Text key={index}>{index + 1}. {direction}</Text>
                ))}
              </View>
            );

          case 'notes':
            return (
              <View style={styles.detailSection}>
                <Text style={styles.sectionTitle}>Notes</Text>
                <Text>{item.data}</Text>
              </View>
            );

          default:
            return null;
        }
      }}
      ListHeaderComponent={
        <View>
          <Text style={styles.title}>{recipe.name}</Text>
          {recipe.image && <Image source={{ uri: recipe.image }} style={styles.image} />}
          <View style={styles.detailSection}>
            <Text style={styles.sectionTitle}>Details</Text>
            <Text>Prep Time: {recipe.prepTime}</Text>
            <Text>Cook Time: {recipe.cookTime}</Text>
            <Text>Total Time: {recipe.totalTime}</Text>
            <Text>Servings: {recipe.servings}</Text>
            <Text>Yield: {recipe.yield}</Text>
            <Text>Course: {recipe.course}</Text>
            <Text>Cuisine: {recipe.cuisine}</Text>
          </View>
        </View>
      }
      contentContainerStyle={styles.listContentContainer} // ✅ Adds top & bottom spacing
    />
  );
};

export default RecipeDetail;
