import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Alert,
  Image,
  TouchableOpacity,
  FlatList
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { getRecipeById, updateRecipe } from '../api/recipeAPI';
import { Recipe } from '../interfaces/Recipe';
import EditRecipeFormStyles from '../styles/EditRecipeFormStyles';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import { UnitOptions, COURSE_OPTIONS, CUISINE_OPTIONS } from '../constants/options';


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
    image: '',
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
          image: data.image || '',
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
      // need to add function to go back to recipe
      router.push({ pathname: '/RecipeDetail', params: { id: id } });
    } catch (err) {
      Alert.alert('Error', 'Failed to update recipe. Please try again.');
      console.error('Error updating recipe:', err);
    }
  };

  const handleImageChange = async () => {
    let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert('Permission Required', 'Please allow access to the media library.');
      return;
    }
  
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
  
    if (!result.canceled) {
      setFormData((prev) => ({ ...prev, image: result.assets[0].uri }));
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

  const handleIngredientChange = (index: number, key: string, value: string) => {
    const updatedIngredients = [...recipe.ingredients];
    updatedIngredients[index] = { ...updatedIngredients[index], [key]: value };
    setRecipe((prev) => ({ ...prev, ingredients: updatedIngredients }));
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

  const handleDirectionChange = (index: number, value: string) => {
    const updatedDirections = [...recipe.directions];
    updatedDirections[index] = value;
    setRecipe((prev) => ({ ...prev, directions: updatedDirections }));
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
                <Text style={EditRecipeFormStyles.sectionTitle}>Ingredients:</Text>
                <FlatList
                  data={recipe.ingredients}
                  keyExtractor={(_, index) => `ingredient-${index}`}
                  renderItem={({ item, index }) => (
                    <View style={EditRecipeFormStyles.ingredientItem}>
                      {/* Row for Amount & Unit */}
                      <View style={EditRecipeFormStyles.row}>
                        <TextInput
                          style={EditRecipeFormStyles.ingredientInput}
                          value={item.amount}
                          onChangeText={(text) => handleIngredientChange(index, 'amount', text)}
                          placeholder="Amount"
                        />
                        <Picker
                          selectedValue={item.unit}
                          onValueChange={(value) => handleIngredientChange(index, 'unit', value)}
                          style={EditRecipeFormStyles.picker}
                        >
                          {UnitOptions.map((unit) => (
                            <Picker.Item key={unit.value} label={unit.label} value={unit.value} />
                          ))}
                        </Picker>
                      </View>

                      {/* Ingredient Name Input */}
                      <TextInput
                        style={EditRecipeFormStyles.ingredientInput}
                        value={item.name}
                        onChangeText={(text) => handleIngredientChange(index, 'name', text)}
                        placeholder="Ingredient Name"
                      />

                      {/* Move & Remove Buttons */}
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
                <TouchableOpacity onPress={addIngredient} style={EditRecipeFormStyles.addButton}>
                  <Text style={EditRecipeFormStyles.addButtonText}>➕ Add Ingredient</Text>
                </TouchableOpacity>
              </View>
            );

          case 'directions':
            return (
              <View>
                <Text style={EditRecipeFormStyles.sectionTitle}>Directions:</Text>
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
                <Text style={EditRecipeFormStyles.sectionTitle}>Notes:</Text>
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

          {/* Course Picker */}
          <Text>Course:</Text>
          <Picker
              selectedValue={formData.course}
              onValueChange={(value) => setFormData({ ...formData, course: value })}
              style={EditRecipeFormStyles.picker}
          >
              <Picker.Item label="Select Course" value="" />
              {COURSE_OPTIONS.map((course) => (
                  <Picker.Item key={course} label={course} value={course} />
              ))}
          </Picker>

          {/* Cuisine Picker */}
          <Text>Cuisine:</Text>
          <Picker
              selectedValue={formData.cuisine}
              onValueChange={(value) => setFormData({ ...formData, cuisine: value })}
              style={EditRecipeFormStyles.picker}
          >
              <Picker.Item label="Select Cuisine" value="" />
              {CUISINE_OPTIONS.map((cuisine) => (
                  <Picker.Item key={cuisine} label={cuisine} value={cuisine} />
              ))}
          </Picker>
        </View>
      }
      ListFooterComponent={
        <View>
          {/* Image Upload Button */}
          <TouchableOpacity onPress={handleImageChange} style={EditRecipeFormStyles.uploadButton}>
            <Text style={EditRecipeFormStyles.uploadButtonText}>Upload Image</Text>
          </TouchableOpacity>
      
          {/* Display Image Preview If Available */}
          {formData.image ? (
            <Image source={{ uri: formData.image }} style={EditRecipeFormStyles.imagePreview} />
          ) : (
            <Text style={{ textAlign: 'center', marginTop: 10 }}>No Image Selected</Text>
          )}
      
          {/* Save Button */}
          <TouchableOpacity onPress={handleUpdate} style={[EditRecipeFormStyles.saveButton]}>
            <Text style={EditRecipeFormStyles.saveButtonText}>Save Changes</Text>
          </TouchableOpacity>
        </View>
      }
    />
  );
};

export default EditRecipeForm;
