// api/pantryAPI.tsx
import { PantryItem } from '../interfaces/Pantry';
import { fetchWithAuth, buildApiUrl } from '../utils/auth';

export const addPantryItem = async (pantryItem: PantryItem): Promise<PantryItem> => {
    try {
        const response = await fetchWithAuth(buildApiUrl('/api/pantry'), {
            method: 'POST',
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
        const response = await fetchWithAuth(buildApiUrl('/api/pantry'));

        if (!response.ok) {
            throw new Error('Failed to fetch pantry items');
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching pantry items: ', error);
        throw error;
    }
};