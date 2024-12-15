import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchPantryItems } from '../api/pantryAPI';
import { PantryItem } from '../interfaces/Pantry';
import '../Styling/PantryView.css';

const PantryView = () => {
    const [pantryItems, setPantryItems] = useState<PantryItem[]>([]);

    useEffect(() => {
        const loadPantryItems = async () => {
            try {
                const data = await fetchPantryItems();
                setPantryItems(data);
            } catch (error) {
                console.error('Error loading pantry items: ', error);
            }
        };

        loadPantryItems();
    }, []);

    return (
        <div className="pantry-view">
            <h1>Pantry Items</h1>
            <Link to="/" className="back-to-home">Back to Home</Link>
            <ul className="pantry-list">
                {pantryItems.map((item) => (
                    <li key={item._id}>
                        {item.amount} {item.unit} of {item.name}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default PantryView;
