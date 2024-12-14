import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../Styling/PantryView.css'

interface PantryItem {
    _id: string;
    name: string;
    amount: number | string; // Adjust based on your actual data, whether it's strictly numeric or not
    unit: string;
}

const PantryView = () => {
    const [pantryItems, setPantryItems] = useState<PantryItem[]>([]);

    useEffect(() => {
        const fetchPantryItems = async () => {
            try {
                const response = await axios.get('http://localhost:3001/api/pantry');
                setPantryItems(response.data); // Make sure the data received matches the PantryItem array
            } catch (error) {
                console.error('Error fetching pantry items: ', error);
            }
        };

        fetchPantryItems();
    }, []);

    return (
        <div className='pantry-view'>
            <h1>Pantry Items</h1>
            <Link to="/" className='back-to-home'>Back to Home</Link>
            <ul className='pantry-list'>
                {pantryItems.map((item) =>(
                    <li key={item._id}>
                        {item.amount} {item.unit} of {item.name}
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default PantryView