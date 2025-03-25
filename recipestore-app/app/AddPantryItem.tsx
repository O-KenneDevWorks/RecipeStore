import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { addPantryItem } from '../api/pantryAPI';
import { PantryItem } from '../interfaces/Pantry';
import styles from '../styles/AddPantryItemStyles';


const AddPantryItemScreen = () => {
  const [pantryItem, setPantryItem] = useState<PantryItem>({
    name: '',
    amount: '',
    unit: '',
  });

  const handleChange = (field: keyof PantryItem, value: string) => {
    setPantryItem({ ...pantryItem, [field]: value });
  };

  const handleSubmit = async () => {
    try {
      if (!pantryItem.name || !pantryItem.amount || !pantryItem.unit) {
        Alert.alert('Validation Error', 'All fields are required.');
        return;
      }

      const addedItem = await addPantryItem(pantryItem);
      console.log('Pantry item added:', addedItem);
      setPantryItem({ name: '', amount: '', unit: '' });
      Alert.alert('Success', 'Pantry item added successfully!');
    } catch (error) {
      console.error('Error adding pantry item:', error);
      Alert.alert('Error', 'Failed to add pantry item.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Name *</Text>
      <TextInput
        style={styles.input}
        value={pantryItem.name}
        onChangeText={(text) => handleChange('name', text)}
        placeholder="Enter ingredient name"
      />

      <Text style={styles.label}>Amount *</Text>
      <TextInput
        style={styles.input}
        keyboardType="decimal-pad"
        value={pantryItem.amount}
        onChangeText={(text) => handleChange('amount', text)}
        placeholder="Enter amount"
      />

      <Text style={styles.label}>Unit *</Text>
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={pantryItem.unit}
          onValueChange={(value) => handleChange('unit', value)}
        >
          <Picker.Item label="Select Unit" value="" enabled={false} />
          <Picker.Item label="Cup" value="cup" />
          <Picker.Item label="Tablespoon" value="tablespoon" />
          <Picker.Item label="Teaspoon" value="teaspoon" />
          <Picker.Item label="Ounce" value="ounce" />
          <Picker.Item label="Pound" value="pound" />
        </Picker>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Add Pantry Item</Text>
      </TouchableOpacity>
    </View>
  );
};

export default AddPantryItemScreen;