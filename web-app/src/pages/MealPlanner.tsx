import { useState, useEffect } from 'react';
import { fetchRecipes, fetchMealPlan } from '../api/mealPlanAPI';
import { ShortRecipe } from '../interfaces/MealPlan';
import { Recipe } from '../interfaces/Recipe'
import DayPlan from '../components/DayPlan';
import ShoppingList from '../components/ShoppingList';
import '../Styling/MealPlanner.css'

interface Props {
    userId: string;
}

const MealPlanner = ({ userId }: Props) => {
    const [weekPlan, setWeekPlan] = useState(
        Array(7).fill({ main: null, sides: [] })
    );
    const [recipes, setRecipes] = useState<ShortRecipe[]>([]);
    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const [isShoppingListOpen, setIsShoppingListOpen] = useState(false);
    const [shoppingList, setShoppingList] = useState<Record<string, number>>({});

    useEffect(() => {
        const loadData = async () => {
            try {
                const recipeData = await fetchRecipes();
                setRecipes(recipeData);

                const mealPlanData = await fetchMealPlan(userId);
                if (mealPlanData) {
                    setWeekPlan(mealPlanData.meals);
                }
            } catch (error) {
                console.error('Error loading data:', error);
            }
        };

        loadData();
    }, [userId]);

    const handleAddRecipe = (dayIndex: number, type: 'main' | 'side', recipeId: string, sideIndex?: number) => {
        setWeekPlan((prevWeekPlan) => {
            const updatedWeekPlan = prevWeekPlan.map((day, index) => {
                if (index === dayIndex) {
                    const updatedDay = { ...day }; // Create a new day object
                    if (type === 'main') {
                        updatedDay.main = recipeId; // Update the main course
                    } else if (type === 'side' && sideIndex !== undefined) {
                        const updatedSides = [...updatedDay.sides]; // Copy sides array
                        updatedSides[sideIndex] = recipeId;
                        updatedDay.sides = updatedSides; // Update the sides array
                    }
                    return updatedDay;
                }
                return day;
            });

            console.log("Updated weekPlan:", updatedWeekPlan); // Verify state update
            return updatedWeekPlan;
        });
    };


    const handleRemoveRecipe = (dayIndex: number, type: 'main' | 'side', sideIndex?: number) => {
        const updatedDay = { ...weekPlan[dayIndex] };
        if (type === 'main') {
            updatedDay.main = null;
        } else if (type === 'side') {
            updatedDay.sides.splice(sideIndex!, 1);
        }
        const updatedWeekPlan = [...weekPlan];
        updatedWeekPlan[dayIndex] = updatedDay;
        setWeekPlan(updatedWeekPlan);
    };

    const handleRandomRecipe = (dayIndex: number, type: 'main' | 'side', sideIndex?: number) => {
        const randomRecipe = recipes[Math.floor(Math.random() * recipes.length)];
        console.log(`Randomizing ${type} for day ${dayIndex}:`, randomRecipe);

        if (type === 'main') {
            console.log(`Setting main for day ${dayIndex}`);
            handleAddRecipe(dayIndex, 'main', randomRecipe._id);
        } else if (type === 'side') {
            console.log(`Setting side ${sideIndex} for day ${dayIndex}`);
            handleAddRecipe(dayIndex, 'side', randomRecipe._id, sideIndex);
        }
    };


    const handleClearDay = (dayIndex: number) => {
        const updatedDay = { main: null, sides: [] };
        const updatedWeekPlan = [...weekPlan];
        updatedWeekPlan[dayIndex] = updatedDay;
        setWeekPlan(updatedWeekPlan);
    };

    const handleRandomizeWeek = () => {
        setWeekPlan((prevWeekPlan) =>
            prevWeekPlan.map(() => {
                const randomMain = recipes[Math.floor(Math.random() * recipes.length)];
                const randomSide1 = recipes[Math.floor(Math.random() * recipes.length)];
                const randomSide2 = recipes[Math.floor(Math.random() * recipes.length)];

                return {
                    main: randomMain._id,
                    sides: [randomSide1._id, randomSide2._id],
                };
            })
        );
    };

    const handleClearWeek = () => {
        setWeekPlan(Array(7).fill({ main: null, sides: [] }));
    };

    const handleShowShoppingList = () => {
        const ingredientsMap: Record<string, number> = {};
        weekPlan.forEach((day) => {
            if (day.main) {
                const mainRecipe = recipes.find((r): r is Recipe => r._id === day.main);
                mainRecipe?.ingredients?.forEach(({ name, amount }) => {
                    if (name && amount !== undefined) {
                        ingredientsMap[name] = (ingredientsMap[name] || 0) + amount;
                    }
                });
            }
    
            day.sides.forEach((sideId: string) => {
                const sideRecipe = recipes.find((r): r is Recipe => r._id === sideId);
                sideRecipe?.ingredients?.forEach(({ name, amount }) => {
                    if (name && amount !== undefined) {
                        ingredientsMap[name] = (ingredientsMap[name] || 0) + amount;
                    }
                });
            });
        });
        setShoppingList(ingredientsMap);
        setIsShoppingListOpen(true);
    };
    

    const handleCloseShoppingList = () => {
        setIsShoppingListOpen(false);
    };

    return (
        <div className="meal-planner">
            <div className="header-container">
                <h1>Meal Planner</h1>
                <div className="week-buttons-container">
                    <button className="week-buttons" onClick={handleRandomizeWeek}>
                        Randomize Week
                    </button>
                    <button className="week-buttons" onClick={handleClearWeek}>
                        Clear Week
                    </button>
                    <button className="week-buttons" onClick={handleShowShoppingList}>
                        Shopping List
                    </button>
                </div>
            </div>
            <div className="week-plan">
                {daysOfWeek.map((day, index) => (
                    <DayPlan
                        key={index}
                        day={day}
                        dayIndex={index}
                        recipes={recipes}
                        selectedRecipes={weekPlan[index]}
                        onAddRecipe={handleAddRecipe}
                        onRemoveRecipe={handleRemoveRecipe}
                        onRandomRecipe={handleRandomRecipe}
                        onClearDay={handleClearDay}
                    />
                ))}
            </div>
            <ShoppingList
                isOpen={isShoppingListOpen}
                onClose={handleCloseShoppingList}
                shoppingList={shoppingList}
            />
        </div>
    );
};


export default MealPlanner;
