// api/pantryAPI.tsx
import { PantryItem } from '../interfaces/Pantry';

export const addPantryItem = async (pantryItem: PantryItem): Promise<PantryItem> => {
    try {
        const response = await fetch('/api/pantry', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(pantryItem),
        });

        if (!response.ok) {
            throw new Error('Failed to add pantry item');
        }

        return await response.json();
    } catch (error) {
        console.error('Error adding pantry item: ', error);
        throw error;
    }
};

export const fetchPantryItems = async (): Promise<PantryItem[]> => {
    try {
        const response = await fetch('/api/pantry', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch pantry items');
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching pantry items: ', error);
        throw error;
    }
};