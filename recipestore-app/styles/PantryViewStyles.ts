import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
      maxWidth: 600,
      alignSelf: 'center',
      marginVertical: 20,
      padding: 20,
      backgroundColor: '#ffffff',
      borderRadius: 8,
      borderWidth: 1,
      borderColor: '#ccc',
      shadowColor: '#000',
      shadowOpacity: 0.1,
      shadowRadius: 10,
      shadowOffset: { width: 0, height: 4 },
      elevation: 5,
    },
    title: {
      fontSize: 24,
      fontWeight: '600',
      marginBottom: 20,
      borderBottomWidth: 2,
      borderBottomColor: '#aaa',
      textAlign: 'center',
      paddingBottom: 10,
    },
    list: {
      paddingBottom: 10,
    },
    listItem: {
      padding: 10,
      marginBottom: 10,
      backgroundColor: '#f4f4f4',
      borderRadius: 4,
      borderWidth: 1,
      borderColor: '#ddd',
    },
    backButton: {
      marginBottom: 20,
      padding: 10,
      backgroundColor: '#0080ff',
      borderRadius: 6,
      alignItems: 'center',
    },
    backButtonText: {
      color: 'white',
      fontWeight: '500',
    },
  });
  
export default styles