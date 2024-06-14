import React, { useState } from 'react';
import axios from 'axios';
import './Styling/AddRecipeForm.css';

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
        tags: [] // Initialize tags
    });
    const [imagePreview, setImagePreview] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setRecipeData({ ...recipeData, [name]: value });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
                setRecipeData({ ...recipeData, image: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3000/recipes', recipeData);
            console.log('Recipe added:', response.data);
            // Clear form after successful submission
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
                tags: []
            });
            setImagePreview('');
        } catch (error) {
            console.error('Error adding recipe:', error);
        }
    };

    const handleAddIngredient = () => {
        setRecipeData({
            ...recipeData,
            ingredients: [...recipeData.ingredients, { amount: '', unit: '', name: '' }]
        });
    };

    const handleIngredientChange = (index, e) => {
        const { name, value } = e.target;
        const newIngredients = recipeData.ingredients.map((ingredient, i) => {
            if (i === index) {
                return { ...ingredient, [name]: value };
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

            <label>Ingredients *</label>
            {recipeData.ingredients.map((ingredient, index) => (
                <div key={index} className="ingredient-input">
                    <input
                        type="number"
                        name="amount"
                        placeholder="Amount"
                        value={ingredient.amount}
                        onChange={(e) => handleIngredientChange(index, e)}
                        step="0.01"
                        required
                    />
                    <input
                        type="text"
                        name="unit"
                        placeholder="Unit"
                        value={ingredient.unit}
                        onChange={(e) => handleIngredientChange(index, e)}
                        required
                    />
                    <input
                        type="text"
                        name="name"
                        placeholder="Ingredient"
                        value={ingredient.name}
                        onChange={(e) => handleIngredientChange(index, e)}
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

            <label>Tags</label>
            <input
                type="text"
                name="tags"
                value={recipeData.tags.join(', ')}
                onChange={handleTagChange}
                placeholder="Enter tags separated by commas"
            />

            <button type="submit">Add Recipe</button>
        </form>
    );
};

export default AddRecipeForm;
