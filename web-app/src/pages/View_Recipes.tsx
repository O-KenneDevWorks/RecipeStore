import { useEffect, useState } from 'react';
import '../Styling/ViewRecipes.css';
import { Recipe } from "../interfaces/Recipe"
import RecipeCard from '../components/RecipeCard';
import { RecipePreview } from '../interfaces/Recipe';
import { getRecipes } from '../api/recipeAPI';
import { COURSE_OPTIONS, CUISINE_OPTIONS } from "../constants/options";
import RecipeSelect from '../components/RecipeSelect';

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

  const handleTagChange = (val: string) => setSelectedTag(val === '__all__' ? '' : val);
  const handleCourseChange = (val: string) => setSelectedCourse(val === '__all__' ? '' : val);
  const handleCuisineChange = (val: string) => setSelectedCuisine(val === '__all__' ? '' : val);

  const filteredRecipes = recipes.filter(
    (recipe) =>
      (selectedTag ? (recipe.tags ?? []).includes(selectedTag) : true) &&
      (selectedCourse ? recipe.course === selectedCourse : true) &&
      (selectedCuisine ? recipe.cuisine === selectedCuisine : true)
  );

  return (
    <div className="view-recipes">
      <h1>All Recipes</h1>

      {/* Filter Controls */}
      <div className="filter-controls">
        <div>
          <label>Filter by tag:</label>
          <RecipeSelect
            value={selectedTag || '__all__'}
            onChange={handleTagChange}
            placeholder="All"
            options={[
              { value: '__all__', label: 'All' },
              ...[...new Set(recipes.flatMap((recipe) => recipe.tags))].filter((tag): tag is string => !!tag).map((tag) => ({ value: tag, label: tag })),
            ]}
          />
        </div>

        <div>
          <label>Filter by course:</label>
          <RecipeSelect
            value={selectedCourse || '__all__'}
            onChange={handleCourseChange}
            placeholder="All"
            options={[
              { value: '__all__', label: 'All' },
              ...COURSE_OPTIONS.map((c) => ({ value: c, label: c })),
            ]}
          />
        </div>

        <div>
          <label>Filter by cuisine:</label>
          <RecipeSelect
            value={selectedCuisine || '__all__'}
            onChange={handleCuisineChange}
            placeholder="All"
            options={[
              { value: '__all__', label: 'All' },
              ...CUISINE_OPTIONS.map((c) => ({ value: c, label: c })),
            ]}
          />
        </div>
      </div>

      {/* Grid of Recipe Cards */}
      <div className="recipe-grid">
        {filteredRecipes
          .sort((a, b) => a.name.localeCompare(b.name)) // Sort alphabetically by 'name'
          .map((recipe) => (
            <RecipeCard key={recipe._id} {...(recipe as RecipePreview)} />
          ))}
      </div>
    </div>
  );
};

export default ViewRecipes;
