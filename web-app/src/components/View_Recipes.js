import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './Styling/ViewRecipes.css';

const ViewRecipes = () => {
    const [recipes, setRecipes] = useState([]);
    const [selectedTag, setSelectedTag] = useState('');

    useEffect(() => {
        const fetchRecipes = async () => {
            try {
                const response = await axios.get('http://10.0.0.85:3000/recipes');
                setRecipes(response.data);
            } catch (error) {
                console.error('Error fetching recipes:', error);
            }
        };

        fetchRecipes();
    }, []);

    const handleTagChange = (e) => {
        setSelectedTag(e.target.value);
    };

    const filteredRecipes = selectedTag
        ? recipes.filter(recipe => recipe.tags.includes(selectedTag))
        : recipes;

    const uniqueTags = [...new Set(recipes.flatMap(recipe => recipe.tags))];

    return (
        <div className="view-recipes">
            <h1>All Recipes</h1>
            <label>Filter by tag:</label>
            <select onChange={handleTagChange} value={selectedTag}>
                <option value="">All</option>
                {uniqueTags.map((tag, index) => (
                    <option key={index} value={tag}>{tag}</option>
                ))}
            </select>
            <ul>
                {filteredRecipes.map((recipe) => (
                    <li key={recipe._id}>
                        <Link to={`/recipes/${recipe._id}`}>{recipe.name}</Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ViewRecipes;
