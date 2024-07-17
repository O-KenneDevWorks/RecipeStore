import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import axios from 'axios';
import Select from 'react-select';
import imageCompression from 'browser-image-compression';
import './Styling/AddRecipeForm.css';

const unitOptions = [
    { value: 'Teaspoon', label: 'Teaspoon (tsp)' },
    { value: 'Tablespoon', label: 'Tablespoon (tbsp)' },
    { value: 'Fluid Ounce', label: 'Fluid Ounce (fl oz)' },
    { value: 'Cup', label: 'Cup' },
    { value: 'Pint', label: 'Pint (pt)' },
    { value: 'Quart', label: 'Quart (qt)' },
    { value: 'Gallon', label: 'Gallon (gal)' },
    { value: 'Milliliter', label: 'Milliliter (ml)' },
    { value: 'Liter', label: 'Liter (l)' },
    { value: 'Deciliter', label: 'Deciliter (dl)' },
    { value: 'Ounce', label: 'Ounce (oz)' },
    { value: 'Pound', label: 'Pound (lb)' },
    { value: 'Gram', label: 'Gram (g)' },
    { value: 'Kilogram', label: 'Kilogram (kg)' },
    { value: 'Inch', label: 'Inch (in)' },
    { value: 'Centimeter', label: 'Centimeter (cm)' },
    { value: 'Millimeter', label: 'Millimeter (mm)' },
    { value: 'Each', label: 'Each' },
    { value: 'Dozen', label: 'Dozen' },
    { value: 'Pinch', label: 'Pinch' },
    { value: 'Dash', label: 'Dash' },
    { value: 'Smidgen', label: 'Smidgen' },
    { value: 'Handful', label: 'Handful' },
    { value: 'Bunch', label: 'Bunch' },
    { value: 'Degrees Fahrenheit', label: 'Degrees Fahrenheit (°F)' },
    { value: 'Degrees Celsius', label: 'Degrees Celsius (°C)' }
];

const AddRecipeForm = () => {
    const [recipeData, setRecipeData] = useState({
        name: '',
        ingredients: [{ amount: '', unit: '', name: '' }],
        directions: [''],
        prepTime: '',
        cookTime: '',
        totalTime: '',
        servings: '',
        yield: '',
        image: '',
        tags: [],
        course: '',
        cuisine: ''
    });
    const [imagePreview, setImagePreview] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setRecipeData({ ...recipeData, [name]: value });
    };

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const options = {
                maxSizeMB: 1,
                maxWidthOrHeight: 1920,
                useWebWorker: true
            };
            try {
                const compressedFile = await imageCompression(file, options);
                const reader = new FileReader();
                reader.onloadend = () => {
                    setImagePreview(reader.result);
                    setRecipeData({ ...recipeData, image: reader.result });
                };
                reader.readAsDataURL(compressedFile);
            } catch (error) {
                console.error('Error compressing image:', error);
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://10.0.0.85:3000/recipes', recipeData);
            console.log('Recipe added:', response.data);
            setRecipeData({
                name: '',
                ingredients: [{ amount: '', unit: '', name: '' }],
                directions: [''],
                prepTime: '',
                cookTime: '',
                totalTime: '',
                servings: '',
                yield: '',
                image: '',
                tags: [],
                course: '',
                cuisine: ''
            });
            setImagePreview('');
        } catch (error) {
            console.error('Error adding recipe:', error);
        }
    };

    // Helper function to reorder items in a list
    const reorder = (list, startIndex, endIndex) => {
        const result = Array.from(list);
        const [removed] = result.splice(startIndex, 1);
        result.splice(endIndex, 0, removed);
        return result;
    };

    const onDragEnd = (result) => {
        if (!result.destination) return;

        if (result.type === 'ingredients') {
            setRecipeData({
                ...recipeData,
                ingredients: reorder(recipeData.ingredients, result.source.index, result.destination.index)
            });
        } else if (result.type === 'directions') {
            setRecipeData({
                ...recipeData,
                directions: reorder(recipeData.directions, result.source.index, result.destination.index)
            });
        }
    };

    const handleAddIngredient = () => {
        setRecipeData({
            ...recipeData,
            ingredients: [...recipeData.ingredients, { amount: '', unit: '', name: '' }]
        });
    };

    const handleIngredientChange = (index, field, value) => {
        const newIngredients = recipeData.ingredients.map((ingredient, i) => {
            if (i === index) {
                return { ...ingredient, [field]: value };
            }
            return ingredient;
        });
        setRecipeData({ ...recipeData, ingredients: newIngredients });
    };

    const handleRemoveIngredient = (index) => {
        const newIngredients = recipeData.ingredients.filter((_, i) => i !== index);
        setRecipeData({ ...recipeData, ingredients: newIngredients });
    };

    const handleAddDirection = () => {
        setRecipeData({
            ...recipeData,
            directions: [...recipeData.directions, '']
        });
    };

    const handleDirectionChange = (index, e) => {
        const newDirections = recipeData.directions.map((direction, i) => {
            if (i === index) {
                return e.target.value;
            }
            return direction;
        });
        setRecipeData({ ...recipeData, directions: newDirections });
    };

    const handleRemoveDirection = (index) => {
        const newDirections = recipeData.directions.filter((_, i) => i !== index);
        setRecipeData({ ...recipeData, directions: newDirections });
    };

    const handleTagChange = (e) => {
        setRecipeData({ ...recipeData, tags: e.target.value.split(',').map(tag => tag.trim()) });
    };

    return (
        <form onSubmit={handleSubmit} className="add-recipe-form">
            <label>Name *</label>
            <input type="text" name="name" value={recipeData.name} onChange={handleChange} required />

            <label>Prep Time</label>
            <input type="text" name="prepTime" value={recipeData.prepTime} onChange={handleChange} />

            <label>Cook Time</label>
            <input type="text" name="cookTime" value={recipeData.cookTime} onChange={handleChange} />

            <label>Total Time</label>
            <input type="text" name="totalTime" value={recipeData.totalTime} onChange={handleChange} />

            <label>Servings</label>
            <input type="number" name="servings" value={recipeData.servings} onChange={handleChange} />

            <label>Yield</label>
            <input type="text" name="yield" value={recipeData.yield} onChange={handleChange} />

            <label>
                Course:
                <select name="course" value={recipeData.course} onChange={handleChange} required>
                    <option value="">Select Course</option>
                    <option value="Main Course">Main Course</option>
                    <option value="Side">Side</option>
                    <option value="Salad">Salad</option>
                    <option value="Soup">Soup</option>
                    <option value="Appetizer">Appetizer</option>
                    <option value="Dessert">Dessert</option>
                    <option value="Breakfast">Breakfast</option>
                </select>
            </label>
            <label>
                Cuisine:
                <select name="cuisine" value={recipeData.cuisine} onChange={handleChange} required>
                    <option value="">Select Cuisine</option>
                    <option value="Italian">Italian</option>
                    <option value="Mexican">Mexican</option>
                    <option value="Chinese">Chinese</option>
                    <option value="Indian">Indian</option>
                    <option value="French">French</option>
                    <option value="Japanese">Japanese</option>
                    <option value="American">American</option>
                    <option value="Thai">Thai</option>
                </select>
            </label>

            <label>Tags</label>
            <input
                type="text"
                name="tags"
                value={recipeData.tags.join(', ')}
                onChange={handleTagChange}
                placeholder="Enter tags separated by commas"
            />

            <label>Ingredients *</label>
            {recipeData.ingredients.map((ingredient, index) => (
                <div key={index} className="ingredient-input">
                    <input
                        type="text"
                        name="amount"
                        placeholder="Amount (e.g., 1/2, 2.5, 3)"
                        value={ingredient.amount}
                        onChange={(e) => handleIngredientChange(index, 'amount', e.target.value)}
                        required
                    />
                    <Select
                        name="unit"
                        options={unitOptions}
                        value={unitOptions.find(option => option.value === ingredient.unit)}
                        onChange={(option) => handleIngredientChange(index, 'unit', option.value)}
                        placeholder="Select Unit"
                        required
                    />
                    <input
                        type="text"
                        name="name"
                        placeholder="Ingredient"
                        value={ingredient.name}
                        onChange={(e) => handleIngredientChange(index, 'name', e.target.value)}
                        required
                    />
                    <button type="button" onClick={() => handleRemoveIngredient(index)}>Remove</button>
                </div>
            ))}
            <button type="button" onClick={handleAddIngredient}>Add Ingredient</button>

            <label>Directions *</label>
            {recipeData.directions.map((direction, index) => (
                <div key={index} className="direction-input">
                    <label>Step {index + 1}</label>
                    <textarea
                        name="direction"
                        value={direction}
                        onChange={(e) => handleDirectionChange(index, e)}
                        required
                    />
                    <button type="button" onClick={() => handleRemoveDirection(index)}>Remove</button>
                </div>
            ))}
            <button type="button" onClick={handleAddDirection}>Add Step</button>

            <label>Image</label>
            <input type="file" name="image" accept="image/*" onChange={handleImageChange} />
            {imagePreview && <img src={imagePreview} alt="Recipe Preview" className="image-preview" />}

            <button type="submit">Add Recipe</button>
        </form>
    );
};

export default AddRecipeForm;