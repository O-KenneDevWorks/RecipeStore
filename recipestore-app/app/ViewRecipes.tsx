import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons'; // For filter icon

import { Recipe, RecipePreview } from '../interfaces/Recipe';
// import { RecipePreview } from '../interfaces/Recipe';
import { COURSE_OPTIONS, CUISINE_OPTIONS } from '../constants/options';
import RecipeCard from '../components/RecipeCard';
import { getRecipes } from '../api/recipeAPI';
import ViewRecipesStyles from '../styles/ViewRecipesStyles'; // Import external styles

const ViewRecipes = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [selectedTag, setSelectedTag] = useState<string>('');
  const [selectedCourse, setSelectedCourse] = useState<string>('');
  const [selectedCuisine, setSelectedCuisine] = useState<string>('');
  const [showFilters, setShowFilters] = useState<boolean>(false);

  useEffect(() => {
    const fetchRecipes = async () => {
      const data = await getRecipes();
      setRecipes(data);
    };

    fetchRecipes();
  }, []);

  const handleFilterToggle = () => {
    setShowFilters((prev) => !prev);
  };

  const handleTagChange = (value: string) => setSelectedTag(value);
  const handleCourseChange = (value: string) => setSelectedCourse(value);
  const handleCuisineChange = (value: string) => setSelectedCuisine(value);

  const filteredRecipes = recipes
    .filter((recipe) => recipe._id) // Ensure only recipes with _id are included
    .map((recipe) => ({
      ...recipe,
      _id: recipe._id || 'fallback-id', // Provide a fallback if needed
    }));

  return (
      <View style={ViewRecipesStyles.container}>
        {/* Header Section */}
        <View style={ViewRecipesStyles.header}>
          <Text style={ViewRecipesStyles.title}>All Recipes</Text>
          <TouchableOpacity style={ViewRecipesStyles.filterButton} onPress={handleFilterToggle}>
            <Ionicons name="filter" size={24} color="white" />
            <Text style={ViewRecipesStyles.filterText}>Filter</Text>
          </TouchableOpacity>
        </View>

        {/* Filter Section (conditionally rendered) */}
        {showFilters && (
          <View style={ViewRecipesStyles.filterControls}>
            <Text style={ViewRecipesStyles.label}>Filter by Tag:</Text>
            <Picker selectedValue={selectedTag} onValueChange={setSelectedTag} style={ViewRecipesStyles.picker}>
              <Picker.Item label="All" value="" />
              {[...new Set(recipes.flatMap((recipe) => recipe.tags))].map((tag, index) => (
                <Picker.Item key={index} label={tag} value={tag} />
              ))}
            </Picker>

            <Text style={ViewRecipesStyles.label}>Filter by Course:</Text>
            <Picker selectedValue={selectedCourse} onValueChange={setSelectedCourse} style={ViewRecipesStyles.picker}>
              <Picker.Item label="All" value="" />
              {COURSE_OPTIONS.map((course, index) => (
                <Picker.Item key={index} label={course} value={course} />
              ))}
            </Picker>

            <Text style={ViewRecipesStyles.label}>Filter by Cuisine:</Text>
            <Picker selectedValue={selectedCuisine} onValueChange={setSelectedCuisine} style={ViewRecipesStyles.picker}>
              <Picker.Item label="All" value="" />
              {CUISINE_OPTIONS.map((cuisine, index) => (
                <Picker.Item key={index} label={cuisine} value={cuisine} />
              ))}
            </Picker>
          </View>
        )}

        {/* Recipe Grid */}
        <FlatList
          data={filteredRecipes}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => <RecipeCard {...item} />}
          numColumns={2}
          columnWrapperStyle={ViewRecipesStyles.columnWrapper}
          contentContainerStyle={ViewRecipesStyles.recipeGrid}
        />
      </View>
    );
  };

export default ViewRecipes;
