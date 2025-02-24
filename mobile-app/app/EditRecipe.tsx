import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Alert,
  TouchableOpacity,
  FlatList
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { getRecipeById, updateRecipe } from '../api/recipeAPI';
import { Recipe } from '../interfaces/Recipe';
import EditRecipeFormStyles from '../styles/EditRecipeFormStyles';
import { Picker } from '@react-native-picker/picker';

const EditRecipeForm = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    prepTime: '',
    cookTime: '',
    totalTime: '',
    servings: '',
    yield: '',
    tags: [],
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
          tags: data.tags || [],
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
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch (err) {
      Alert.alert('Error', 'Failed to update recipe. Please try again.');
      console.error('Error updating recipe:', err);
    }
  };

  const handleTagChange = (e: ChangeEvent<HTMLInputElement>) => {
          const tags = e.target.value.split(',').map(tag => tag.trim());
          setRecipe(prev => ({ ...prev, tags }));
      };

  /*** 📌 Reordering Logic ***/
  const moveItem = <T,>(arr: T[], fromIndex: number, toIndex: number): T[] => {
    if (toIndex < 0 || toIndex >= arr.length) return arr; // Prevent out-of-bounds movement
    const item = arr[fromIndex];
    const newArr = arr.filter((_, index) => index !== fromIndex);
    newArr.splice(toIndex, 0, item);
    return newArr;
  };

  const addIngredient = () => {
    setRecipe(prev => ({ ...prev, ingredients: [...prev.ingredients, { amount: '', unit: '', name: '' }] }));
  };

  const removeIngredient = (index: number) => {
    const newIngredients = [...recipe.ingredients];
    newIngredients.splice(index, 1);
    setRecipe(prev => ({ ...prev, ingredients: newIngredients }));
  };
  
  const moveIngredient = (index: number, direction: 'up' | 'down') => {
    if (!recipe) return;
    const newIngredients = moveItem(recipe.ingredients, index, direction === 'up' ? index - 1 : index + 1);
    setRecipe({ ...recipe, ingredients: newIngredients });
  };

  const addDirection = () => {
    setRecipe(prev => ({ ...prev, directions: [...prev.directions, ''] }));
  };

  const removeDirection = (index: number) => {
    const newDirections = [...recipe.directions];
    newDirections.splice(index, 1);
    setRecipe(prev => ({ ...prev, directions: newDirections }));
  };

  const moveDirection = (index: number, direction: 'up' | 'down') => {
    if (!recipe) return;
    const newDirections = moveItem(recipe.directions, index, direction === 'up' ? index - 1 : index + 1);
    setRecipe({ ...recipe, directions: newDirections });
  };

  if (!recipe) {
    return <Text style={EditRecipeFormStyles.title}>Loading...</Text>;
  }

  return (
    <FlatList
      data={[
        { type: 'header' },
        { type: 'ingredients', data: recipe.ingredients },
        { type: 'directions', data: recipe.directions },
        { type: 'notes', data: formData.notes },
        { type: 'footer' }
      ]}
      keyExtractor={(_, index) => `section-${index}`}
      renderItem={({ item }) => {
        switch (item.type) {
          case 'ingredients':
            return (
              <View>
                <Text>Ingredients:</Text>
                <FlatList
                  data={recipe.ingredients}
                  keyExtractor={(_, index) => `ingredient-${index}`}
                  renderItem={({ item, index }) => (
                    <View style={EditRecipeFormStyles.ingredientItem}>
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
                      <View style={EditRecipeFormStyles.buttonRow}>
                        <TouchableOpacity onPress={() => moveIngredient(index, 'up')} style={[EditRecipeFormStyles.button, EditRecipeFormStyles.moveUpButton]}>
                          <Text style={EditRecipeFormStyles.buttonText}>⬆</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => moveIngredient(index, 'down')} style={[EditRecipeFormStyles.button, EditRecipeFormStyles.moveDownButton]}>
                          <Text style={EditRecipeFormStyles.buttonText}>⬇</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => removeIngredient(index)} style={[EditRecipeFormStyles.button, EditRecipeFormStyles.deleteButton]}>
                          <Text style={EditRecipeFormStyles.buttonText}>❌</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  )}
                />

                {/* Add Ingredient Button at the End */}
                <TouchableOpacity onPress={addIngredient} style={EditRecipeFormStyles.addButton}>
                  <Text style={EditRecipeFormStyles.addButtonText}>➕ Add Ingredient</Text>
                </TouchableOpacity>
              </View>
            );

          case 'directions':
            return (
              <View>
                <Text>Directions:</Text>
                <FlatList
                  data={recipe.directions}
                  keyExtractor={(_, index) => `direction-${index}`}
                  renderItem={({ item, index }) => (
                    <View style={EditRecipeFormStyles.directionItem}>
                      <TextInput
                        style={EditRecipeFormStyles.directionInput}
                        value={item}
                        onChangeText={(text) => handleDirectionChange(index, text)}
                        multiline
                        placeholder={`Step ${index + 1}`}
                      />
                      <View style={EditRecipeFormStyles.buttonRow}>
                        <TouchableOpacity onPress={() => moveDirection(index, 'up')} style={[EditRecipeFormStyles.button, EditRecipeFormStyles.moveUpButton]}>
                          <Text style={EditRecipeFormStyles.buttonText}>⬆</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => moveDirection(index, 'down')} style={[EditRecipeFormStyles.button, EditRecipeFormStyles.moveDownButton]}>
                          <Text style={EditRecipeFormStyles.buttonText}>⬇</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => removeDirection(index)} style={[EditRecipeFormStyles.button, EditRecipeFormStyles.deleteButton]}>
                          <Text style={EditRecipeFormStyles.buttonText}>❌</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  )}
                />

                {/* Add Direction Button at the End */}
                <TouchableOpacity onPress={addDirection} style={EditRecipeFormStyles.addButton}>
                  <Text style={EditRecipeFormStyles.addButtonText}>➕ Add Direction</Text>
                </TouchableOpacity>
              </View>
            );

          case 'notes':
            return (
              <View>
                <Text>Notes:</Text>
                <TextInput
                  style={EditRecipeFormStyles.ingredientInput}
                  value={item.data}
                  onChangeText={(text) => setFormData({ ...formData, notes: text })}
                  multiline
                />
              </View>
            );

          default:
            return null;
        }
      }}
      ListHeaderComponent={
        <View>
          <Text style={EditRecipeFormStyles.title}>Edit Recipe</Text>
          <Text>Name:</Text>
          <TextInput
            style={EditRecipeFormStyles.ingredientInput}
            value={formData.name}
            onChangeText={(text) => setFormData({ ...formData, name: text })}
          />
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
          <Text>Servings:</Text>
          <TextInput
            style={EditRecipeFormStyles.ingredientInput}
            value={formData.servings}
            onChangeText={(text) => setFormData({ ...formData, servings: text })}
          />
          <Text>Tags:</Text>
                    <TextInput
                      style={EditRecipeFormStyles.ingredientInput}
                      value={formData.tags}
                      onChangeText={(text) => setFormData({ ...formData, tags: text })}
                    />
          <Text>Course:</Text>
          <TextInput
            style={EditRecipeFormStyles.ingredientInput}
            value={formData.course}
            onChangeText={(text) => setFormData({ ...formData, course: text })}
          />
          <Text>Cuisine:</Text>
          <TextInput
            style={EditRecipeFormStyles.ingredientInput}
            value={formData.cuisine}
            onChangeText={(text) => setFormData({ ...formData, cuisine: text })}
          />
        </View>
      }
      ListFooterComponent={
        <TouchableOpacity onPress={handleUpdate} style={[EditRecipeFormStyles.addButton, { backgroundColor: '#28a745' }]}>
          <Text style={{ color: '#fff', textAlign: 'center' }}>Save Changes</Text>
        </TouchableOpacity>
      }
    />
  );
};

export default EditRecipeForm;
