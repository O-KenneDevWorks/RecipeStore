import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
      padding: 16,
      alignItems: 'center',
      backgroundColor: '#FAFAFA',
    },
    header: {
      fontSize: 26,
      fontWeight: 'bold',
      marginBottom: 12,
      alignSelf: 'flex-start',
    },
    buttonRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      gap: 12,
      marginVertical: 12,
    },
    button: {
      backgroundColor: '#2e86de',
      paddingVertical: 10,
      paddingHorizontal: 16,
      borderRadius: 6,
      margin: 4,
    },
    buttonText: {
      color: 'white',
      fontWeight: '600',
    },
    weekPlan: {
      width: '100%',
      alignItems: 'center',
      gap: 16,
    },
  });
  
export default styles;
