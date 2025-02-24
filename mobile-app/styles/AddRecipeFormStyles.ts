import { StyleSheet } from 'react-native';

const AddRecipeFormStyles = StyleSheet.create({
  container: {
    width: '100%',
    maxWidth: 800,
    alignSelf: 'center',
    padding: 20,
    backgroundColor: '#f9f9f9', // Replace with themed colors
    borderColor: '#ddd', // Border color
    borderWidth: 1,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 100,  // Ensures the last button isn't cut off
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

  /** 📌 Ingredient Styles */
  ingredientItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    marginBottom: 10,
  },

  ingredientInput: {
    flex: 1,
    marginHorizontal: 5,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    backgroundColor: '#fff',
  },

  ingredientLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },

  /** 📌 Buttons */
  button: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },

  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },

  addButton: {
    backgroundColor: '#007bff', // Blue button
  },

  deleteButton: {
    backgroundColor: '#dc3545', // Red button
  },

  moveUpButton: {
    backgroundColor: '#28a745', // Green button
  },

  moveDownButton: {
    backgroundColor: '#ffc107', // Yellow button
  },

  /** 📌 Direction Styles */
  directionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    marginBottom: 10,
  },

  directionInput: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    backgroundColor: '#fff',
    textAlignVertical: 'top',
    minHeight: 50,
  },

  /** 📌 Notes Section */
  notesContainer: {
    flexDirection: 'column',
    marginBottom: 16,
  },

  notesLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },

  textarea: {
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    backgroundColor: '#fff',
    textAlignVertical: 'top',
    minHeight: 100, // Ensures enough space
  },

  /** 📌 Buttons Row */
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },

  submitButton: {
    backgroundColor: '#28a745', // Green button for submission
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },

  submitButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },

  uploadButton: {
    backgroundColor: '#007bff', // Blue button
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  
  uploadButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  

  /** 📌 Image Upload */
  imagePreview: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginTop: 10,
  },
});

export default AddRecipeFormStyles;
