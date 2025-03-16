import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  // Recipes List
  recipesList: {
    listStyleType: 'none', // Not directly applicable in React Native, lists don't use bullet points
    padding: 0,
  },
  recipesListItem: {
    marginBottom: 10,
  },
  recipesListLink: {
    textDecorationLine: 'none',
    color: '#007bff',
  },
  recipesListLinkHover: {
    textDecorationLine: 'underline', // No direct hover in React Native, implement with `onPressIn` or similar
  },

  // Alphabet Navigation
  alphabetNav: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8, // Use spacing libraries if `gap` is unsupported
    marginVertical: 16,
    flexWrap: 'wrap',
  },
  letterLink: {
    textDecorationLine: 'none',
    color: '#0077cc',
    fontWeight: 'bold',
    padding: 8,
    borderWidth: 1,
    borderColor: '#0077cc',
    borderRadius: 4,
  },
  letterLinkHover: {
    backgroundColor: '#0077cc',
    color: '#fff',
  },

  // Letter Section
  letterSection: {
    marginTop: 32,
  },
  sectionTitle: {
    textAlign: 'center',
    fontSize: 24,
    marginBottom: 16,
    color: '#333',
  },

  // Recipe Grid
  recipeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: 24,
    gap: 24, // Use spacing libraries if `gap` is unsupported
  },
  recipeGridItem: {
    flex: 1,
    minWidth: 250, // Approximation for grid minmax
    marginBottom: 24,
  },

  // Filter Controls
  filterControls: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16, // Use spacing libraries if `gap` is unsupported
    marginBottom: 24,
  },
  filterLabel: {
    marginRight: 8,
    fontWeight: 'bold',
  },
  filterSelect: {
    padding: 8,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
  },

  // Responsive Design
  '@media (maxWidth: 768)': {
    recipeGrid: {
      justifyContent: 'center',
      gap: 16,
    },
  },
  '@media (maxWidth: 480)': {
    filterControls: {
      flexDirection: 'column',
    },
  },
});

export default styles;
