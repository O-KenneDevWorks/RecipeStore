import { useEffect, useState } from 'react';
import { startOfWeek, endOfWeek, addWeeks, format } from 'date-fns';

import { fetchShoppingList } from '../api/shoppingListAPI';
import { ShoppingListItem } from '../interfaces/shoppingList';

export default function ShoppingListPage() {
  const [items, setItems] = useState<ShoppingListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentWeekDate, setCurrentWeekDate] = useState(new Date());

    const getWeekKey = (d: Date) =>
        format(startOfWeek(d, { weekStartsOn: 1 }), "yyyy-'W'II");
    
    const weekKey = getWeekKey(currentWeekDate);

    const formatWeekRange = (date: Date): string => {
        const start = startOfWeek(date, { weekStartsOn: 1 });
        const end = endOfWeek(date, { weekStartsOn: 1 });
        return `${format(start, 'MMMM d')} - ${format(end, 'MMMM d')}`;
    };

    const getYearFromDate = (date: Date): string => {
        return format(date, 'yyyy');
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
      prev.map((it, i) => (i === idx ? { ...it, checked: !it.checked } : it)),
    );

  if (loading) return <p>Loading…</p>;

  return (
    <div className="shopping-page">
      <h1>Shopping List – {weekKey}</h1>
      <div className="week-nav">
            <button onClick={() => setCurrentWeekDate(prev => addWeeks(prev, -1))}>←</button>
            <div>
                <h3>{getYearFromDate(currentWeekDate)}</h3>
                <h2>{formatWeekRange(currentWeekDate)}</h2>
            </div>
            <button onClick={() => setCurrentWeekDate(prev => addWeeks(prev, 1))}>→</button>
        </div>

      {items.map((it, idx) => (
        <label key={idx} style={{ display: 'block', marginBottom: 6 }}>
          <input type="checkbox" checked={!!it.checked} onChange={() => toggle(idx)} />
          <span style={{ textDecoration: it.checked ? 'line-through' : undefined, marginLeft: 8 }}>
            {it.name} — {it.amount}
          </span>
        </label>
      ))}
    </div>
  );
}

// TODO: Add button that brings up a modal to add items
// Items should be appended to the current list, and if possible, sorted with existing items 
// Use the shopping list modal to generate new list