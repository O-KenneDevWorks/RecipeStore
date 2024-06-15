const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const PantryItem = require('./models/PantryItem'); // Import the PantryItem model
const Recipe = require('./models/Recipe'); // Import the Recipe model
 
const app = express();
const port = 3000;

app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
 
app.use(cors());
app.use(bodyParser.json());
 
mongoose.connect('mongodb://10.0.0.85:27017/recipeStore', {

})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Failed to connect to MongoDB', err));
 
app.get('/', (req, res) => {
    res.send('Server running at http://10.0.0.85:3000');
});
 
// Route to add a pantry item
app.post('/pantry', async (req, res) => {
    try {
        const pantryItem = new PantryItem(req.body);
        await pantryItem.save();
        res.status(201).send(pantryItem);
    } catch (error) {
        res.status(400).send('Error adding pantry item: ' + error.message);
    }
});
 
// Route to get all pantry items
app.get('/pantry', async (req, res) => {
    try {
        const pantryItems = await PantryItem.find({});
        res.status(200).send(pantryItems);
    } catch (error) {
        res.status(500).send('Error fetching pantry items: ' + error.message);
    }
});
 
// Route to add a recipe
app.post('/recipes', async (req, res) => {
    try {
        const recipe = new Recipe(req.body);
        await recipe.save();
        res.status(201).send(recipe);
    } catch (error) {
        res.status(400).send('Error adding recipe: ' + error.message);
    }
});
 
// Route to get all recipes
app.get('/recipes', async (req, res) => {
    try {
        const recipes = await Recipe.find({});
        res.status(200).send(recipes);
    } catch (error) {
        res.status(500).send('Error fetching recipes: ' + error.message);
    }
});
 
// Route to get a specific recipe by ID
app.get('/recipes/:id', async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.id);
        if (!recipe) {
            return res.status(404).send('Recipe not found');
        }
        res.status(200).send(recipe);
    } catch (error) {
        res.status(500).send('Error fetching recipe: ' + error.message);
    }
});

// Route to update a recipe by ID
app.put('/recipes/:id', async (req, res) => {
    try {
        const recipe = await Recipe.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!recipe) {
            return res.status(404).send('Recipe not found');
        }
        res.status(200).send(recipe);
    } catch (error) {
        res.status(400).send('Error updating recipe: ' + error.message);
    }
});

app.get('/random-recipe', async (req, res) => {
    try {
        const pantryItems = await PantryItem.find();
        const pantryIngredients = pantryItems.map(item => item.name.toLowerCase());
        const recipes = await Recipe.find();
        const matchingRecipes = recipes.filter(recipe => 
            recipe.ingredients.some(ingredient => pantryIngredients.includes(ingredient.name.toLowerCase()))
        );
        if (matchingRecipes.length > 0) {
            const randomIndex = Math.floor(Math.random() * matchingRecipes.length);
            const randomRecipe = matchingRecipes[randomIndex];
            res.status(200).send(randomRecipe);
        } else {
            res.status(404).send({ error: 'No matching recipes found' });
        }
    } catch (error) {
        res.status(500).send({ error: 'Error fetching random recipe' });
    }
});
 
app.listen(port, '0.0.0.0', () => {
    console.log(`Server running at http://0.0.0.0:${port}`);
});







/* 
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const PantryItem = require('./models/PantryItem');

const { MongoClient, ObjectId } = require('mongodb');

const app = express();
const port = 3000;

const url = 'mongodb://localhost:27017'
const dbName = 'recipeStore'

app.use(cors());
app.use(express.json());

async function connectToMongoDB() {
    try {
        console.log('connecting to mongoDB...');
        const client = await MongoClient.connect(url);
        console.log('connected to mongoDB');
        const db = client.db(dbName);
        console.log(`connected to database: ${dbName}`);

        // Routes

        // Add new recipe
        app.post('/recipes', async (req, res) => {
            try {
                const { name, ingredients, directions, prepTime, cookTime, totalTime, servings, yield} = req.body;

                // Validate required fields
                if (!name || !ingredients || !directions) {
                    return res.status(400).json({ error: 'Name, Ingredients, and Directions are required fields'});
                }
                
                // Create recipe object
                const recipe = {
                    name,
                    ingredients,
                    directions,
                    prepTime: prepTime || '',
                    cookTime: cookTime || '',
                    totalTime: totalTime || '',
                    servings: servings || '',
                    yield: yield || ''
                };
                
                // Insert recipe into MongoDB
                const result = await db.collection('recipes').insertOne(recipe);

                // Log the entire result object for debugging
                // console.log('Insert result: ', result)

                // Check the insert result
                if (!result.acknowledged) {
                    throw new Error('Failed to insert recipe')
                }

                // Fetch the inserted recipe by ID to return the response
                const insertedRecipe = await db.collection('recipes').findOne({ _id: result.insertedId})

                res.status(201).json(insertedRecipe);

            } catch (error) {
                console.error('Error inserting recipe: ', error);
                res.status(500).send('Error inserting recipe');
            }
        });
        
        // Get a list of all recipes
        app.get('/recipes', async (req, res) => {
            try {
                const collection = db.collection('recipes')
                console.log('collections reference: ', collection)
                const recipes = await collection.find().toArray();
                res.status(200).json(recipes);
            } catch (error) {
                console.error('Error fetching recipes: ', error);
                res.status(500).send('Error fetching recipes');
            }
        });

        // Get single recipe
        app.get('/recipes/:id', async (req, res) => {
            try {
                const collection = db.collection('recipes')
                console.log('collections reference: ', collection)
                const recipe = await collection.findOne({ _id: new ObjectId(req.params.id) });
                res.status(200).json(recipe);
            } catch (error) {
                console.error('Error fetching recipe: ', error);
                res.status(500).send('Error fetching recipe')
            }
        });

        // Start the server
        app.listen(port, '0.0.0.0', () => {
            console.log(`Server running at http://0.0.0.0:${port}`);
        });

    } catch (err) {
        console.error('failed to connect to mongo', err);
    }
};

// Connect to MongoDB and start server
connectToMongoDB();

*/