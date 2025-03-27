import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { RecipePreview } from '../interfaces/Recipe';
import carouselStyles from '../styles/RecipeCarousel';

const RecipeCard = ({ _id, image, name }: RecipePreview) => {
  const router = useRouter();

  const handlePress = () => {
    console.log(`Navigating to RecipeDetail with id: ${_id}`);
    router.push({ pathname: '/RecipeDetail', params: { id: _id } });
  };

  return (
    <TouchableOpacity style={carouselStyles.carouselItemInner} onPress={handlePress}>
      <View style={carouselStyles.recipeImageContainer}>
        <Image
          source={{ uri: image || 'https://via.placeholder.com/150' }}
          style={carouselStyles.recipeImage}
        />
      </View>
      <View style={carouselStyles.recipeNameBanner}>
        <Text
          style={carouselStyles.recipeName}
          numberOfLines={2} // Truncate long recipe names to two lines
        >
          {name}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default RecipeCard;