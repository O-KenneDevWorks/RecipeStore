import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Recipe } from '../interfaces/Recipe';
import RecipeCard from '../components/RecipeCard';
import { RecipePreview } from '../interfaces/Recipe';
import { getRecipes } from '../api/recipeAPI';
import { COURSE_OPTIONS, CUISINE_OPTIONS } from '../constants/options';
import styles from '../styles/ViewRecipes'

const ViewRecipes = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [selectedTag, setSelectedTag] = useState<string>('');
  const [selectedCourse, setSelectedCourse] = useState<string>('');
  const [selectedCuisine, setSelectedCuisine] = useState<string>('');

  useEffect(() => {
    const fetchRecipes = async () => {
      const data = await getRecipes();
      setRecipes(data);
    };

    fetchRecipes();
  }, []);

  const handleTagChange = (value: string) => setSelectedTag(value);
  const handleCourseChange = (value: string) => setSelectedCourse(value);
  const handleCuisineChange = (value: string) => setSelectedCuisine(value);

  const filteredRecipes = recipes.filter(
    (recipe) =>
      (selectedTag ? (recipe.tags ?? []).includes(selectedTag) : true) &&
      (selectedCourse ? recipe.course === selectedCourse : true) &&
      (selectedCuisine ? recipe.cuisine === selectedCuisine : true)
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>All Recipes</Text>

      {/* Filter Controls */}
      <View style={styles.filterControls}>
        <Text style={styles.label}>Filter by tag:</Text>
        <Picker
          selectedValue={selectedTag}
          onValueChange={handleTagChange}
          style={styles.picker}
        >
          <Picker.Item label="All" value="" />
          {[...new Set(recipes.flatMap((recipe) => recipe.tags))].map((tag, index) => (
            <Picker.Item key={index} label={tag} value={tag} />
          ))}
        </Picker>

        <Text style={styles.label}>Filter by course:</Text>
        <Picker
          selectedValue={selectedCourse}
          onValueChange={handleCourseChange}
          style={styles.picker}
        >
          <Picker.Item label="All" value="" />
          {COURSE_OPTIONS.map((course, index) => (
            <Picker.Item key={index} label={course} value={course} />
          ))}
        </Picker>

        <Text style={styles.label}>Filter by cuisine:</Text>
        <Picker
          selectedValue={selectedCuisine}
          onValueChange={handleCuisineChange}
          style={styles.picker}
        >
          <Picker.Item label="All" value="" />
          {CUISINE_OPTIONS.map((cuisine, index) => (
            <Picker.Item key={index} label={cuisine} value={cuisine} />
          ))}
        </Picker>
      </View>

      {/* Recipe Grid */}
      <FlatList
        data={filteredRecipes.sort((a, b) => a.name.localeCompare(b.name))}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => <RecipeCard {...(item as RecipePreview)} />}
        contentContainerStyle={styles.recipeGrid}
      />
    </View>
  );
};

export default ViewRecipes;
