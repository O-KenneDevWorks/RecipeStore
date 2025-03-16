import { StyleSheet } from 'react-native';
import { Dimensions } from 'react-native';

const screenWidth = Dimensions.get('window').width;

const carouselStyles = StyleSheet.create({
  carouselItemInner: {
    width: (screenWidth - 30) / 2, // Divide the screen width into two columns, minus padding
    aspectRatio: 1, // Maintain a square shape
    marginBottom: 16, // Space between rows
    borderRadius: 5,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 4,
  },
  recipeImageContainer: {
    width: '100%',
    height: '100%', // Ensure the image takes up 70% of the card's height
    overflow: 'hidden',
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
  },
  recipeImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  recipeNameBanner: {
    width: '100%',
    paddingVertical: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    color: '#fff',
    textAlign: 'center',
    position: 'absolute',
    bottom: 0,
    left: 0,
    fontSize: 16,
    fontWeight: 'bold',
  },

  recipeName: {
      width: '100%',
      paddingVertical: 10,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      color: '#fff',
      textAlign: 'center',
      position: 'absolute',
      bottom: 0,
      left: 0,
      fontSize: 14,
      fontWeight: 'bold',
  },
});

export default carouselStyles;
