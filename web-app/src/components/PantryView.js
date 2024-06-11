import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './Styling/PantryView.css'

const PantryView = () => {
    const [pantryItems, setPantryItem] = useState([]);

    useEffect(() => {
        const fetchPantryItems = async () => {
            try{
                const response = await axios.get('http://localhost:3000/pantry');
                setPantryItem(response.data);
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