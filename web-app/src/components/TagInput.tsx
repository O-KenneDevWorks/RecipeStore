import React, { useState, useEffect } from 'react';
import { SUGGESTED_TAGS } from '../constants/options';
import { getRecipes } from '../api/recipeAPI'; // Assume this fetches previous recipes
import '../Styling/TagInput.css'

const TagInput = ({ recipeData, setRecipeData }: { recipeData: any; setRecipeData: any }) => {
    const [suggestedTags, setSuggestedTags] = useState<string[]>([]);
    const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
    const [inputValue, setInputValue] = useState<string>("");

    useEffect(() => {
        // Fetch tags from previous recipes and combine with SUGGESTED_TAGS
        const fetchTags = async () => {
            const recipes = await getRecipes();
            const previousTags = [...new Set(recipes.flatMap((recipe) => recipe.tags ?? []))];
            setSuggestedTags([...new Set([...SUGGESTED_TAGS, ...previousTags])]);
        };

        fetchTags();
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const input = e.target.value;
        setInputValue(input);

        // Filter suggestions based on input
        const currentTags = input.split(",").map(tag => tag.trim());
        const lastTag = currentTags[currentTags.length - 1].toLowerCase();

        setFilteredSuggestions(
            suggestedTags.filter(tag => tag.toLowerCase().startsWith(lastTag) && !currentTags.includes(tag))
        );
    };

    const handleTagSelect = (tag: string) => {
        const currentTags = inputValue.split(",").map(tag => tag.trim());
        const newTags = [...new Set([...currentTags.slice(0, -1), tag])]; // Add selected tag and remove incomplete input
        setInputValue(newTags.join(", "));
        setRecipeData({ ...recipeData, tags: newTags });
        setFilteredSuggestions([]);
    };

    const handleBlur = () => {
        // Update recipeData tags when the input loses focus
        const tags = inputValue.split(",").map(tag => tag.trim()).filter(tag => tag);
        setRecipeData({ ...recipeData, tags });
        setFilteredSuggestions([]);
    };

    return (
        <div className="tag-input-container" style={{ position: "relative" }}>
            <label>Tags</label>
            <input
                type="text"
                name="tags"
                value={inputValue}
                onChange={handleInputChange}
                onBlur={handleBlur}
                placeholder="Enter tags separated by commas"
                autoComplete="off"
            />
            {filteredSuggestions.length > 0 && (
                <ul className="suggestions-list" style={{
                    position: "absolute",
                    top: "100%",
                    left: 0,
                    right: 0,
                    maxHeight: "150px",
                    overflowY: "auto",
                    border: "1px solid #ccc",
                    background: "#fff",
                    zIndex: 10,
                    listStyle: "none",
                    padding: 0,
                    margin: 0,
                }}>
                    {filteredSuggestions.map((suggestion, index) => (
                        <li
                            key={index}
                            onClick={() => handleTagSelect(suggestion)}
                            style={{
                                padding: "8px",
                                cursor: "pointer",
                                backgroundColor: "#fff",
                                borderBottom: "1px solid #ccc",
                            }}
                            onMouseDown={(e) => e.preventDefault()} // Prevent blur on click
                        >
                            {suggestion}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default TagInput;
