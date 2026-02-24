import { useState, useEffect } from 'react';
import { startOfWeek, endOfWeek, addWeeks, format } from 'date-fns';

import { fetchRecipes, fetchMealPlan, saveMealPlan } from '../api/mealPlanAPI';
import { fetchShoppingList, saveShoppingList } from '../api/shoppingListAPI';

import { Recipe } from '../interfaces/Recipe';
import { ShoppingListItem } from '../interfaces/shoppingList';

import DayPlan from '../components/DayPlan';
import ShoppingListModal from '../components/ShoppingList';

import '../Styling/MealPlanner.css';

type IngredientTotals = Record<
    string,
    { amount: string; unit: string }[]
>;

const MealPlanner = () => {
    const [weekPlan, setWeekPlan] = useState(
        Array(7).fill({ main: null, sides: [] })
    );
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [currentWeekDate, setCurrentWeekDate] = useState(new Date());
    const [isShoppingListOpen, setIsShoppingListOpen] = useState(false);

    const [shoppingItems, setShoppingItems] = useState<any[]>([]);

    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    const getWeekKey = (date: Date) => {
        const start = startOfWeek(date, { weekStartsOn: 1 });
        return format(start, "yyyy-'W'II");
    };

    const formatWeekRange = (date: Date): string => {
        const start = startOfWeek(date, { weekStartsOn: 1 });
        const end = endOfWeek(date, { weekStartsOn: 1 });
        return `${format(start, 'MMMM d')} - ${format(end, 'MMMM d')}`;
    };

    const getYearFromDate = (date: Date): string => {
        return format(date, 'yyyy');
    };

    const mergeAndSort = (list: ShoppingListItem[]) => {
        const map = new Map<string, ShoppingListItem>();
        list.forEach((it) => {
            const key = `${it.name.toLowerCase()}|${it.unit.toLowerCase()}`;
            if (map.has(key)) {
                const existing = map.get(key)!;
                existing.amount = existing.amount ? `${existing.amount} + ${it.amount}` : it.amount;
            } else {
                map.set(key, { ...it });
            }
        });
        return Array.from(map.values()).sort((a, b) =>
            a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }),
        );
    };

    useEffect(() => {
        const loadData = async () => {
            try {
                const recipeData = await fetchRecipes();
                setRecipes(recipeData);

                const weekKey = getWeekKey(currentWeekDate);
                // Extract year and week number from weekKey (format: "YYYY-WNN")
                const match = weekKey.match(/^(\d{4})-W(\d{1,2})$/);
                if (match) {
                    const year = Number(match[1]);
                    const weekOfYear = Number(match[2]);
                    const mealPlanData = await fetchMealPlan(year, weekOfYear);

                    if (mealPlanData) {
                        setWeekPlan(mealPlanData.meals);
                    } else {
                        setWeekPlan(Array(7).fill({ main: null, sides: [] }));
                    }
                } else {
                    setWeekPlan(Array(7).fill({ main: null, sides: [] }));
                }
            } catch (error) {
                console.error('Error loading data:', error);
            }
        };

        loadData();
    }, [currentWeekDate]);

    const handleAddRecipe = (dayIndex: number, type: 'main' | 'side', recipeId: string, sideIndex?: number) => {
        setWeekPlan(prev => {
            const updated = [...prev];
            const day = { ...updated[dayIndex] };

            if (type === 'main') {
                day.main = recipeId;
            } else if (type === 'side' && sideIndex !== undefined) {
                const sides = [...day.sides];
                sides[sideIndex] = recipeId;
                day.sides = sides;
            }

            updated[dayIndex] = day;
            return updated;
        });
    };

    const handleRemoveRecipe = (dayIndex: number, type: 'main' | 'side', sideIndex?: number) => {
        const updated = [...weekPlan];
        const day = { ...updated[dayIndex] };

        if (type === 'main') {
            day.main = null;
        } else if (type === 'side') {
            day.sides.splice(sideIndex!, 1);
        }

        updated[dayIndex] = day;
        setWeekPlan(updated);
    };

    const handleRandomRecipe = (dayIndex: number, type: 'main' | 'side', sideIndex?: number) => {
        const random = recipes[Math.floor(Math.random() * recipes.length)];
        if (!random || !random._id) return;

        if (type === 'main') {
            handleAddRecipe(dayIndex, 'main', random._id);
        } else {
            handleAddRecipe(dayIndex, 'side', random._id, sideIndex);
        }
    };

    const handleClearDay = (dayIndex: number) => {
        const updated = [...weekPlan];
        updated[dayIndex] = { main: null, sides: [] };
        setWeekPlan(updated);
    };

    const handleRandomizeWeek = () => {
        setWeekPlan(() =>
            Array(7).fill(0).map(() => {
                const main = recipes[Math.floor(Math.random() * recipes.length)];
                const side1 = recipes[Math.floor(Math.random() * recipes.length)];
                const side2 = recipes[Math.floor(Math.random() * recipes.length)];
                return {
                    main: main?._id || null,
                    sides: [side1?._id || null, side2?._id || null].filter(Boolean),
                };
            })
        );
    };

    const handleClearWeek = () => {
        setWeekPlan(Array(7).fill({ main: null, sides: [] }));
    };

    const saveWeek = async () => {
        try {
            const weekKey = getWeekKey(currentWeekDate);
            // Extract year and week number from weekKey (format: "YYYY-WNN")
            const match = weekKey.match(/^(\d{4})-W(\d{1,2})$/);
            if (match) {
                const year = Number(match[1]);
                const weekOfYear = Number(match[2]);
                await saveMealPlan({ meals: weekPlan, year, weekOfYear });
                console.log('Meal plan saved.');
            } else {
                console.error('Invalid week format');
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleShowShoppingList = () => {
        const map: IngredientTotals = {};

        const add = (name: string, amount: string, unit: string) => {
            if (!map[name]) map[name] = [];
            map[name].push({ amount, unit });
        };

        weekPlan.forEach((day) => {
            if (day.main) {
                const main = recipes.find((r) => r._id === day.main);
                main?.ingredients?.forEach(({ name, amount, unit }) => {
                    if (name && amount && unit) add(name, amount, unit);
                });
            }

            day.sides.forEach((sideId: string) => {
                const side = recipes.find((r) => r._id === sideId);
                side?.ingredients?.forEach(({ name, amount, unit }) => {
                    if (name && amount && unit) add(name, amount, unit);
                });
            });
        });

        const list = Object.entries(map).flatMap(([name, arr]) =>
            arr.map(({ amount, unit }) => ({ name, amount, unit })),
        );

        setShoppingItems(list);
        setIsShoppingListOpen(true);
    };


    const handleSaveShopping = async (newItems: ShoppingListItem[]) => {
        const weekKey = getWeekKey(currentWeekDate);

        const existing = await fetchShoppingList(weekKey);
        const merged = mergeAndSort([...(existing?.items ?? []), ...newItems]);

        await saveShoppingList(merged, weekKey);

        setShoppingItems(merged);
    };

    return (
        <div className="meal-planner">
            <div className="header-container">
                <h1>Meal Planner</h1>
                <div className="week-nav">
                    <button onClick={() => setCurrentWeekDate(prev => addWeeks(prev, -1))}>←</button>
                    <div>
                        <h3>{getYearFromDate(currentWeekDate)}</h3>
                        <h2>{formatWeekRange(currentWeekDate)}</h2>
                    </div>
                    <button onClick={() => setCurrentWeekDate(prev => addWeeks(prev, 1))}>→</button>
                </div>

                <div className="week-buttons-container">
                    <button className="week-buttons" onClick={handleRandomizeWeek}>Randomize Week</button>
                    <button className="week-buttons" onClick={handleClearWeek}>Clear Week</button>
                    <button className="week-buttons" onClick={saveWeek}>Save Week</button>
                    <button className="week-buttons" onClick={handleShowShoppingList}>Shopping List</button>
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

            <ShoppingListModal
                isOpen={isShoppingListOpen}
                onClose={() => setIsShoppingListOpen(false)}
                onSave={handleSaveShopping}
                initialItems={shoppingItems}
            />
        </div>
    );
};

export default MealPlanner;
