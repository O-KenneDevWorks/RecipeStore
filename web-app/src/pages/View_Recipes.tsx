import { useEffect, useState, ChangeEvent } from 'react';
import '../Styling/ViewRecipes.css';
import { Recipe } from "../interfaces/Recipe"
import RecipeCard from '../components/RecipeCard';
import { RecipePreview } from '../interfaces/Recipe';
import { getRecipes } from '../api/recipeAPI';

const ViewRecipes = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [selectedTag, setSelectedTag] = useState<string>('');
  const [selectedCourse, setSelectedCourse] = useState<string>('');
  const [selectedCuisine, setSelectedCuisine] = useState<string>('');

  useEffect(() => {
    const fetchRecipes = async () => {
      const data = await getRecipes();
      
      setRecipes(data);
    };

    fetchRecipes();
  }, []);

  const handleTagChange = (e: ChangeEvent<HTMLSelectElement>) => setSelectedTag(e.target.value);
  const handleCourseChange = (e: ChangeEvent<HTMLSelectElement>) => setSelectedCourse(e.target.value);
  const handleCuisineChange = (e: ChangeEvent<HTMLSelectElement>) => setSelectedCuisine(e.target.value);

  const filteredRecipes = recipes.filter(
    (recipe) =>
      (selectedTag ? (recipe.tags ?? []).includes(selectedTag) : true) &&
      (selectedCourse ? recipe.course === selectedCourse : true) &&
      (selectedCuisine ? recipe.cuisine === selectedCuisine : true)
  );

  // const uniqueTags = [...new Set(recipes.flatMap((recipe) => recipe.tags))];
  // const uniqueCourses = [
  //   'Main Course',
  //   'Side',
  //   'Salad',
  //   'Soup',
  //   'Appetizer',
  //   'Dessert',
  //   'Breakfast',
  // ];
  // const uniqueCuisine = [
  //   'Italian',
  //   'Mexican',
  //   'Chinese',
  //   'Indian',
  //   'French',
  //   'Japanese',
  //   'American',
  //   'Thai',
  // ];

  return (
    <div className="view-recipes">
      <h1>All Recipes</h1>

      {/* Filter Controls */}
      <div className="filter-controls">
        <label>Filter by tag:</label>
        <select onChange={handleTagChange} value={selectedTag}>
          <option value="">All</option>
          {/* Dynamic tag options */}
          {[...new Set(recipes.flatMap((recipe) => recipe.tags))].map((tag, index) => (
            <option key={index} value={tag}>{tag}</option>
          ))}
        </select>

        <label>Filter by course:</label>
        <select onChange={handleCourseChange} value={selectedCourse}>
          <option value="">All</option>
          {['Main Course', 'Side', 'Salad', 'Soup', 'Appetizer', 'Dessert', 'Breakfast'].map((course, index) => (
            <option key={index} value={course}>{course}</option>
          ))}
        </select>

        <label>Filter by cuisine:</label>
        <select onChange={handleCuisineChange} value={selectedCuisine}>
          <option value="">All</option>
          {['Italian', 'Mexican', 'Chinese', 'Indian', 'French', 'Japanese', 'American', 'Thai'].map((cuisine, index) => (
            <option key={index} value={cuisine}>{cuisine}</option>
          ))}
        </select>
      </div>

      {/* Grid of Recipe Cards */}
      <div className="recipe-grid">
        {filteredRecipes.map((recipe) => (
          <RecipeCard {...(recipe as RecipePreview)} />
        ))}
      </div>
    </div>
  );
};

export default ViewRecipes;
