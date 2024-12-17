import { useEffect, useState } from 'react';
import '../Styling/ViewRecipes.css';
import RecipeCard from '../components/RecipeCard';
import { getRecipes } from '../api/recipeAPI';
import { Recipe, RecipePreview } from "../interfaces/Recipe";

const ViewRecipes = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [groupedRecipes, setGroupedRecipes] = useState<Record<string, Recipe[]>>({});
  const [letters, setLetters] = useState<string[]>([]);

  // Filter State
  const [selectedTag, setSelectedTag] = useState<string>('');
  const [selectedCourse, setSelectedCourse] = useState<string>('');
  const [selectedCuisine, setSelectedCuisine] = useState<string>('');

  useEffect(() => {
    const fetchAndPrepareRecipes = async () => {
      const data = await getRecipes();
      setRecipes(data);
      applyFiltersAndGroup(data); // Initialize grouped recipes
    };

    fetchAndPrepareRecipes();
  }, []);

  // Apply Filters and Group Recipes
  const applyFiltersAndGroup = (data: Recipe[]) => {
    const filtered = data.filter((recipe) =>
      (selectedTag ? (recipe.tags ?? []).includes(selectedTag) : true) &&
      (selectedCourse ? recipe.course === selectedCourse : true) &&
      (selectedCuisine ? recipe.cuisine === selectedCuisine : true)
    );

    // Group filtered recipes alphabetically
    const grouped: Record<string, Recipe[]> = {};
    filtered.forEach((recipe) => {
      const firstLetter = recipe.name.charAt(0).toUpperCase();
      if (!grouped[firstLetter]) grouped[firstLetter] = [];
      grouped[firstLetter].push(recipe);
    });

    setGroupedRecipes(grouped);
    setLetters(Object.keys(grouped).sort());
  };

  // Handle Filter Changes
  const handleFilterChange = () => applyFiltersAndGroup(recipes);

  useEffect(() => {
    handleFilterChange();
  }, [selectedTag, selectedCourse, selectedCuisine]);

  return (
    <div className="view-recipes">
      <h1>All Recipes</h1>

      {/* Filter Controls */}
      <div className="filter-controls">
        <label>Filter by tag:</label>
        <select onChange={(e) => setSelectedTag(e.target.value)} value={selectedTag}>
          <option value="">All</option>
          {[...new Set(recipes.flatMap((recipe) => recipe.tags))].map((tag, index) => (
            <option key={index} value={tag}>{tag}</option>
          ))}
        </select>

        <label>Filter by course:</label>
        <select onChange={(e) => setSelectedCourse(e.target.value)} value={selectedCourse}>
          <option value="">All</option>
          {['Main Course', 'Side', 'Salad', 'Soup', 'Appetizer', 'Dessert', 'Breakfast'].map((course, index) => (
            <option key={index} value={course}>{course}</option>
          ))}
        </select>

        <label>Filter by cuisine:</label>
        <select onChange={(e) => setSelectedCuisine(e.target.value)} value={selectedCuisine}>
          <option value="">All</option>
          {['Italian', 'Mexican', 'Chinese', 'Indian', 'French', 'Japanese', 'American', 'Thai'].map((cuisine, index) => (
            <option key={index} value={cuisine}>{cuisine}</option>
          ))}
        </select>
      </div>

      {/* Alphabet Navigation */}
      <div className="alphabet-nav">
        {letters.map((letter) => (
          <a key={letter} href={`#${letter}`} className="letter-link">
            {letter}
          </a>
        ))}
      </div>

      {/* Grouped Recipe Sections */}
      {letters.map((letter) => (
        <div key={letter} id={letter} className="letter-section">
          <h2 className="section-title">{letter}</h2>
          <div className="recipe-grid">
            {groupedRecipes[letter].map((recipe) => (
              <RecipeCard key={recipe._id} {...(recipe as RecipePreview)} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ViewRecipes;
