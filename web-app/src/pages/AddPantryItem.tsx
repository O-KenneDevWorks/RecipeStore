import { useState, ChangeEvent, FormEvent } from 'react';
import { addPantryItem } from '../api/pantryAPI';
import { PantryItem } from '../interfaces/Pantry';

const AddPantryItem = () => {
    const [pantryItem, setPantryItem] = useState<PantryItem>({
        name: '',
        amount: '',
        unit: '',
    });

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setPantryItem({ ...pantryItem, [name]: value });
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
            <select
                name="unit"
                value={pantryItem.unit}
                onChange={handleChange}
                required
            >
                <option value="" disabled>
                    Select Unit
                </option>
                <option value="cup">Cup</option>
                <option value="tablespoon">Tablespoon</option>
                <option value="teaspoon">Teaspoon</option>
                <option value="ounce">Ounce</option>
                <option value="pound">Pound</option>
            </select>

            <button type="submit">Add Pantry Item</button>
        </form>
    );
};

export default AddPantryItem;
