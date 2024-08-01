import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import imageCompression from 'browser-image-compression';
import './Styling/EditRecipeForm.css';

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
    const [imagePreview, setImagePreview] = useState('');

    useEffect(() => {
        axios.get(`http://10.0.0.85:3000/recipes/${id}`)
            .then(response => {
                setRecipe(response.data);
            })
            .catch(error => console.error('Error fetching recipe:', error));
    }, [id]);

    useEffect(() => {
        document.querySelectorAll('textarea[name="direction"]').forEach(textarea => {
            textarea.style.height = "auto"; // Reset the height
            textarea.style.height = `${textarea.scrollHeight}px`; // Set the height to scroll height
        });
    }, [recipe]); // This effect should re-run every time the recipe data changes

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
                    setRecipe({ ...recipe, image: reader.result });
                };
                reader.readAsDataURL(compressedFile);
            } catch (error) {
                console.error('Error compressing image:', error);
            }
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setRecipe(prev => ({ ...prev, [name]: value }));
    };

    const handleAutoSize = (e) => {
        e.target.style.height = 'inherit'; // Reset the height so the calculation is correct
        e.target.style.height = `${e.target.scrollHeight}px`; // Set the height to scroll height
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

    const addIngredient = () => {
        setRecipe(prev => ({ ...prev, ingredients: [...prev.ingredients, { amount: '', unit: '', name: '' }] }));
    };

    const removeIngredient = (index) => {
        const newIngredients = [...recipe.ingredients];
        newIngredients.splice(index, 1);
        setRecipe(prev => ({ ...prev, ingredients: newIngredients }));
    };

    const addDirection = () => {
        setRecipe(prev => ({ ...prev, directions: [...prev.directions, ''] }));
    };

    const removeDirection = (index) => {
        const newDirections = [...recipe.directions];
        newDirections.splice(index, 1);
        setRecipe(prev => ({ ...prev, directions: newDirections }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.put(`http://10.0.0.85:3000/recipes/${id}`, recipe)
            .then(() => navigate(`/recipes/${id}`)) // Redirect to the recipe detail page
            .catch(error => console.error('Error updating recipe:', error));
    };

    const moveItem = (arr, fromIndex, toIndex) => {
        const item = arr[fromIndex];
        const newArr = arr.filter((_, index) => index !== fromIndex);
        newArr.splice(toIndex, 0, item);
        return newArr;
    };
    
    const moveIngredientUp = (index) => {
        if (index > 0) {
            const newIngredients = moveItem(recipe.ingredients, index, index - 1);
            setRecipe(prev => ({ ...prev, ingredients: newIngredients }));
        }
    };
    
    const moveIngredientDown = (index) => {
        if (index < recipe.ingredients.length - 1) {
            const newIngredients = moveItem(recipe.ingredients, index, index + 1);
            setRecipe(prev => ({ ...prev, ingredients: newIngredients }));
        }
    };
    
    const moveDirectionUp = (index) => {
        if (index > 0) {
            const newDirections = moveItem(recipe.directions, index, index - 1);
            setRecipe(prev => ({ ...prev, directions: newDirections }));
        }
    };
    
    const moveDirectionDown = (index) => {
        if (index < recipe.directions.length - 1) {
            const newDirections = moveItem(recipe.directions, index, index + 1);
            setRecipe(prev => ({ ...prev, directions: newDirections }));
        }
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
                <label>Image</label>
                <input type="file" name="image" accept="image/*" onChange={handleImageChange} />
                {imagePreview && <img src={imagePreview} alt="Recipe Preview" className="image-preview" />}
                <label>
                    Tags:
                    <input type="text" value={recipe.tags.join(', ')} onChange={handleTagChange} />
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
                <label>
                Cuisine:
                <select name="cuisine" value={recipe.cuisine} onChange={handleChange} required>
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

                <h2>Ingredients</h2>
                {recipe.ingredients.map((ingredient, index) => (
                    <div className="ingredient" key={index}>
                        <div>
                            <label>Amount:</label>
                            <input type="text" name="amount" value={ingredient.amount} onChange={(e) => handleIngredientChange(index, e)} required />
                        </div>
                        <div>
                            <label>Unit:</label>
                            <select name="unit" value={ingredient.unit} onChange={(e) => handleIngredientChange(index, e)} required>
                                {unitOptions.map(option => (
                                    <option key={option.value} value={option.value}>{option.label}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label>Name:</label>
                            <input type="text" name="name" value={ingredient.name} onChange={(e) => handleIngredientChange(index, e)} required />
                        </div>
                        <button type="button" onClick={() => moveIngredientUp(index)}>Up</button>
                        <button type="button" onClick={() => moveIngredientDown(index)}>Down</button>
                        <button type="button" onClick={() => removeIngredient(index)}>Remove</button>
                    </div>
                ))}
                <button type="button" onClick={addIngredient}>Add Ingredient</button>

                <h2>Directions</h2>
                {recipe.directions.map((direction, index) => (
                    <div className="direction" key={index}>
                        <label>Step {index + 1}:</label>
                        <textarea
                            name="direction"
                            value={direction}
                            onChange={(e) => {
                                handleDirectionChange(index, e.target.value);
                                handleAutoSize(e);
                            }}
                            required
                        />
                        <div className="buttons-row">
                            <button type="button" onClick={() => moveDirectionUp(index)}>Up</button>
                            <button type="button" onClick={() => moveDirectionDown(index)}>Down</button>
                            <button type="button" onClick={() => removeDirection(index)}>Remove</button>
                        </div>
                    </div>
                ))}
                <button type="button" onClick={addDirection}>Add Direction</button>
                
                <div className="buttons">
                    <button type="submit">Update Recipe</button>
                </div>
            </form>
        </div>
    );
};

export default EditRecipe;
