import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { fetchRecipes, fetchMealPlan } from '../api/mealPlanAPI';
import { Recipe } from '../interfaces/Recipe';
import DayPlan from '../components/DayPlan';
import ShoppingList from '../components/ShoppingList';
import styles from '../styles/MealPlanStyles';


interface Props {
  userId: string;
}

const MealPlannerScreen = ({ userId }: Props) => {
  const [weekPlan, setWeekPlan] = useState(Array(7).fill({ main: null, sides: [] }));
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isShoppingListOpen, setIsShoppingListOpen] = useState(false);
  const [shoppingList, setShoppingList] = useState<Record<string, number>>({});

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  useEffect(() => {
    const loadData = async () => {
      try {
        const recipeData = await fetchRecipes();
        setRecipes(recipeData);

        const mealPlanData = await fetchMealPlan(userId);
        if (mealPlanData) setWeekPlan(mealPlanData.meals);
      } catch (err) {
        console.error('Error loading data:', err);
      }
    };

    loadData();
  }, [userId]);

  const handleAddRecipe = (dayIndex: number, type: 'main' | 'side', recipeId: string, sideIndex?: number) => {
    setWeekPlan((prev) => {
      const updated = [...prev];
      const day = { ...updated[dayIndex] };

      if (type === 'main') {
        day.main = recipeId;
      } else if (sideIndex !== undefined) {
        const newSides = [...day.sides];
        newSides[sideIndex] = recipeId;
        day.sides = newSides;
      }

      updated[dayIndex] = day;
      return updated;
    });
  };

  const handleRemoveRecipe = (dayIndex: number, type: 'main' | 'side', sideIndex?: number) => {
    setWeekPlan((prev) => {
      const updated = [...prev];
      const day = { ...updated[dayIndex] };

      if (type === 'main') {
        day.main = null;
      } else if (sideIndex !== undefined) {
        const newSides = [...day.sides];
        newSides.splice(sideIndex, 1);
        day.sides = newSides;
      }

      updated[dayIndex] = day;
      return updated;
    });
  };

  const handleRandomRecipe = (dayIndex: number, type: 'main' | 'side', sideIndex?: number) => {
    const randomRecipe = recipes[Math.floor(Math.random() * recipes.length)];
    if (!randomRecipe?._id) return;

    if (type === 'main') {
      handleAddRecipe(dayIndex, 'main', randomRecipe._id);
    } else {
      handleAddRecipe(dayIndex, 'side', randomRecipe._id, sideIndex);
    }
  };

  const handleClearDay = (dayIndex: number) => {
    const updated = [...weekPlan];
    updated[dayIndex] = { main: null, sides: [] };
    setWeekPlan(updated);
  };

  const handleRandomizeWeek = () => {
    setWeekPlan(() =>
      Array(7).fill(null).map(() => ({
        main: recipes[Math.floor(Math.random() * recipes.length)]?._id,
        sides: [
          recipes[Math.floor(Math.random() * recipes.length)]?._id,
          recipes[Math.floor(Math.random() * recipes.length)]?._id
        ],
      }))
    );
  };

  const handleClearWeek = () => {
    setWeekPlan(Array(7).fill({ main: null, sides: [] }));
  };

  const handleShowShoppingList = () => {
    const ingredients: Record<string, number> = {};

    weekPlan.forEach((day) => {
      const addIngredients = (recipeId: string | null) => {
        const recipe = recipes.find((r) => r._id === recipeId);
        recipe?.ingredients?.forEach(({ name, amount }) => {
          if (name && amount) ingredients[name] = (ingredients[name] || 0) + Number(amount);
        });
      };

      addIngredients(day.main);
      day.sides.forEach(addIngredients);
    });

    setShoppingList(ingredients);
    setIsShoppingListOpen(true);
  };

  const handleCloseShoppingList = () => setIsShoppingListOpen(false);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Meal Planner</Text>

      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.button} onPress={handleRandomizeWeek}>
          <Text style={styles.buttonText}>Randomize Week</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleClearWeek}>
          <Text style={styles.buttonText}>Clear Week</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleShowShoppingList}>
          <Text style={styles.buttonText}>Shopping List</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.weekPlan}>
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
      </View>

      <ShoppingList
        isVisible={isShoppingListOpen}
        onClose={handleCloseShoppingList}
        shoppingList={shoppingList}
      />
    </ScrollView>
  );
};

export default MealPlannerScreen;
