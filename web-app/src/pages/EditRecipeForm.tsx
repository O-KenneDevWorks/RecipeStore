import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import imageCompression from 'browser-image-compression';
import '../Styling/EditRecipeForm.css';

import { getRecipeById, updateRecipe } from '../api/recipeAPI';
import { Recipe } from '../interfaces/Recipe';
import { UnitOptions } from '../constants/options';

const EditRecipe = () => {
    const [recipe, setRecipe] = useState<Recipe>({
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
        notes: '',
    });
    const [imagePreview, setImagePreview] = useState<string>('');
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchRecipe = async () => {
          if (!id) return;
          const data = await getRecipeById(id);
          if (data) setRecipe(data);
        };
        fetchRecipe();
      }, [id]);

      useEffect(() => {
        if (recipe.image) setImagePreview(recipe.image);
      }, [recipe.image]);

      useEffect(() => {
        document
          .querySelectorAll<HTMLTextAreaElement>('textarea[name="direction"]')
          .forEach((ta) => {
            ta.style.height = 'auto';
            ta.style.height = `${ta.scrollHeight}px`;
          });
      }, [recipe]);

    const handleChange = (
        e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
      ) => {
        const { name, value } = e.target;
        setRecipe((prev) => ({ ...prev, [name]: value }));
    };

    const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
    
        try {
          const compressed = await imageCompression(file, {
            maxSizeMB: 1,
            maxWidthOrHeight: 1920,
            useWebWorker: true,
          });
    
          const reader = new FileReader();
          reader.onloadend = () => {
            const result = reader.result;
            if (typeof result === 'string') {
              setImagePreview(result);                 // live preview
              setRecipe((prev) => ({ ...prev, image: result })); // base‑64 in recipe
            }
          };
          reader.readAsDataURL(compressed);
        } catch (err) {
          console.error('Error compressing image:', err);
        }
      };

    const handleAutoSize = (e: ChangeEvent<HTMLTextAreaElement>) => {
        e.target.style.height = 'inherit';
        e.target.style.height = `${e.target.scrollHeight}px`;
    };

    const handleIngredientChange = (index: number, e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        const newIngredients = [...recipe.ingredients];
        newIngredients[index] = {...newIngredients[index], [name]: value};
        setRecipe(prev => ({ ...prev, ingredients: newIngredients }));
    };

    const handleDirectionChange = (index: number, value: string) => {
        const newDirections = [...recipe.directions];
        newDirections[index] = value;
        setRecipe(prev => ({ ...prev, directions: newDirections }));
    };

    const handleTagChange = (e: ChangeEvent<HTMLInputElement>) => {
        const tags = e.target.value.split(',').map(tag => tag.trim());
        setRecipe(prev => ({ ...prev, tags }));
    };

    const addIngredient = () => {
        setRecipe(prev => ({ ...prev, ingredients: [...prev.ingredients, { amount: '', unit: UnitOptions[0].value, name: '' }] }));
    };

    const removeIngredient = (index: number) => {
        const newIngredients = [...recipe.ingredients];
        newIngredients.splice(index, 1);
        setRecipe(prev => ({ ...prev, ingredients: newIngredients }));
    };

    const addDirection = () => {
        setRecipe(prev => ({ ...prev, directions: [...prev.directions, ''] }));
    };

    const removeDirection = (index: number) => {
        const newDirections = [...recipe.directions];
        newDirections.splice(index, 1);
        setRecipe(prev => ({ ...prev, directions: newDirections }));
    };

    const moveItem = <T,>(arr: T[], fromIndex: number, toIndex: number): T[] => {
        const item = arr[fromIndex];
        const newArr = arr.filter((_, index) => index !== fromIndex);
        newArr.splice(toIndex, 0, item);
        return newArr;
    };
    
    const moveIngredientUp = (index: number) => {
        if (index > 0) {
            const newIngredients = moveItem(recipe.ingredients, index, index - 1);
            setRecipe(prev => ({ ...prev, ingredients: newIngredients }));
        }
    };
    
    const moveIngredientDown = (index: number) => {
        if (index < recipe.ingredients.length - 1) {
            const newIngredients = moveItem(recipe.ingredients, index, index + 1);
            setRecipe(prev => ({ ...prev, ingredients: newIngredients }));
        }
    };
    
    const moveDirectionUp = (index: number) => {
        if (index > 0) {
            const newDirections = moveItem(recipe.directions, index, index - 1);
            setRecipe(prev => ({ ...prev, directions: newDirections }));
        }
    };
    
    const moveDirectionDown = (index: number) => {
        if (index < recipe.directions.length - 1) {
            const newDirections = moveItem(recipe.directions, index, index + 1);
            setRecipe(prev => ({ ...prev, directions: newDirections }));
        }
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!id) return;
    
        try {
          await updateRecipe(id, recipe);
          navigate(`/recipes/${id}`);
        } catch (err) {
          console.error('Error updating recipe:', err);
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
                {/* <label>
                    Image:
                    <input type="text" name="image" value={recipe.image} onChange={handleChange} />
                </label> */}
                <label>
                    Tags:
                    <input type="text" value={(recipe.tags ?? []).join(', ')} onChange={handleTagChange} />
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
                                {UnitOptions.map(option => (
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

                <h2>Notes:</h2>
                <div className="notes">
                    <textarea
                        name="notes"
                        value={recipe.notes}
                        onChange={handleChange}
                    />
                </div>
                <label>
                    Image
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                    />
                </label>
                {imagePreview && (
                    <img
                        src={imagePreview}
                        alt="Recipe preview"
                        className="image-preview"
                    />
                )}
                
                <div className="buttons">
                    <button type="submit">Update Recipe</button>
                </div>
            </form>
        </div>
    );
};

export default EditRecipe;
