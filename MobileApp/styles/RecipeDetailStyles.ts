import { StyleSheet } from 'react-native';

const RecipeDetailStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  listContentContainer: {
    paddingTop: 30, // ✅ Extra space at the top
    paddingBottom: 50, // ✅ Ensures smooth scrolling past Notes
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  image: {
    width: '100%',
    height: 250,
    resizeMode: 'cover',
    borderRadius: 10,
    marginBottom: 16,
  },
  detailSection: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  tag: {
    backgroundColor: '#007bff',
    color: 'white',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 10,
    marginRight: 5,
    fontSize: 14,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default RecipeDetailStyles;
