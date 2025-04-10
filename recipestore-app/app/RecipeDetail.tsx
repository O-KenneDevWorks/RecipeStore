import React, { useEffect, useState } from 'react';
import { View, Text, Image, FlatList, ActivityIndicator, Button } from 'react-native';
import { useRouter, useLocalSearchParams  } from 'expo-router';
import { getRecipeById } from '../api/recipeAPI';
import { Recipe } from '../interfaces/Recipe';
import styles from '../styles/RecipeDetailStyles';

const RecipeDetail = () => {
  const router = useRouter();

//   const { id } = router.params as { id: string };
  const { id } = useLocalSearchParams();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchRecipe = async () => {
      if (typeof id !== 'string') return;
  
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
    ...(Array.isArray(recipe.tags) && recipe.tags.length > 0
      ? [{ type: 'tags', data: recipe.tags }]
      : []),
    { type: 'ingredients', data: recipe.ingredients },
    { type: 'directions', data: recipe.directions },
    ...(recipe.notes ? [{ type: 'notes', data: recipe.notes }] : []),
  ];

//   const handlePress = () => {
//       console.log(`Navigating to RecipeDetail with id: ${_id}`);
//       router.push({ pathname: '/RecipeDetail', params: { id: _id } });
//     };

  const handlePress = () => {
      console.log(`Navigating to EditDetail with id: ${id}`);
      router.push({ pathname: '/EditRecipe', params: { id: id } });
    };

  return (
    <FlatList
      data={flatListData}
      keyExtractor={(item, index) => `${item.type}-${index}`}
      renderItem={({ item }) => {
        switch (item.type) {
          case 'tags':
            if (Array.isArray(item.data) && typeof item.data[0] === 'string') {
              const tags = item.data as string[];
              return (
                <View style={styles.detailSection}>
                  <Text style={styles.sectionTitle}>Tags</Text>
                  <FlatList
                    data={tags}
                    keyExtractor={(tag, index) => `tag-${index}`}
                    renderItem={({ item: tag }) => <Text style={styles.tag}>{tag}</Text>}
                    horizontal
                  />
                </View>
              );
            }
            return null;


          case 'ingredients':
            if (Array.isArray(item.data)) {
              return (
                <View style={styles.detailSection}>
                  <Text style={styles.sectionTitle}>Ingredients</Text>
                  {item.data.map((ingredient, index) => {
                    // Ensure all required properties exist
                    if (
                      typeof ingredient === 'object' &&
                      'amount' in ingredient &&
                      'unit' in ingredient &&
                      'name' in ingredient
                    ) {
                      return (
                        <Text key={index}>
                          {ingredient.amount} {ingredient.unit} {ingredient.name}
                        </Text>
                      );
                    }
                    return null;
                  })}
                </View>
              );
            }
            return null;

          case 'directions': {
            const directions = item.data as string[];
            return (
              <View style={styles.detailSection}>
                <Text style={styles.sectionTitle}>Directions</Text>
                {directions.map((direction, index) => (
                  <Text key={index}>{index + 1}. {direction}</Text>
                ))}
              </View>
            );
          }
            

          case 'notes':
            return (
              <View style={styles.detailSection}>
                <Text style={styles.sectionTitle}>Notes</Text>
                <Text>{typeof item.data === 'string' ? item.data : ''}</Text>
              </View>
            );
                

          default:
            return null;
        }
      }}
      ListHeaderComponent={
        <View>
          <Text style={styles.title}>{recipe.name}</Text>
          <Button title="Edit Recipe" onPress={handlePress} />
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
