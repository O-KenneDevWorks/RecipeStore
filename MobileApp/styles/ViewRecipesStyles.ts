import { StyleSheet } from 'react-native';

const ViewRecipesStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: '#f8f8f8',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between', // Align title left and button right
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007bff',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
  },
  filterText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 5,
  },
  filterControls: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10, // Creates space before the recipe cards
    elevation: 2,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 5,
  },
  picker: {
    marginBottom: 16,
    backgroundColor: '#fff',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  recipeGrid: {
    paddingHorizontal: 8,
    paddingBottom: 16,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
});

export default ViewRecipesStyles;

export default ViewRecipesStyles;
