import { useEffect, useState } from 'react';
import { startOfWeek, endOfWeek, addWeeks, format } from 'date-fns';

import { fetchShoppingList, saveShoppingList, clearShoppingList } from '../api/shoppingListAPI';
import { ShoppingListItem } from '../interfaces/shoppingList';
import ShoppingListModal from '../components/ShoppingList';

import '../Styling/ShoppingListPage.css'

export default function ShoppingListPage() {
    const [items, setItems] = useState<ShoppingListItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentWeekDate, setCurrentWeekDate] = useState(new Date());
    const [isModalOpen, setIsModalOpen] = useState(false);

    const getWeekKey = (d: Date) =>
        format(startOfWeek(d, { weekStartsOn: 1 }), "yyyy-'W'II");

    const weekKey = getWeekKey(currentWeekDate);

    const mergeAndSort = (list: ShoppingListItem[]) => {
        const map = new Map<string, ShoppingListItem>();
        list.forEach((it) => {
            const key = `${it.name.toLowerCase()}|${it.unit.toLowerCase()}`;
            if (map.has(key)) {
                const existing = map.get(key)!;
                existing.amount = existing.amount ? `${existing.amount} + ${it.amount}` : it.amount;
            } else {
                map.set(key, { ...it });
            }
        });
        return Array.from(map.values()).sort((a, b) =>
            a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }),
        );
    };

    useEffect(() => {
        setLoading(true);
        fetchShoppingList(weekKey).then((data) => {
            setItems(data?.items ?? []);
            setLoading(false);
        });
    }, [weekKey]);

    const toggle = (idx: number) =>
        setItems((prev) =>
            prev.map((it, i) =>
                i === idx ? { ...it, checked: !it.checked } : it,
            ),
        );
    const handleSaveFromModal = async (updated: ShoppingListItem[]) => {
        const merged = mergeAndSort(updated);
        setItems(merged);
        await saveShoppingList(merged, weekKey);
    };
    if (loading) return <p>Loading…</p>;

    return (
        <div className="shopping-shell">
            <h1>Shopping List – {weekKey}</h1>

            {/* ---- week selector ---- */}
            <div className="week-nav">
                <button onClick={() => setCurrentWeekDate((d) => addWeeks(d, -1))}>←</button>

                <div style={{ textAlign: 'center' }}>
                    <h3>{format(currentWeekDate, 'yyyy')}</h3>
                    <h2>
                        {format(startOfWeek(currentWeekDate, { weekStartsOn: 1 }), 'MMM d')} –{' '}
                        {format(endOfWeek(currentWeekDate, { weekStartsOn: 1 }), 'MMM d')}
                    </h2>
                </div>

                <button onClick={() => setCurrentWeekDate((d) => addWeeks(d, 1))}>→</button>
            </div>

            {/* ---- action buttons ---- */}
            <div className="action-row">
                <button onClick={() => setIsModalOpen(true)}>＋ Add / Edit items</button>

                <button
                    onClick={async () => {
                        if (!confirm('Clear this week’s shopping list?')) return;
                        try {
                            const msg = await clearShoppingList(weekKey);
                            setItems([]);
                            alert(msg);
                        } catch (err: any) {
                            alert(err.message ?? 'Could not clear list');
                        }
                    }}
                    style={{ color: 'red' }}
                >
                    Clear list
                </button>
            </div>

            {/* ---- list ---- */}
            {items.length > 0 && (
                <div className="shopping-list">
                    {items.map((it, idx) => (
                        <label key={idx}>
                            <input
                                type="checkbox"
                                checked={!!it.checked}
                                onChange={() => toggle(idx)}
                            />
                            <span
                                style={{
                                    textDecoration: it.checked ? 'line-through' : undefined,
                                    marginLeft: 8,
                                }}
                            >
                                {it.name} — {it.amount} {it.unit}
                            </span>
                        </label>
                    ))}
                </div>
            )}

            {/* modal stays unchanged */}
            <ShoppingListModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveFromModal}
                initialItems={items}
            />
        </div>
    );
}
