import { ChangeEvent, FormEvent, useState } from 'react';
import imageCompression from 'browser-image-compression';
import '../Styling/AddRecipeForm.css';
import { addRecipe } from "../api/recipeAPI";
import { Recipe } from "../interfaces/Recipe"
import { IngredientSection, DirectionSection } from "../interfaces/Ingredient";
import { COURSE_OPTIONS, CUISINE_OPTIONS, UnitOptions} from "../constants/options";
import TagInput from "../components/TagInput";

const defaultIngredientSection = (): IngredientSection => ({
    title: '',
    items: [{ amount: '', unit: UnitOptions[0].value, name: '' }],
});

const defaultDirectionSection = (): DirectionSection => ({
    title: '',
    steps: [''],
});

const AddRecipeForm = () => {
    const [recipeData, setRecipeData] = useState<Recipe>({
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

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setRecipeData({ ...recipeData, [name]: value });
    };

    const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files ? e.target.files[0] : null;
        if (file) {
            const options = { maxSizeMB: 1, maxWidthOrHeight: 1920, useWebWorker: true };
            try {
                const compressedFile = await imageCompression(file, options);
                const reader = new FileReader();
                reader.onloadend = () => {
                    const result = reader.result;
                    if (typeof result === 'string') {
                        setImagePreview(result);
                        setRecipeData(prev => ({ ...prev, image: result }));
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
            name: '',
            ingredients: [defaultIngredientSection()],
            directions: [defaultDirectionSection()],
            prepTime: '', cookTime: '', totalTime: '',
            servings: '', yield: '', image: '',
            tags: [], course: '', cuisine: '', notes: '',
        });
        setImagePreview('');
    };

    // ── Ingredient section helpers ──────────────────────────────────────────

    const updateIngredients = (fn: (sections: IngredientSection[]) => IngredientSection[]) => {
        setRecipeData(prev => ({ ...prev, ingredients: fn([...prev.ingredients]) }));
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
        setRecipeData(prev => ({ ...prev, directions: fn([...prev.directions]) }));
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

    const multiSection = recipeData.ingredients.length > 1;

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
                        {COURSE_OPTIONS.map((course) => (
                            <option key={course} value={course}>{course}</option>
                        ))}
                    </select>
                </label>
                <label>
                    Cuisine:
                    <select name="cuisine" value={recipeData.cuisine} onChange={handleChange} required>
                        <option value="">Select Cuisine</option>
                        {CUISINE_OPTIONS.map((cuisine) => (
                            <option key={cuisine} value={cuisine}>{cuisine}</option>
                        ))}
                    </select>
                </label>

                <TagInput recipeData={recipeData} setRecipeData={setRecipeData} />

                {/* ── Ingredients ── */}
                <h2>Ingredients *</h2>
                {recipeData.ingredients.map((section, si) => (
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
                                {recipeData.ingredients.length > 1 && (
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
                                        placeholder="Amount"
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
                                        placeholder="Ingredient"
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
                <h2>Directions *</h2>
                {recipeData.directions.map((section, si) => (
                    <div key={si} className="direction-section">
                        {(recipeData.directions.length > 1 || section.title !== '') && (
                            <div className="section-title-row">
                                <input
                                    type="text"
                                    className="section-title-input"
                                    placeholder="Section title (e.g. Prep, Assembly)"
                                    value={section.title}
                                    onChange={(e) => handleDirectionSectionTitle(si, e.target.value)}
                                />
                                {recipeData.directions.length > 1 && (
                                    <button type="button" className="remove-section-btn" onClick={() => handleRemoveDirectionSection(si)}>
                                        Remove Section
                                    </button>
                                )}
                            </div>
                        )}
                        {section.steps.map((step, di) => (
                            <div key={di} className="direction">
                                <label>Step {di + 1}</label>
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
                    <textarea name="notes" value={recipeData.notes} onChange={handleChange} />
                </div>

                <label>Image</label>
                <input type="file" name="image" accept="image/*" onChange={handleImageChange} />
                {imagePreview && <img src={imagePreview} alt="Recipe Preview" className="image-preview" />}

                <button type="submit">Add Recipe</button>
            </form>
        </div>
    );
};

export default AddRecipeForm;
