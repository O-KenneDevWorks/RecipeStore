import { StyleSheet } from 'react-native';

const EditRecipeFormStyles = StyleSheet.create({
  editRecipeForm: {
    width: '100%',
    maxWidth: 800,
    alignSelf: 'center',
    padding: 20,
    backgroundColor: '#f9f9f9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    borderRadius: 12,
  },
  
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    paddingVertical: 5,
    borderBottomWidth: 2,
    borderBottomColor: '#007bff', // Blue underline
  },
  
  picker: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    backgroundColor: '#fff',
    marginVertical: 8,
  },

  pickerContainer: {
    width: '75%', // Fixed width for Unit Picker
  },

  listContainer: {
    marginBottom: 20,
  },

  listContentContainer: {
    paddingBottom: 20,
  },

  ingredientItem: {
    flexDirection: 'column',  // Stack vertically
    alignItems: 'flex-start', // Align to left
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    marginBottom: 10,
    width: '100%',
  },

  ingredientRow: {
    flexDirection: 'row',  // Amount & Unit side by side
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 5,  // Space between rows
  },

  ingredientInput: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    backgroundColor: '#fff',
    marginRight: 10,  // Space between Amount & Unit
  },

  ingredientNameInput: {
    width: '100%',  // Full width on second row
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    backgroundColor: '#fff',
    marginBottom: 5,  // Space between name and buttons
  },

  directionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    paddingVertical: 10,
    paddingHorizontal: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },

  directionInput: {
    flex: 1,
    padding: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    backgroundColor: '#fff',
    textAlignVertical: 'top',
    minHeight: 50,
  },

  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignSelf: 'stretch',   // Makes it take the full available width
    // flexGrow: 1,            // Allows the row to expand as needed
    // width: '100%',
  },

  button: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },

  buttonFlex: {
    flex: 1,
  },

  moveUpButton: {
    backgroundColor: '#ffcc00', // Yellow
  },

  moveDownButton: {
    backgroundColor: '#ff5733', // Orange-Red
  },

  deleteButton: {
    backgroundColor: '#dc3545', // Red
  },

  addButton: {
    backgroundColor: '#007bff', // Blue
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 15,
  },

  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },

  saveButton: {
    backgroundColor: '#28a745', // Green
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },

  uploadButton: {
    backgroundColor: '#007bff',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 15,
  },

  uploadButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },

  imagePreview: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginTop: 10,
  },

  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },

  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default EditRecipeFormStyles;
