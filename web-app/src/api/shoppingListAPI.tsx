import { ShoppingListItem } from '../interfaces/shoppingList';

// const BASE = '/api/shoppingList';

export async function saveShoppingList(
    items: ShoppingListItem[],
    weekKey: string,
): Promise<void> {
    const res = await fetch('/api/shoppingList', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ week: weekKey, items }),
    });
    if (!res.ok) throw new Error('Failed to save shopping list');
}

export async function fetchShoppingList(weekKey: string) {
    const res = await fetch(`/api/shoppingList?week=${encodeURIComponent(weekKey)}`);
    if (res.status === 404) return null;
    if (!res.ok) throw new Error('Failed to fetch shopping list');
    return res.json() as Promise<{ items: ShoppingListItem[] }>;
}

export async function clearShoppingList(weekKey: string): Promise<string> {
    const res = await fetch(`/api/shoppingList?week=${encodeURIComponent(weekKey)}`, {
        method: 'DELETE',
    });

    if (!res.ok) throw new Error('Failed to clear shopping list');

    const { message } = (await res.json()) as { message: string };
    return message;
}