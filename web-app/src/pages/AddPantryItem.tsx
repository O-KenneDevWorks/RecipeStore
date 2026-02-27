import { useState, ChangeEvent, FormEvent } from 'react';
import { addPantryItem } from '../api/pantryAPI';
import { PantryItem } from '../interfaces/Pantry';
import RecipeSelect from '../components/RecipeSelect';
import { UnitOptions } from '../constants/options';

const AddPantryItem = () => {
    const [pantryItem, setPantryItem] = useState<PantryItem>({
        name: '',
        amount: '',
        unit: '',
    });

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setPantryItem({ ...pantryItem, [name]: value });
    };

    const handleUnitChange = (val: string) => {
        setPantryItem({ ...pantryItem, unit: val });
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const addedItem = await addPantryItem(pantryItem);
            console.log('Pantry item added: ', addedItem);
            setPantryItem({
                name: '',
                amount: '',
                unit: '',
            });
        } catch (error) {
            console.error('Error adding pantry item: ', error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <label>Name *</label>
            <input
                type="text"
                name="name"
                value={pantryItem.name}
                onChange={handleChange}
                required
            />

            <label>Amount *</label>
            <input
                type="number"
                step="0.1"
                name="amount"
                value={pantryItem.amount}
                onChange={handleChange}
                required
            />

            <label>Unit *</label>
            <RecipeSelect
                value={pantryItem.unit}
                onChange={handleUnitChange}
                placeholder="Select Unit"
                options={UnitOptions}
            />

            <button type="submit">Add Pantry Item</button>
        </form>
    );
};

export default AddPantryItem;
