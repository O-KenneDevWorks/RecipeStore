import { StyleSheet } from 'react-native';

const EditRecipeFormStyles = StyleSheet.create({
  editRecipeForm: {
    width: '100%', // React Native doesn't support max-width
    maxWidth: 800,
    alignSelf: 'center', // Equivalent to margin: auto
    padding: 20,
    backgroundColor: '#f9f9f9', // Replace with actual background color
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    borderRadius: 8,
  },

  ingredient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%', // Adjusted for proper alignment
    marginBottom: 16, // Equivalent to 1rem
  },

  ingredientInput: {
    flexGrow: 1,
    marginHorizontal: 5,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    backgroundColor: '#fff',
  },

  ingredientLabel: {
    marginRight: 5,
    whiteSpace: 'nowrap', // Equivalent for text alignment
  },

  ingredientButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#007bff', // Adjust button color
    borderRadius: 5,
    alignItems: 'center',
  },

  direction: {
    flexDirection: 'column',
    marginBottom: 16,
  },

  directionLabel: {
    marginBottom: 8, // Equivalent to 0.5rem
  },

  directionInput: {
    width: '100%',
    marginBottom: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    backgroundColor: '#fff',
    textAlignVertical: 'top', // Ensures multi-line text input behaves properly
  },

  directionButton: {
    marginRight: 8, // Equivalent to 0.5rem
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#28a745', // Green color for confirm actions
    borderRadius: 5,
    alignItems: 'center',
  },

  buttonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
  },

  buttons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20, // Ensures spacing between buttons
    marginTop: 20,
  },

  textarea: {
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    backgroundColor: '#fff',
    textAlignVertical: 'top',
  },
});

export default EditRecipeFormStyles;
