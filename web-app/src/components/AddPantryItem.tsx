import React, { useState } from 'react';
import axios from 'axios';

const AddPantryItem = () => {
    const [pantryItem, setPantryItem] = useState({
        name: '',
        amount: '',
        unit: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPantryItem({ ...pantryItem, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://10.0.0.85:3000/pantry', pantryItem);
            console.log('Pantry item added: ', response.data);
            // Clear form after successful submission
            setPantryItem({
                name: '',
                amount: '',
                unit: ''
            });
        } catch (error) {
            console.error('Error adding pantry item: ', error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <label>Name *</label>
            <input type="text" name="name" value={pantryItem.name} onChange={handleChange} required />

            <label>Amount *</label>
            <input type='number' step="0.1" name='amount' value={pantryItem.amount} onChange={handleChange} required />

            <label>Unit *</label>
            <select name='unit' value={pantryItem.unit} onChange={handleChange} required>
                <option value="" disabled>Select Unit</option>
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