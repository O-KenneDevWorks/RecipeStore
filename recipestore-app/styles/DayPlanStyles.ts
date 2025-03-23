import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    dayPlan: {
      width: '90%',
      borderWidth: 2,
      borderRadius: 10,
      margin: 16,
      padding: 16,
      backgroundColor: '#fdfdfd',
      alignSelf: 'center',
      shadowColor: '#aaa',
      shadowOpacity: 0.3,
      shadowRadius: 4,
    },
    dayTitle: {
      textAlign: 'center',
      fontSize: 20,
      borderBottomWidth: 2,
      marginBottom: 12,
    },
    mealSection: {
      marginVertical: 12,
      padding: 10,
      backgroundColor: '#f0f0f0',
      borderRadius: 8,
    },
    sectionTitle: {
      fontSize: 16,
      marginBottom: 8,
    },
    recipeRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 8,
    },
    randomButton: {
      marginTop: 12,
      backgroundColor: '#4CAF50',
      padding: 12,
      borderRadius: 6,
      alignItems: 'center',
    },
    clearButton: {
      marginTop: 8,
      backgroundColor: '#f44336',
      padding: 12,
      borderRadius: 6,
      alignItems: 'center',
    },
    buttonText: {
      color: '#fff',
      fontSize: 16,
    },
  });

export default styles;
