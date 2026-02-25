import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ShoppingListItem } from '../interfaces/shoppingList'
import { UnitOptions } from '../constants/options';
import CustomSelect from './SelectElement';
import '../Styling/ShoppingList.css';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onSave: (items: ShoppingListItem[]) => Promise<void>;
    initialItems: ShoppingListItem[];
}

export default function ShoppingListModal({
    isOpen,
    onClose,
    onSave,
    initialItems,
}: Props) {
    const [items, setItems] = useState<ShoppingListItem[]>([]);
    const [newName, setNewName] = useState('');
    const [newAmt, setNewAmt] = useState('');
    const [newUnit, setNewUnit] = useState(UnitOptions[0].value);

    const addItem = () => {
        if (!newName.trim()) return;
        setItems((prev) => [...prev, { name: newName.trim(), amount: newAmt.trim() || '1', unit: newUnit }]);
        setNewName('');
        setNewAmt('');
        setNewUnit(UnitOptions[0].value);
    };

    useEffect(() => {
        if (isOpen) setItems(initialItems);
    }, [isOpen, initialItems]);

    if (!isOpen) return null;

    const removeItem = (idx: number) =>
        setItems((prev) => prev.filter((_, i) => i !== idx));

    const toggleCheck = (idx: number) =>
        setItems((prev) =>
            prev.map((it, i) => (i === idx ? { ...it, checked: !it.checked } : it)),
        );

    const handleSave = async () => {
        await onSave(items);
        onClose();
    };

    return createPortal(
        <div className="shopping-overlay" onClick={onClose}>
            <div className="shopping-modal" onClick={(e) => e.stopPropagation()}>
                <h2>Shopping List</h2>
            <div className="add-row">
                <input
                    placeholder="Item"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                />
                <input
                    placeholder="Qty"
                    type="text"
                    value={newAmt}
                    onChange={(e) => setNewAmt(e.target.value)}
                />
                <CustomSelect
                    value={newUnit}
                    onChange={setNewUnit}
                    options={UnitOptions}
                />
                <button onClick={addItem}>Add</button>
            </div>

            <div className="list-wrapper">
                {items.map((it, idx) => (
                    <div key={idx} className="list-item">
                        <input
                            type="checkbox"
                            checked={!!it.checked}
                            onChange={() => toggleCheck(idx)}
                        />
                        <span className={it.checked ? 'checked' : ''}>
                            {it.name} — {it.amount} {it.unit}
                        </span>
                        <button onClick={() => removeItem(idx)}>✕</button>
                    </div>
                ))}
            </div>

            <div className="btn-row">
                <button onClick={handleSave}>Save</button>
                <button onClick={onClose}>Close</button>
            </div>
             </div>
    </div>,
    document.body
    );
}
