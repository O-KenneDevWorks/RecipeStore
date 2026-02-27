import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import imageCompression from 'browser-image-compression';
import '../Styling/EditRecipeForm.css';

import { getRecipeById, updateRecipe } from '../api/recipeAPI';
import { Recipe } from '../interfaces/Recipe';
import { IngredientSection, DirectionSection } from '../interfaces/Ingredient';
import { UnitOptions, COURSE_OPTIONS, CUISINE_OPTIONS } from '../constants/options';
import TagInput from '../components/TagInput';

const defaultIngredientSection = (): IngredientSection => ({
    title: '',
    items: [{ amount: '', unit: UnitOptions[0].value, name: '' }],
});

const defaultDirectionSection = (): DirectionSection => ({
    title: '',
    steps: [''],
});

const EditRecipe = () => {
    const [recipe, setRecipe] = useState<Recipe>({
        _id: '',
        name: '',
        ingredients: [defaultIngredientSection()],
        directions: [defaultDirectionSection()],
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

    const handleChange = (
        e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setRecipe(prev => ({ ...prev, [name]: value }));
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
                    setImagePreview(result);
                    setRecipe(prev => ({ ...prev, image: result }));
                }
            };
            reader.readAsDataURL(compressed);
        } catch (err) {
            console.error('Error compressing image:', err);
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

    // ── Ingredient section helpers ──────────────────────────────────────────

    const updateIngredients = (fn: (sections: IngredientSection[]) => IngredientSection[]) => {
        setRecipe(prev => ({ ...prev, ingredients: fn([...prev.ingredients]) }));
    };

    const handleIngredientSectionTitle = (si: number, value: string) =>
        updateIngredients(s => { s[si] = { ...s[si], title: value }; return s; });

    const handleIngredientChange = (si: number, ii: number, field: string, value: string) =>
        updateIngredients(s => {
            const items = [...s[si].items];
            items[ii] = { ...items[ii], [field]: value };
            s[si] = { ...s[si], items };
            return s;
        });

    const handleAddIngredient = (si: number) =>
        updateIngredients(s => {
            s[si] = { ...s[si], items: [...s[si].items, { amount: '', unit: UnitOptions[0].value, name: '' }] };
            return s;
        });

    const handleRemoveIngredient = (si: number, ii: number) =>
        updateIngredients(s => {
            s[si] = { ...s[si], items: s[si].items.filter((_, i) => i !== ii) };
            return s;
        });

    const moveIngredient = (si: number, ii: number, dir: 'up' | 'down') =>
        updateIngredients(s => {
            const items = [...s[si].items];
            const to = dir === 'up' ? ii - 1 : ii + 1;
            if (to < 0 || to >= items.length) return s;
            [items[ii], items[to]] = [items[to], items[ii]];
            s[si] = { ...s[si], items };
            return s;
        });

    const handleAddIngredientSection = () =>
        updateIngredients(s => [...s, defaultIngredientSection()]);

    const handleRemoveIngredientSection = (si: number) =>
        updateIngredients(s => s.filter((_, i) => i !== si));

    // ── Direction section helpers ───────────────────────────────────────────

    const updateDirections = (fn: (sections: DirectionSection[]) => DirectionSection[]) => {
        setRecipe(prev => ({ ...prev, directions: fn([...prev.directions]) }));
    };

    const handleDirectionSectionTitle = (si: number, value: string) =>
        updateDirections(s => { s[si] = { ...s[si], title: value }; return s; });

    const handleDirectionChange = (si: number, di: number, value: string) =>
        updateDirections(s => {
            const steps = [...s[si].steps];
            steps[di] = value;
            s[si] = { ...s[si], steps };
            return s;
        });

    const handleAddStep = (si: number) =>
        updateDirections(s => {
            s[si] = { ...s[si], steps: [...s[si].steps, ''] };
            return s;
        });

    const handleRemoveStep = (si: number, di: number) =>
        updateDirections(s => {
            s[si] = { ...s[si], steps: s[si].steps.filter((_, i) => i !== di) };
            return s;
        });

    const moveStep = (si: number, di: number, dir: 'up' | 'down') =>
        updateDirections(s => {
            const steps = [...s[si].steps];
            const to = dir === 'up' ? di - 1 : di + 1;
            if (to < 0 || to >= steps.length) return s;
            [steps[di], steps[to]] = [steps[to], steps[di]];
            s[si] = { ...s[si], steps };
            return s;
        });

    const handleAddDirectionSection = () =>
        updateDirections(s => [...s, defaultDirectionSection()]);

    const handleRemoveDirectionSection = (si: number) =>
        updateDirections(s => s.filter((_, i) => i !== si));

    // ── Render ──────────────────────────────────────────────────────────────

    const multiSection = recipe.ingredients.length > 1;

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
                <TagInput recipeData={recipe} setRecipeData={setRecipe} />
                <label>
                    Course:
                    <select name="course" value={recipe.course} onChange={handleChange} required>
                        <option value="">Select Course</option>
                        {COURSE_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                </label>
                <label>
                    Cuisine:
                    <select name="cuisine" value={recipe.cuisine} onChange={handleChange} required>
                        <option value="">Select Cuisine</option>
                        {CUISINE_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                </label>

                {/* ── Ingredients ── */}
                <h2>Ingredients</h2>
                {recipe.ingredients.map((section, si) => (
                    <div key={si} className="ingredient-section">
                        {(multiSection || section.title !== '') && (
                            <div className="section-title-row">
                                <input
                                    type="text"
                                    className="section-title-input"
                                    placeholder="Section title (e.g. Batter, Frosting)"
                                    value={section.title}
                                    onChange={(e) => handleIngredientSectionTitle(si, e.target.value)}
                                />
                                {recipe.ingredients.length > 1 && (
                                    <button type="button" className="remove-section-btn" onClick={() => handleRemoveIngredientSection(si)}>
                                        Remove Section
                                    </button>
                                )}
                            </div>
                        )}
                        {section.items.map((ingredient, ii) => (
                            <div key={ii} className="ingredient">
                                <div>
                                    <label>Amount:</label>
                                    <input
                                        type="text"
                                        value={ingredient.amount}
                                        onChange={(e) => handleIngredientChange(si, ii, 'amount', e.target.value)}
                                        required
                                    />
                                </div>
                                <div>
                                    <label>Unit:</label>
                                    <select
                                        value={ingredient.unit}
                                        onChange={(e) => handleIngredientChange(si, ii, 'unit', e.target.value)}
                                        required
                                    >
                                        {UnitOptions.map(opt => (
                                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label>Name:</label>
                                    <input
                                        type="text"
                                        value={ingredient.name}
                                        onChange={(e) => handleIngredientChange(si, ii, 'name', e.target.value)}
                                        required
                                    />
                                </div>
                                <button type="button" onClick={() => moveIngredient(si, ii, 'up')}>↑</button>
                                <button type="button" onClick={() => moveIngredient(si, ii, 'down')}>↓</button>
                                <button type="button" onClick={() => handleRemoveIngredient(si, ii)}>Remove</button>
                            </div>
                        ))}
                        <button type="button" onClick={() => handleAddIngredient(si)}>Add Ingredient</button>
                    </div>
                ))}
                <button type="button" className="add-section-btn" onClick={handleAddIngredientSection}>
                    + Add Subsection
                </button>

                {/* ── Directions ── */}
                <h2>Directions</h2>
                {recipe.directions.map((section, si) => (
                    <div key={si} className="direction-section">
                        {(recipe.directions.length > 1 || section.title !== '') && (
                            <div className="section-title-row">
                                <input
                                    type="text"
                                    className="section-title-input"
                                    placeholder="Section title (e.g. Prep, Assembly)"
                                    value={section.title}
                                    onChange={(e) => handleDirectionSectionTitle(si, e.target.value)}
                                />
                                {recipe.directions.length > 1 && (
                                    <button type="button" className="remove-section-btn" onClick={() => handleRemoveDirectionSection(si)}>
                                        Remove Section
                                    </button>
                                )}
                            </div>
                        )}
                        {section.steps.map((step, di) => (
                            <div key={di} className="direction">
                                <label>Step {di + 1}:</label>
                                <textarea
                                    value={step}
                                    onChange={(e) => handleDirectionChange(si, di, e.target.value)}
                                    required
                                />
                                <div className="buttons-row">
                                    <button type="button" onClick={() => moveStep(si, di, 'up')}>↑</button>
                                    <button type="button" onClick={() => moveStep(si, di, 'down')}>↓</button>
                                    <button type="button" onClick={() => handleRemoveStep(si, di)}>Remove</button>
                                </div>
                            </div>
                        ))}
                        <button type="button" onClick={() => handleAddStep(si)}>Add Step</button>
                    </div>
                ))}
                <button type="button" className="add-section-btn" onClick={handleAddDirectionSection}>
                    + Add Subsection
                </button>

                <h2>Notes:</h2>
                <div className="notes">
                    <textarea name="notes" value={recipe.notes} onChange={handleChange} />
                </div>

                <label>
                    Image
                    <input type="file" accept="image/*" onChange={handleImageChange} />
                </label>
                {imagePreview && (
                    <img src={imagePreview} alt="Recipe preview" className="image-preview" />
                )}

                <div className="buttons">
                    <button type="submit">Update Recipe</button>
                </div>
            </form>
        </div>
    );
};

export default EditRecipe;
