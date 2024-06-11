import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
    const [recipes, setRecipes] = useState([]);
    const [name, setName] = useState('');

    useEffect(() => {
        axios.get('http://localhost:3000/recipes').then(response => {
            setRecipes(response.datat);
        });
    }, []);

    const addRecipe = () => {
        axios.post('http://localhost:3000/recipes', { name, description} ).then(response => {
            setRecipes([...recipes, response.data]);
            setName('');
            StreamDescription('');
        });
    };

    return (
        <div>
            <h1>Recipes</h1>
            <input value={name} onChange={e => setName(e.target.value)} placeholder="Name" />
            <input value={description} onChange={e => setDescription(e.target.value)} placeholder="Description" />
            <button onClick={addRecipe}>Add Recipe</button>
            <ul>
                {recipes.map(recipe => (
                    <li key={recipe._id}>{recipe.name}: {recipe.description}</li>
                ))}
            </ul>
        </div>
    )
}

export default App;