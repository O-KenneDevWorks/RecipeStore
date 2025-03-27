import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { fetchPantryItems } from '../api/pantryAPI';
import { PantryItem } from '../interfaces/Pantry';
import styles from '../styles/PantryViewStyles';

const PantryViewScreen = () => {
  const [pantryItems, setPantryItems] = useState<PantryItem[]>([]);
  const navigation = useNavigation();

  useEffect(() => {
    const loadPantryItems = async () => {
      try {
        const data = await fetchPantryItems();
        setPantryItems(data);
      } catch (error) {
        console.error('Error loading pantry items:', error);
      }
    };

    loadPantryItems();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pantry Items</Text>

      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Text style={styles.backButtonText}>Back to Home</Text>
      </TouchableOpacity>

      <FlatList
        data={pantryItems}
        keyExtractor={(item, index) => item._id ?? `pantry-${index}`}
        renderItem={({ item }) => (
          <View style={styles.listItem}>
            <Text>{item.amount} {item.unit} of {item.name}</Text>
          </View>
        )}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

export default PantryViewScreen;