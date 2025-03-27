import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
      padding: 16,
      backgroundColor: '#FAFAFA',
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: 16,
      color: '#2e86de',
    },
    image: {
      width: '100%',
      height: 200,
      borderRadius: 8,
      marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 8,
      },
      detailSection: {
        marginTop: 16,
        paddingHorizontal: 20,
      },
    section: {
      marginBottom: 16,
      backgroundColor: '#fff',
      padding: 12,
      borderRadius: 6,
      elevation: 1,
    },
    subheading: {
      fontSize: 18,
      fontWeight: '600',
      marginBottom: 8,
      color: '#333',
    },
    listItem: {
      marginBottom: 4,
      color: '#555',
    },
    tag: {
        backgroundColor: '#e0e0e0',
        color: '#333',
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 20,
        marginRight: 8,
        fontSize: 14,
      },
    errorText: {
      marginTop: 40,
      textAlign: 'center',
      fontSize: 16,
      color: 'red',
    },
    loader: {
      marginTop: 40,
    },
  });

  export default styles;