import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, ScrollView, Alert, TouchableOpacity, FlatList } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { getRecipeById, updateRecipe } from '../api/recipeAPI';
import { Recipe } from '../interfaces/Recipe';
import EditRecipeFormStyles from '../styles/EditRecipeFormStyles';
import { Picker } from '@react-native-picker/picker';

const EditRecipeForm = () => {
  const route = useRoute();
  const navigation = useNavigation();
//   const { id } = route.params as { id: string };
  const id = '666daeed06953e5681c53546';
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    prepTime: '',
    cookTime: '',
    totalTime: '',
    servings: '',
    yield: '',
    course: '',
    cuisine: '',
    notes: '',
  });

  useEffect(() => {
    const fetchRecipe = async () => {
      if (!id) return;

      const data = await getRecipeById(id);
      if (data) {
        setRecipe(data);
        setFormData({
          name: data.name,
          prepTime: data.prepTime || '',
          cookTime: data.cookTime || '',
          totalTime: data.totalTime || '',
          servings: data.servings || '',
          yield: data.yield || '',
          course: data.course || '',
          cuisine: data.cuisine || '',
          notes: data.notes || '',
        });
      }
    };

    fetchRecipe();
  }, [id]);

  const handleUpdate = async () => {
    if (!recipe) return;

    const updatedRecipe = { ...recipe, ...formData };

    try {
      await updateRecipe(id, updatedRecipe);
      Alert.alert('Success', 'Recipe updated successfully!', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (err) {
      Alert.alert('Error', 'Failed to update recipe. Please try again.');
      console.error('Error updating recipe:', err);
    }
  };

  const handleIngredientChange = (index: number, key: string, value: string) => {
    if (!recipe) return;
    const updatedIngredients = [...recipe.ingredients];
    updatedIngredients[index] = { ...updatedIngredients[index], [key]: value };
    setRecipe({ ...recipe, ingredients: updatedIngredients });
  };

  const handleDirectionChange = (index: number, value: string) => {
    if (!recipe) return;
    const updatedDirections = [...recipe.directions];
    updatedDirections[index] = value;
    setRecipe({ ...recipe, directions: updatedDirections });
  };

  if (!recipe) {
    return <Text style={EditRecipeFormStyles.title}>Loading...</Text>;
  }

  return (
    <ScrollView contentContainerStyle={EditRecipeFormStyles.editRecipeForm}>
      <Text style={EditRecipeFormStyles.title}>Edit Recipe</Text>

      {/* Recipe Name */}
      <Text>Name:</Text>
      <TextInput
        style={EditRecipeFormStyles.ingredientInput}
        value={formData.name}
        onChangeText={(text) => setFormData({ ...formData, name: text })}
      />

      {/* Recipe Times */}
      <Text>Prep Time:</Text>
      <TextInput
        style={EditRecipeFormStyles.ingredientInput}
        value={formData.prepTime}
        onChangeText={(text) => setFormData({ ...formData, prepTime: text })}
      />

      <Text>Cook Time:</Text>
      <TextInput
        style={EditRecipeFormStyles.ingredientInput}
        value={formData.cookTime}
        onChangeText={(text) => setFormData({ ...formData, cookTime: text })}
      />

      <Text>Total Time:</Text>
      <TextInput
        style={EditRecipeFormStyles.ingredientInput}
        value={formData.totalTime}
        onChangeText={(text) => setFormData({ ...formData, totalTime: text })}
      />

      {/* Servings & Yield */}
      <Text>Servings:</Text>
      <TextInput
        style={EditRecipeFormStyles.ingredientInput}
        value={formData.servings}
        onChangeText={(text) => setFormData({ ...formData, servings: text })}
        keyboardType="numeric"
      />

      <Text>Yield:</Text>
      <TextInput
        style={EditRecipeFormStyles.ingredientInput}
        value={formData.yield}
        onChangeText={(text) => setFormData({ ...formData, yield: text })}
      />

      {/* Course Selection */}
      <Text>Course:</Text>
      <Picker
        selectedValue={formData.course}
        onValueChange={(value) => setFormData({ ...formData, course: value })}
        style={EditRecipeFormStyles.ingredientInput}
      >
        <Picker.Item label="Select Course" value="" />
        <Picker.Item label="Main Course" value="Main Course" />
        <Picker.Item label="Side" value="Side" />
        <Picker.Item label="Salad" value="Salad" />
        <Picker.Item label="Soup" value="Soup" />
        <Picker.Item label="Appetizer" value="Appetizer" />
        <Picker.Item label="Dessert" value="Dessert" />
        <Picker.Item label="Breakfast" value="Breakfast" />
      </Picker>

      {/* Ingredients List */}
      <Text>Ingredients:</Text>
      <FlatList
        data={recipe.ingredients}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View style={EditRecipeFormStyles.ingredient}>
            <TextInput
              style={EditRecipeFormStyles.ingredientInput}
              value={item.amount}
              onChangeText={(text) => handleIngredientChange(index, 'amount', text)}
              placeholder="Amount"
            />
            <TextInput
              style={EditRecipeFormStyles.ingredientInput}
              value={item.unit}
              onChangeText={(text) => handleIngredientChange(index, 'unit', text)}
              placeholder="Unit"
            />
            <TextInput
              style={EditRecipeFormStyles.ingredientInput}
              value={item.name}
              onChangeText={(text) => handleIngredientChange(index, 'name', text)}
              placeholder="Ingredient"
            />
          </View>
        )}
      />

      {/* Directions List */}
      <Text>Directions:</Text>
      <FlatList
        data={recipe.directions}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item, index }) => (
          <TextInput
            style={EditRecipeFormStyles.directionInput}
            value={item}
            onChangeText={(text) => handleDirectionChange(index, text)}
            multiline
            placeholder={`Step ${index + 1}`}
          />
        )}
      />

      {/* Notes */}
      <Text>Notes:</Text>
      <TextInput
        style={EditRecipeFormStyles.textarea}
        value={formData.notes}
        onChangeText={(text) => setFormData({ ...formData, notes: text })}
        multiline
      />

      {/* Save Button */}
      <TouchableOpacity onPress={handleUpdate} style={EditRecipeFormStyles.directionButton}>
        <Text style={{ color: '#fff', textAlign: 'center' }}>Save Changes</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default EditRecipeForm;
