import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInputs, Button, Flatlist } from 'react-native';
import axios from 'axios';

export default funtion App() {
    const [recipes, setRecipes] = useState([]);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');

    useEffect(() => {
        axios.get('http://localhost:3000/recipes').then(response => {
            setRecipes(response.data);
        });
    }, []);

    const addRecipe = () => {
        axios.post('http://localhost:3000/recipes', { name, description }).then(response => {
            setRecipes([...recipes, response.data]);
            setName('');
            setDescription('');
        });
    }

    return (
        <view style={StyleSheet.container}>
            <Text>Recipes</Text>
            <TextInput value={name} onChangeText={setName} placeholder="Name" />
            <TextInput value={description} onChangeText={setDescription} placeholder="Description" />
            <Button title="Add Recipe" onPress={addRecipe} />
            <Flatlist
                data={recipes}
                keyExtractors={item => item._id}
                renderItem={({ item }) => <Text>{item.name}: {item.description}</Text>}
            />
        </view>
    );
}

const styles = StyleSheet.create({
    container: {
        flex:1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    }
});
