import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    modal: {
      backgroundColor: '#fff',
      padding: 20,
      borderRadius: 10,
      maxHeight: '80%',
    },
    title: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 10,
    },
    item: {
      fontSize: 16,
      paddingVertical: 4,
    },
    closeButton: {
      marginTop: 20,
      backgroundColor: '#cc0000',
      padding: 10,
      borderRadius: 6,
      alignItems: 'center',
    },
    closeButtonText: {
      color: '#fff',
      fontWeight: '600',
    },
  });
  
export default styles;