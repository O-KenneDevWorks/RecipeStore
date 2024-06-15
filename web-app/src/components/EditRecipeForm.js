import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './Styling/EditRecipeForm.css';

const EditRecipe = () => {
    const [recipe, setRecipe] = useState({
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
        course: ''
    });
    const { id } = useParams();
    const navigate = useNavigate(); // Hook to navigate programmatically

    useEffect(() => {
        axios.get(`http://10.0.0.85:3000/recipes/${id}`)
            .then(response => {
                setRecipe(response.data);
            })
            .catch(error => console.error('Error fetching recipe:', error));
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setRecipe(prev => ({ ...prev, [name]: value }));
    };

    const handleIngredientChange = (index, e) => {
        const { name, value } = e.target;
        const newIngredients = [...recipe.ingredients];
        newIngredients[index][name] = value;
        setRecipe(prev => ({ ...prev, ingredients: newIngredients }));
    };

    const handleDirectionChange = (index, e) => {
        const newDirections = [...recipe.directions];
        newDirections[index] = e.target.value;
        setRecipe(prev => ({ ...prev, directions: newDirections }));
    };

    const handleTagChange = (e) => {
        const tags = e.target.value.split(',').map(tag => tag.trim());
        setRecipe(prev => ({ ...prev, tags }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.put(`http://10.0.0.85:3000/recipes/${id}`, recipe)
            .then(() => navigate(`/recipes/${id}`)) // Redirect to the recipe detail page
            .catch(error => console.error('Error updating recipe:', error));
    };

    return (
        <div className="edit-recipe-form">
            <h1>Edit Recipe</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    Name:
                    <input type="text" name="name" value={recipe.name} onChange={handleChange} required />
                </label>
                <label>
                    Course:
                    <select name="course" value={recipe.course} onChange={handleChange} required>
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
                <h2>Ingredients</h2>
                {recipe.ingredients.map((ingredient, index) => (
                    <div className="ingredient" key={index}>
                        <label>
                            Amount:
                            <input type="number" name="amount" value={ingredient.amount} onChange={(e) => handleIngredientChange(index, e)} required />
                        </label>
                        <label>
                            Unit:
                            <input type="text" name="unit" value={ingredient.unit} onChange={(e) => handleIngredientChange(index, e)} required />
                        </label>
                        <label>
                            Name:
                            <input type="text" name="name" value={ingredient.name} onChange={(e) => handleIngredientChange(index, e)} required />
                        </label>
                    </div>
                ))}
                <h2>Directions</h2>
                {recipe.directions.map((direction, index) => (
                    <label key={index}>
                        Step {index + 1}:
                        <input type="text" value={direction} onChange={(e) => handleDirectionChange(index, e)} required />
                    </label>
                ))}
                <label>
                    Prep Time:
                    <input type="text" name="prepTime" value={recipe.prepTime} onChange={handleChange} />
                </label>
                <label>
                    Cook Time:
                    <input type="text" name="cookTime" value={recipe.cookTime} onChange={handleChange} />
                </label>
                <label>
                    Total Time:
                    <input type="text" name="totalTime" value={recipe.totalTime} onChange={handleChange} />
                </label>
                <label>
                    Servings:
                    <input type="number" name="servings" value={recipe.servings} onChange={handleChange} />
                </label>
                <label>
                    Yield:
                    <input type="text" name="yield" value={recipe.yield} onChange={handleChange} />
                </label>
                <label>
                    Image:
                    <input type="text" name="image" value={recipe.image} onChange={handleChange} />
                </label>
                <label>
                    Tags:
                    <input type="text" value={recipe.tags.join(', ')} onChange={handleTagChange} />
                </label>
                <div className="buttons">
                    <button type="submit">Update Recipe</button>
                </div>
            </form>
        </div>
    );
};

export default EditRecipe;