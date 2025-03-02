import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    Button,
    TouchableOpacity,
    FlatList,
    Image,
    Alert,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { Picker } from '@react-native-picker/picker';
import { addRecipe } from '../api/recipeAPI';
import { COURSE_OPTIONS, CUISINE_OPTIONS, UnitOptions } from '../constants/options';
import AddRecipeFormStyles from '../styles/AddRecipeFormStyles'

const AddRecipeForm = () => {
    const router = useRouter();

    const [recipeData, setRecipeData] = useState({
        _id: '',
        name: '',
        ingredients: [{ amount: '', unit: UnitOptions[0].value, name: '' }],
        directions: [''],
        prepTime: '',
        cookTime: '',
        totalTime: '',
        servings: '',
        yield: '',
        image: '',
        tags: [],
        course: '',
        cuisine: '',
        notes: '',
    });
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    /** 📌 Handle Text Input Changes */
    const handleChange = (name: string, value: string) => {
        setRecipeData((prev) => ({ ...prev, [name]: value }));
    };

    /** 📌 Handle Image Upload */
    const handleImageChange = async () => {
        let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permissionResult.granted) {
            Alert.alert('Permission Required', 'Please allow access to the media library.');
            return;
        }

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setImagePreview(result.assets[0].uri);
            handleChange('image', result.assets[0].uri);
        }
    };

    const testRecipe = {
        name: "Test Recipe",
        ingredients: [{ amount: "1", unit: "cup", name: "Flour" }],
        directions: ["Mix everything"],
        prepTime: "10 mins",
        cookTime: "20 mins",
        totalTime: "30 mins",
        servings: "2",
        yield: "",
        image: "",
        tags: ["Dessert"],
        course: "Dessert",
        cuisine: "French",
        notes: "This is a test recipe",
    };

    /** 📌 Submit Recipe */
    const handleSubmit = async (e: any) => {
        e.preventDefault();
        console.log("Submitting Recipe Data:", JSON.stringify(recipeData, null, 2));
        const { _id, ...recipeToSend } = recipeData;
        console.log("Submitting Recipe Data:", JSON.stringify(recipeToSend, null, 2));

        try {
            // const addedRecipe = await addRecipe(recipeData);
            const addedRecipe = await addRecipe(recipeToSend);
            console.log("Recipe added:", addedRecipe);
            resetForm();
        } catch (error) {
            console.error("Error adding recipe:", error);
        }
    };

    const resetForm = () => {
        setRecipeData({
            _id: '',
            name: "",
            ingredients: [{ amount: "", unit: UnitOptions[0].value, name: "" }],
            directions: [""],
            prepTime: "",
            cookTime: "",
            totalTime: "",
            servings: "",
            yield: "",
            image: "",
            tags: [],
            course: "",
            cuisine: "",
            notes: "",
        });
        setImagePreview(null);
    };

    /*** 📌 Reordering Logic ***/
    const moveItem = <T,>(arr: T[], fromIndex: number, toIndex: number): T[] => {
        if (toIndex < 0 || toIndex >= arr.length) return arr; // Prevent out-of-bounds movement
        const item = arr[fromIndex];
        const newArr = arr.filter((_, index) => index !== fromIndex);
        newArr.splice(toIndex, 0, item);
        return newArr;
    };

    /** 📌 Ingredient Functions */
    const handleIngredientChange = (index: number, key: string, value: string) => {
        const updatedIngredients = [...recipeData.ingredients];
        updatedIngredients[index] = { ...updatedIngredients[index], [key]: value };
        setRecipeData((prev) => ({ ...prev, ingredients: updatedIngredients }));
    };

    const handleAddIngredient = () => {
        setRecipeData((prev) => ({
            ...prev,
            ingredients: [...prev.ingredients, { amount: '', unit: UnitOptions[0].value, name: '' }],
        }));
    };

    const moveIngredient = (index: number, direction: 'up' | 'down') => {
        if (!recipeData) return;
        const newIngredients = moveItem(recipeData.ingredients, index, direction === 'up' ? index - 1 : index + 1);
        setRecipeData({ ...recipeData, ingredients: newIngredients });
    };

    const handleRemoveIngredient = (index: number) => {
        const updatedIngredients = recipeData.ingredients.filter((_, i) => i !== index);
        setRecipeData((prev) => ({ ...prev, ingredients: updatedIngredients }));
    };

    /** 📌 Direction Functions */
    const handleDirectionChange = (index: number, value: string) => {
        const updatedDirections = [...recipeData.directions];
        updatedDirections[index] = value;
        setRecipeData((prev) => ({ ...prev, directions: updatedDirections }));
    };

    const moveDirection = (index: number, direction: 'up' | 'down') => {
        if (!recipeData) return;
        const newDirections = moveItem(recipeData.directions, index, direction === 'up' ? index - 1 : index + 1);
        setRecipeData({ ...recipeData, directions: newDirections });
    };

    const handleAddDirection = () => {
        setRecipeData((prev) => ({
            ...prev,
            directions: [...prev.directions, ''],
        }));
    };


    const handleRemoveDirection = (index: number) => {
        const updatedDirections = recipeData.directions.filter((_, i) => i !== index);
        setRecipeData((prev) => ({ ...prev, directions: updatedDirections }));
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={AddRecipeFormStyles.container}
        >
            <FlatList
                ListHeaderComponent={
                    <>
                        <Text style={AddRecipeFormStyles.title}>Add Recipe</Text>

                        {/* Recipe Name */}
                        <Text>Recipe Name *</Text>
                        <TextInput
                            style={AddRecipeFormStyles.ingredientInput}
                            placeholder="Recipe Name *"
                            value={recipeData.name}
                            onChangeText={(text) => handleChange('name', text)}
                        />

                        {/* Recipe Times */}
                        <Text>Prep Time:</Text>
                        <TextInput
                            style={AddRecipeFormStyles.ingredientInput}
                            placeholder="Prep Time"
                            onChangeText={(text) => handleChange('prepTime', text)}
                        />
                        <Text>Cook Time:</Text>
                        <TextInput
                            style={AddRecipeFormStyles.ingredientInput}
                            placeholder="Cook Time"
                            onChangeText={(text) => handleChange('cookTime', text)}
                        />
                        <Text>Total Time:</Text>
                        <TextInput
                            style={AddRecipeFormStyles.ingredientInput}
                            placeholder="Total Time"
                            onChangeText={(text) => handleChange('totalTime', text)}
                        />

                        {/* Servings & Yield */}
                        <Text>Servings:</Text>
                        <TextInput
                            style={AddRecipeFormStyles.ingredientInput}
                            placeholder="Servings"
                            keyboardType="numeric" // Forces numeric keyboard on mobile
                            onChangeText={(text) => handleChange('servings', text.replace(/[^0-9]/g, '') || '0')}
                            value={recipeData.servings}
                        />
                        <Text>Yield:</Text>
                        <TextInput
                            style={AddRecipeFormStyles.ingredientInput}
                            placeholder="Yield"
                            onChangeText={(text) => handleChange('yield', text)}
                        />

                        {/* Course Picker */}
                        <Text>Course:</Text>
                        <Picker
                            selectedValue={recipeData.course}
                            onValueChange={(value) => setRecipeData({ ...recipeData, course: value })}
                            style={AddRecipeFormStyles.picker}
                        >
                            <Picker.Item label="Select Course" value="" />
                            {COURSE_OPTIONS.map((course) => (
                                <Picker.Item key={course} label={course} value={course} />
                            ))}
                        </Picker>

                        {/* Cuisine Picker */}
                        <Text>Cuisine:</Text>
                        <Picker
                            selectedValue={recipeData.cuisine}
                            onValueChange={(value) => setRecipeData({ ...recipeData, cuisine: value })}
                            style={AddRecipeFormStyles.picker}
                        >
                            <Picker.Item label="Select Cuisine" value="" />
                            {CUISINE_OPTIONS.map((cuisine) => (
                                <Picker.Item key={cuisine} label={cuisine} value={cuisine} />
                            ))}
                        </Picker>
                    </>
                }
                data={[{ type: 'ingredients' }, { type: 'directions' }, { type: 'notes' }, { type: 'footer' }]}
                keyExtractor={(item) => item.type}
                renderItem={({ item }) => {
                    if (item.type === 'ingredients') {
                        return (
                            <>
                                <Text style={AddRecipeFormStyles.sectionTitle}>Ingredients *</Text>
                                <FlatList
                                    data={recipeData.ingredients}
                                    keyExtractor={(_, index) => `ingredient-${index}`}
                                    renderItem={({ item, index }) => (
                                        <View style={AddRecipeFormStyles.ingredientItem}>

                                            {/* Row for Amount & Unit */}
                                            <View style={AddRecipeFormStyles.ingredientRow}>
                                                <TextInput
                                                    style={AddRecipeFormStyles.ingredientInput}
                                                    placeholder="Amount"
                                                    value={item.amount}
                                                    onChangeText={(text) => handleIngredientChange(index, 'amount', text)}
                                                    keyboardType="numeric"
                                                />

                                                <View style={AddRecipeFormStyles.pickerContainer}>
                                                    <Picker
                                                        selectedValue={item.unit}
                                                        onValueChange={(value) => handleIngredientChange(index, 'unit', value)}
                                                        style={AddRecipeFormStyles.picker}
                                                        mode="dropdown"
                                                    >
                                                        {UnitOptions.map((unit) => (
                                                            <Picker.Item key={unit.value} label={unit.label} value={unit.value} />
                                                        ))}
                                                    </Picker>
                                                </View>
                                            </View>

                                            {/* Ingredient Name Input on Next Line */}
                                            <TextInput
                                                style={AddRecipeFormStyles.ingredientNameInput}
                                                placeholder="Ingredient Name"
                                                value={item.name}
                                                onChangeText={(text) => handleIngredientChange(index, 'name', text)}
                                            />

                                            {/* Move & Remove Buttons on a New Row */}
                                            <View style={AddRecipeFormStyles.buttonRow}>
                                                <TouchableOpacity
                                                    onPress={() => moveIngredient(index, 'up')}
                                                    style={[AddRecipeFormStyles.button, AddRecipeFormStyles.moveUpButton, AddRecipeFormStyles.buttonFlex]}
                                                >
                                                    <Text style={AddRecipeFormStyles.buttonText}>⬆</Text>
                                                </TouchableOpacity>
                                                <TouchableOpacity
                                                    onPress={() => moveIngredient(index, 'down')}
                                                    style={[AddRecipeFormStyles.button, AddRecipeFormStyles.moveDownButton, AddRecipeFormStyles.buttonFlex]}
                                                >
                                                    <Text style={AddRecipeFormStyles.buttonText}>⬇</Text>
                                                </TouchableOpacity>
                                                <TouchableOpacity
                                                    onPress={() => handleRemoveIngredient(index)}
                                                    style={[AddRecipeFormStyles.button, AddRecipeFormStyles.deleteButton, AddRecipeFormStyles.buttonFlex]}
                                                >
                                                    <Text style={AddRecipeFormStyles.buttonText}>❌</Text>
                                                </TouchableOpacity>
                                            </View>

                                        </View>
                                    )}
                                />

                                <Button title="Add Ingredient" onPress={handleAddIngredient} />
                            </>
                        );
                    }

                    if (item.type === 'directions') {
                        return (
                            <>
                                <Text style={AddRecipeFormStyles.sectionTitle}>Directions *</Text>
                                <FlatList
                                    data={recipeData.directions}
                                    keyExtractor={(_, index) => `direction-${index}`}
                                    renderItem={({ item, index }) => (
                                        <View style={AddRecipeFormStyles.directionItem}>
                                            <TextInput
                                                style={AddRecipeFormStyles.directionInput}
                                                placeholder={`Step ${index + 1}`}
                                                value={item}
                                                onChangeText={(text) => handleDirectionChange(index, text)}
                                                multiline
                                            />
                                            {/* Move & Remove Buttons */}
                                            <View style={AddRecipeFormStyles.buttonRow}>
                                                <TouchableOpacity
                                                    onPress={() => moveDirection(index, 'up')}
                                                    style={[AddRecipeFormStyles.button, AddRecipeFormStyles.moveUpButton]}
                                                >
                                                    <Text style={AddRecipeFormStyles.buttonText}>⬆</Text>
                                                </TouchableOpacity>
                                                <TouchableOpacity
                                                    onPress={() => moveDirection(index, 'down')}
                                                    style={[AddRecipeFormStyles.button, AddRecipeFormStyles.moveDownButton]}
                                                >
                                                    <Text style={AddRecipeFormStyles.buttonText}>⬇</Text>
                                                </TouchableOpacity>
                                                <TouchableOpacity
                                                    onPress={() => handleRemoveDirection(index)}
                                                    style={[AddRecipeFormStyles.button, AddRecipeFormStyles.deleteButton]}
                                                >
                                                    <Text style={AddRecipeFormStyles.buttonText}>❌</Text>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    )}
                                />
                                <Button title="Add Step" onPress={handleAddDirection} />
                            </>
                        );
                    }

                    if (item.type === 'notes') {
                        return (
                            <View style={AddRecipeFormStyles.notesContainer}>
                                <Text style={AddRecipeFormStyles.sectionTitle}>Notes:</Text>
                                <TextInput
                                    style={AddRecipeFormStyles.textarea}
                                    placeholder="Add any additional notes here..."
                                    value={recipeData.notes}
                                    onChangeText={(text) => handleChange('notes', text)}
                                    multiline
                                />
                            </View>
                        );
                    }

                    if (item.type === 'footer') {
                        return (
                            <>
                                {/* Image Upload Button */}
                                <TouchableOpacity onPress={handleImageChange} style={AddRecipeFormStyles.uploadButton}>
                                    <Text style={AddRecipeFormStyles.uploadButtonText}>Upload Image</Text>
                                </TouchableOpacity>

                                {/* Display Image Preview If Available */}
                                {imagePreview && <Image source={{ uri: imagePreview }} style={AddRecipeFormStyles.imagePreview} />}

                                {/* Submit Button */}
                                <TouchableOpacity onPress={handleSubmit} style={AddRecipeFormStyles.submitButton}>
                                    <Text style={AddRecipeFormStyles.submitButtonText}>Add Recipe</Text>
                                </TouchableOpacity>
                            </>
                        );
                    }

                    return null;
                }}
            />
        </KeyboardAvoidingView>
    );

};

export default AddRecipeForm;
