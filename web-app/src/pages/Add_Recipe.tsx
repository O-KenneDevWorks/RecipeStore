import { ChangeEvent, FormEvent, useState } from 'react';
import imageCompression from 'browser-image-compression';
import '../Styling/AddRecipeForm.css';
import { addRecipe } from "../api/recipeAPI";
import { Recipe } from "../interfaces/Recipe"
import { Ingredient } from "../interfaces/Ingredient";

interface UnitOption {
    value: string;
    label: string;
}

const unitOptions: UnitOption[] = [
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
    const [recipeData, setRecipeData] = useState<Recipe>({
        name: '',
        ingredients: [{ amount: '', unit: unitOptions[0].value, name: '' }],
        directions: [''],
        prepTime: '',
        cookTime: '',
        totalTime: '',
        servings: '',
        yield: '',
        image: '',
        tags: [],
        course: '',
    });
    const [imagePreview, setImagePreview] = useState<string>('');

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setRecipeData({ ...recipeData, [name]: value });
    };

    const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files ? e.target.files[0] : null;
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
                    const result = reader.result;
                    if (typeof result === 'string') {
                        setImagePreview(result);
                        setRecipeData({ ...recipeData, image: result });
                    }
                };
                reader.readAsDataURL(compressedFile);
            } catch (error) {
                console.error('Error compressing image:', error);
            }
        }
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const addedRecipe = await addRecipe(recipeData);
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
            ingredients: [{ amount: "", unit: unitOptions[0].value, name: "" }],
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
        });
        setImagePreview("");
    };

    const moveIngredient = (index: number, direction: 'up' | 'down'): void => {
        const newIngredients = [...recipeData.ingredients];
        if (direction === 'up' && index > 0) {
            [newIngredients[index], newIngredients[index - 1]] = [newIngredients[index - 1], newIngredients[index]];
        } else if (direction === 'down' && index < newIngredients.length - 1) {
            [newIngredients[index], newIngredients[index + 1]] = [newIngredients[index + 1], newIngredients[index]];
        }
        setRecipeData({ ...recipeData, ingredients: newIngredients });
    };

    const handleAddIngredient = () => {
        const newIngredient = {
            amount: '',
            unit: unitOptions[0].value,
            name: ''
        };
        setRecipeData(prevState => ({
            ...prevState,
            ingredients: [...prevState.ingredients, newIngredient]
        }));
    };

    const handleIngredientChange = (index: number, field: keyof Ingredient, value: string): void => {
        const newIngredients = recipeData.ingredients.map((ingredient, i) => {
            if (i === index) {
                return { ...ingredient, [field]: value };
            }
            return ingredient;
        });
        setRecipeData({ ...recipeData, ingredients: newIngredients });
    };

    const handleRemoveIngredient = (index: number): void => {
        const newIngredients = recipeData.ingredients.filter((_, i) => i !== index);
        setRecipeData({ ...recipeData, ingredients: newIngredients });
    };

    const handleAddDirection = () => {
        setRecipeData({
            ...recipeData,
            directions: [...recipeData.directions, '']
        });
    };

    const moveDirection = (index: number, direction: 'up' | 'down'): void => {
        const newDirections = [...recipeData.directions];
        if (direction === 'up' && index > 0) {
            [newDirections[index], newDirections[index - 1]] = [newDirections[index - 1], newDirections[index]];
        } else if (direction === 'down' && index < newDirections.length - 1) {
            [newDirections[index], newDirections[index + 1]] = [newDirections[index + 1], newDirections[index]];
        }
        setRecipeData({ ...recipeData, directions: newDirections });
    };

    const handleDirectionChange = (index: number, value: string): void => {
        const newDirections = recipeData.directions.map((direction, i) => {
            if (i === index) {
                return value;
            }
            return direction;
        });
        setRecipeData({ ...recipeData, directions: newDirections });
    };

    const handleRemoveDirection = (index: number): void => {
        const newDirections = recipeData.directions.filter((_, i) => i !== index);
        setRecipeData({ ...recipeData, directions: newDirections });
    };

    const handleTagChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const tags = e.target.value.split(',').map(tag => tag.trim());
        setRecipeData({ ...recipeData, tags });
    };

    return (
        <div className="add-recipe-form">
            <h1>Add Recipe</h1>
            <form onSubmit={handleSubmit} className="add-recipe-form">
                <label>
                    Name *
                    <input type="text" name="name" value={recipeData.name} onChange={handleChange} required />
                </label>
                <label>
                    Prep Time
                    <input type="text" name="prepTime" value={recipeData.prepTime} onChange={handleChange} />
                </label>
                <label>
                    Cook Time
                    <input type="text" name="cookTime" value={recipeData.cookTime} onChange={handleChange} />
                </label>
                <label>
                    Total Time
                    <input type="text" name="totalTime" value={recipeData.totalTime} onChange={handleChange} />
                </label>
                <label>
                    Servings
                    <input type="number" name="servings" value={recipeData.servings} onChange={handleChange} />
                </label>
                <label>
                    Yield
                    <input type="text" name="yield" value={recipeData.yield} onChange={handleChange} />
                </label>
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
                    value={(recipeData.tags || []).join(", ")}
                    onChange={handleTagChange}
                    placeholder="Enter tags separated by commas"
                />

                <h2>Ingredients *</h2>
                {recipeData.ingredients.map((ingredient, index) => (
                    <div key={index} className="ingredient">
                        <div>
                            <label>Amount:</label>
                            <input
                                type="text"
                                name="amount"
                                value={ingredient.amount}
                                onChange={(e) => handleIngredientChange(index, 'amount', e.target.value)}
                                placeholder="Amount"
                                required
                            />
                        </div>
                        <div>
                            <label>Unit:</label>
                            <select
                                name="unit"
                                value={ingredient.unit}
                                onChange={(e) => handleIngredientChange(index, 'unit', e.target.value)}
                                required
                            >
                                {unitOptions.map(option => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label>Name:</label>
                            <input
                                type="text"
                                name="name"
                                value={ingredient.name}
                                onChange={(e) => handleIngredientChange(index, 'name', e.target.value)}
                                placeholder="Ingredient"
                                required
                            />
                        </div>
                        <button type="button" onClick={() => moveIngredient(index, 'up')}>↑</button>
                        <button type="button" onClick={() => moveIngredient(index, 'down')}>↓</button>
                        <button type="button" onClick={() => handleRemoveIngredient(index)}>Remove</button>
                    </div>
                ))}
                <button type="button" onClick={handleAddIngredient}>Add Ingredient</button>

                <h2>Directions *</h2>
                {recipeData.directions.map((direction, index) => (
                    <div key={index} className="direction">
                        <label>Step {index + 1}</label>
                        <textarea
                            name="direction"
                            value={direction}
                            onChange={(e) => handleDirectionChange(index, e.target.value)}
                            required
                        />
                        <div className='buttons-row'>
                            <button type="button" onClick={() => moveDirection(index, 'up')}>↑</button>
                            <button type="button" onClick={() => moveDirection(index, 'down')}>↓</button>
                            <button type="button" onClick={() => handleRemoveDirection(index)}>Remove</button>
                        </div>
                    </div>
                ))}
                <button type="button" onClick={handleAddDirection}>Add Step</button>

                <label>Image</label>
                <input type="file" name="image" accept="image/*" onChange={handleImageChange} />
                {imagePreview && <img src={imagePreview} alt="Recipe Preview" className="image-preview" />}

                <button type="submit">Add Recipe</button>
            </form>
        </div>
    );
};

export default AddRecipeForm;