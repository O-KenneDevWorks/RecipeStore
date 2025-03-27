// components/ShoppingList.tsx
import React from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import Modal from 'react-native-modal';

import styles from "../styles/ShoppingListStyles";

interface ShoppingListProps {
  isVisible: boolean;
  onClose: () => void;
  shoppingList: Record<string, number>;
}

const ShoppingList: React.FC<ShoppingListProps> = ({ isVisible, onClose, shoppingList }) => {
  const items = Object.entries(shoppingList);

  return (
    <Modal isVisible={isVisible} onBackdropPress={onClose}>
      <View style={styles.modal}>
        <Text style={styles.title}>Shopping List</Text>
        <FlatList
          data={items}
          keyExtractor={([key]) => key}
          renderItem={({ item: [ingredient, amount] }) => (
            <Text style={styles.item}>{`${ingredient}: ${amount}`}</Text>
          )}
        />
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeButtonText}>Close</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

export default ShoppingList;
