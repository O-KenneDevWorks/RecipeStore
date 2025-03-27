import React from 'react';
import {
  View,
  Text,
  Button,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Recipe } from '../interfaces/Recipe';
import styles from '../styles/DayPlanStyles';

interface DayPlanProps {
  day: string;
  dayIndex: number;
  recipes: Recipe[];
  selectedRecipes: {
    main: string | null;
    sides: string[];
  };
  onAddRecipe: (dayIndex: number, type: 'main' | 'side', recipeId: string, sideIndex?: number) => void;
  onRemoveRecipe: (dayIndex: number, type: 'main' | 'side', sideIndex?: number) => void;
  onRandomRecipe: (dayIndex: number, type: 'main' | 'side', sideIndex?: number) => void;
  onClearDay: (dayIndex: number) => void;
}

const DayPlan: React.FC<DayPlanProps> = ({
  day,
  dayIndex,
  recipes,
  selectedRecipes,
  onAddRecipe,
  onRemoveRecipe,
  onRandomRecipe,
  onClearDay,
}) => {
  return (
    <View style={styles.dayPlan}>
      <Text style={styles.dayTitle}>{day}</Text>

      {/* Main Course Section */}
      <View style={styles.mealSection}>
        <Text style={styles.sectionTitle}>Main Course</Text>
        {selectedRecipes.main ? (
          <View style={styles.recipeRow}>
            <Text>{recipes.find((r) => r._id === selectedRecipes.main)?.name || 'Recipe not found'}</Text>
            <Button title="Remove" onPress={() => onRemoveRecipe(dayIndex, 'main')} />
          </View>
        ) : (
          <Text>No main course selected</Text>
        )}

        <Picker
          selectedValue={selectedRecipes.main || ''}
          onValueChange={(value) => onAddRecipe(dayIndex, 'main', value)}
        >
          <Picker.Item label="Select Main Course" value="" />
          {recipes.map((recipe) => (
            <Picker.Item key={recipe._id} label={recipe.name} value={recipe._id} />
          ))}
        </Picker>
        <Button title="Randomize Main" onPress={() => onRandomRecipe(dayIndex, 'main')} />
      </View>

      {/* Sides Section */}
      <View style={styles.mealSection}>
        <Text style={styles.sectionTitle}>Sides</Text>
        {selectedRecipes.sides.map((sideId, idx) => (
          <View key={idx} style={styles.recipeRow}>
            <Text>{recipes.find((r) => r._id === sideId)?.name || 'Recipe not found'}</Text>
            <Button title="Remove" onPress={() => onRemoveRecipe(dayIndex, 'side', idx)} />
          </View>
        ))}

        {selectedRecipes.sides.length < 2 && (
          <>
            <Picker
              selectedValue=""
              onValueChange={(value) =>
                onAddRecipe(dayIndex, 'side', value, selectedRecipes.sides.length)
              }
            >
              <Picker.Item label="Select Side" value="" />
              {recipes.map((recipe) => (
                <Picker.Item key={recipe._id} label={recipe.name} value={recipe._id} />
              ))}
            </Picker>
            <Button
              title="Randomize Side"
              onPress={() => onRandomRecipe(dayIndex, 'side', selectedRecipes.sides.length)}
            />
          </>
        )}
      </View>

      {/* Day Buttons */}
      <TouchableOpacity style={styles.randomButton} onPress={() => {
        onRandomRecipe(dayIndex, 'main');
        onRandomRecipe(dayIndex, 'side', 0);
        onRandomRecipe(dayIndex, 'side', 1);
      }}>
        <Text style={styles.buttonText}>Randomize Day</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.clearButton} onPress={() => onClearDay(dayIndex)}>
        <Text style={styles.buttonText}>Clear Day</Text>
      </TouchableOpacity>
    </View>
  );
};

export default DayPlan;
