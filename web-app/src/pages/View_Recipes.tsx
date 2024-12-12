import { useEffect, useState, ChangeEvent } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../Styling/ViewRecipes.css';

interface Recipe {
    _id: string;
    name: string;
    tags: string[];
    course: string;
    cuisine: string;
}

const ViewRecipes = () => {
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [selectedTag, setSelectedTag] = useState<string>('');
    const [selectedCourse, setSelectedCourse] = useState<string>('');
    const [selectedCuisine, setSelectedCuisine] = useState<string>('');

    useEffect(() => {
        const fetchRecipes = async () => {
            try {
                const response = await axios.get('http://localhost:3001/recipes');
                setRecipes(response.data);
            } catch (error) {
                console.error('Error fetching recipes:', error);
            }
        };

        fetchRecipes();
    }, []);

    const handleTagChange = (e: ChangeEvent<HTMLSelectElement>) => {
        setSelectedTag(e.target.value);
    };

    const handleCourseChange = (e: ChangeEvent<HTMLSelectElement>) => {
        setSelectedCourse(e.target.value);
    };

    const handleCuisineChange = (e: ChangeEvent<HTMLSelectElement>) => {
        setSelectedCuisine(e.target.value);
    };

    const filteredRecipes = recipes.filter(recipe => 
        (selectedTag ? recipe.tags.includes(selectedTag) : true) &&
        (selectedCourse ? recipe.course === selectedCourse : true) &&
        (selectedCuisine ? recipe.course === selectedCuisine : true)
    );

    const uniqueTags = [...new Set(recipes.flatMap(recipe => recipe.tags))];
    const uniqueCourses = ['Main Course', 'Side', 'Salad', 'Soup', 'Appetizer', 'Dessert', 'Breakfast'];
    const uniqueCuisine = ['Italian', 'Mexican', 'Chinese', 'Indian', 'French', 'Japanese', 'American', 'Thai'];

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
            <label>Filter by course:</label>
            <select onChange={handleCourseChange} value={selectedCourse}>
                <option value="">All</option>
                {uniqueCourses.map((course, index) => (
                    <option key={index} value={course}>{course}</option>
                ))}
            </select>
            <label>Filter by cuisine:</label>
            <select onChange={handleCuisineChange} value={selectedCuisine}>
                <option value="">All</option>
                {uniqueCuisine.map((cuisine, index) => (
                    <option key={index} value={cuisine}>{cuisine}</option>
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
