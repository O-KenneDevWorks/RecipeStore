import { useState, useEffect } from 'react';
import ReactModal from 'react-modal';
import { ShoppingListItem } from '../interfaces/shoppingList'
import { UnitOptions } from '../constants/options';
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
        setItems((prev) => [...prev, { name: newName.trim(), amount: Number(newAmt) || 1, unit: newUnit }]);
        setNewName('');
        setNewAmt('');
        setNewUnit('');
    };

    useEffect(() => {
        if (isOpen) setItems(initialItems);
    }, [isOpen, initialItems]);

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

    return (
        <ReactModal
            isOpen={isOpen}
            onRequestClose={onClose}
            contentLabel="Shopping List"
            className="shopping-modal"
            overlayClassName="shopping-overlay"
            ariaHideApp={false}
        >
            <h2>Shopping List</h2>

            <div className="add-row">
                <input
                    placeholder="Item"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                />
                <input
                    placeholder="Qty"
                    type="number"
                    min={1}
                    value={newAmt}
                    onChange={(e) => setNewAmt(e.target.value)}
                />
                <select value={newUnit} onChange={(e) => setNewUnit(e.target.value)}>
                    {UnitOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
                </select>
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
        </ReactModal>
    );
}
