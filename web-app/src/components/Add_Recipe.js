import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navigation from './NavBar';

const AddRecipeForm = () => {
    const [recipeData, setRecipeData] = useState({
        name: '',
        ingredients: [{ amount: '', unit: '', name: ''}],
        directions: [''],
        prepTime: '',
        cookTime: '',
        totalTime: '',
        servings: '',
        yield: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setRecipeData({ ...recipeData, [name]: value });
    };

    const handleIngredientChange = (index, e) => {
        const { name, value } = e.target;
        const newIngredients = [...recipeData.ingredients];
        newIngredients[index][name] = value;
        setRecipeData({ ...recipeData, ingredients: newIngredients});
    };

    const handleAddIngredient = () => {
        setRecipeData({
            ...recipeData,
            ingredients: [...recipeData.ingredients, { amount: '', unit: '', name: ''}]
        });
    };

    const handleRemoveIngredients = (index) => {
        const newIngredients = recipeData.ingredients.filter((_, i) => i !== index);
        setRecipeData({ ...recipeData, ingredients: newIngredients });
    };

    const handleDirectionChange = (index, e) => {
        const newDirections = [...recipeData.directions];
        newDirections[index] = e.target.value;
        setRecipeData({ ...recipeData, directions: newDirections });
    }

    const addDirection = () => {
        setRecipeData({ ...recipeData, directions: [...recipeData.directions, ''] });
    }

    const removeDirections = (index) => {
        const newDirections = recipeData.directions.filter((_, i) => i !== index);
        setRecipeData({ ...recipeData, directions: newDirections})
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://10.0.0.85:3000/recipes', recipeData);
            // Clear form after successful submission
            setRecipeData({
                name: '',
                ingredients: [{ amount: '', unit: '', name: ''}],
                directions: [''],
                prepTime: '',
                cookTime: '',
                totalTime: '',
                servings: '',
                yield: '',
            });
        } catch (error) {
            console.error('Error adding recipe: ', error)
        }
    };

    return (

        <form className="add-recipe=containter" onSubmit={handleSubmit}>
            <h2>Add New Recipe</h2>
            
            <div className='form-goup'>
            <label>Name *</label>
            <input type="text" name="name" value={recipeData.name} onChange={handleChange} required />
            </div>

            <div className="form-group-row">
                <div className='form-goup'>
                <label>Prep Time</label>
                <input type="text" name="prepTime" value={recipeData.prepTime} onChange={handleChange} />
                </div>

                <div className='form-goup'>
                <label>Cook Time</label>
                <input type="text" name="cookTime" value={recipeData.cookTime} onChange={handleChange} />
                </div>

                <div className='form-goup'>
                <label>Total Time</label>
                <input type="text" name="totalTime" value={recipeData.totalTime} onChange={handleChange} />
                </div>
            </div>

            <div className="form-group-row">
                <div className='form-goup'>
                <label>Servings</label>
                <input type="text" name="servings" value={recipeData.servings} onChange={handleChange} />
                </div>

                <div className='form-goup'>
                <label>Yield</label>
                <input type="text" name="yield" value={recipeData.yield} onChange={handleChange} />
                </div>
            </div>

            <div className='form-goup'>
                <label>Ingredients *</label>
                {recipeData.ingredients.map((ingredient, index) => (
                    <div key={index} className='ingredient-group'>
                        <input 
                            type='number'
                            step='0.001'
                            name='amount'
                            placeholder='Amount'
                            value={ingredient.amount}
                            onChange={(e) => handleIngredientChange(index, e)}
                        />
                        <input 
                            type='text'
                            name='unit'
                            placeholder='Unit'
                            value={ingredient.unit}
                            onChange={(e) => handleIngredientChange(index, e)}
                        />
                        <input 
                            type='text'
                            name='name'
                            placeholder='Ingredient'
                            value={ingredient.name}
                            onChange={(e) => handleIngredientChange(index, e)}
                        />
                        <button type='button' className="btn-remove" onClick={() => handleRemoveIngredients(index)}>Remove</button>
                    </div>
                ))}
                <button type='button' className="btn-add" onClick={handleAddIngredient}>Add Ingredient</button>
            </div>

            <div className='form-goup'>
                <label>Directions *</label>
                {recipeData.directions.map((direction, index) => (
                    <div key={index} className="directions-container">
                        <label>{`Step ${index + 1}`}</label>
                        <textarea value={direction} onChange={(e) => handleDirectionChange(index, e)} required />
                        <button type="button" className="btn-remove" onClick={() => removeDirections(index)}>Remove</button>
                    </div>
                ))}
                <button type="button" className="btn-add" onClick={addDirection}>Add Step</button>
            </div>

            <button type="submit">Add Recipe</button>
        </form>
    )    
}

export default AddRecipeForm;