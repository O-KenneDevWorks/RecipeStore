import express from 'express';
import mongoose from 'mongoose';
// import fs from 'fs';
// import path from 'path';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';


// Load environment variables
dotenv.config();

// Import routes and models
// import users from './routes/users.js';
import PantryItem from './models/PantryItem.js';
import Recipe from './models/Recipe.js';
// import MealPlan from './models/MealPlan.js';
import WeekMealPlan from './models/WeekMealPlan.js';

const app = express();

app.use(cors());
const corsOptions = {
    origin: 'http://10.0.0.101:3000', // Allow specific origin
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Allowed methods
    credentials: true, // Allow cookies
};
app.use(cors(corsOptions));

// const port = 3000;
const PORT = process.env.PORT || 3001;

const TEST_USER_ID = '1234567890abcdef12345678'; // Example ObjectId

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// app.use(cors());
// app.use(bodyParser.json());



const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const viteBuildPath = path.join(__dirname, '../web-app/dist');

app.use(express.static(viteBuildPath));

// DB Config
// const db = require('./config/keys').mongoURI;

mongoose.connect('mongodb://10.0.0.85:27017/recipeStore', {

})
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Failed to connect to MongoDB', err));

// Routes
// app.use('/api/users', users);

// HTTPS server setup
// const httpsOptions = {
//     key: fs.readFileSync(path.join(__dirname, 'server.key')),
//     cert: fs.readFileSync(path.join(__dirname, 'server.cert'))
// };


// Route to add a pantry item
app.post('/pantry', async (req, res) => {
    try {
        const pantryItem = new PantryItem(req.body);
        await pantryItem.save();
        res.status(201).send(pantryItem);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        res.status(400).send('Error adding pantry item: ' + errorMessage);
    }
});

// Route to get all pantry items
app.get('/pantry', async (_req, res) => {
    try {
        const pantryItems = await PantryItem.find({});
        res.status(200).send(pantryItems);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        res.status(500).send('Error fetching pantry items: ' + errorMessage);
    }
});

// Route to add a recipe
app.post('/recipes', async (req, res) => {
    try {
        const recipe = new Recipe(req.body);
        await recipe.save();
        res.status(201).send(recipe);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        res.status(400).send('Error adding recipe: ' + errorMessage);
    }
});

// Route to get all recipes
app.get('/recipes', async (_req, res) => {
    try {
        const recipes = await Recipe.find({});
        res.status(200).send(recipes);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        res.status(500).send('Error fetching recipes: ' + errorMessage);
    }
});

// Route to get recipe previews for the homepage
app.get('/recipes/previews', async (_req, res) => {
    try {
        // Select only the fields needed for the recipe previews: name, imageUrl, and _id
        const recipes = await Recipe.find({}, 'name image _id');
        res.status(200).json(recipes);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        res.status(500).send('Error fetching recipe previews: ' + errorMessage);
    }
});

// Route to get a specific recipe by ID
app.get('/recipes/:id', async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.id);
        if (!recipe) {
            res.status(404).send('Recipe not found');
        }
        res.status(200).send(recipe);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        res.status(500).send('Error fetching recipe: ' + errorMessage);
    }
});

// Route to update a recipe by ID
app.put('/recipes/:id', async (req, res) => {
    try {
        const recipe = await Recipe.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!recipe) {
            res.status(404).send('Recipe not found');
        }
        res.status(200).send(recipe);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        res.status(400).send('Error updating recipe: ' + errorMessage);
    }
});

app.get('/random-recipe', async (_req, res) => {
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
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        res.status(500).send({ error: 'Error fetching random recipe: ' + errorMessage });
    }
});


// Save or update a meal plan
app.post('/mealPlan', async (req, res) => {
    const { meals, year, weekOfYear } = req.body;
    const filter = { userId: TEST_USER_ID, year, weekOfYear }; // Filter includes userId, year, and weekOfYear
    const update = { userId: TEST_USER_ID, meals, year, weekOfYear };
    const options = { upsert: true, new: true, setDefaultsOnInsert: true };

    try {
        const mealPlan = await WeekMealPlan.findOneAndUpdate(filter, update, options);
        res.status(201).send(mealPlan);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        res.status(500).send('Error saving meal plan: ' + errorMessage);
    }
});

// Retrieve a meal plan
app.get('/mealPlan/:userId/:year/:weekOfYear', async (req, res) => {
    try {
        const { userId, year, weekOfYear } = req.params;
        const mealPlan = await WeekMealPlan.findOne({ userId, year, weekOfYear });
        if (!mealPlan) {
            res.status(404).send('Meal plan not found.');
        }
        res.send(mealPlan);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        res.status(500).send('Error fetching meal plan: ' + errorMessage);
    }
});

// if (process.env.NODE_ENV === 'production') {
//     app.use(express.static(path.join(__dirname, '../client/dist')));

//     app.get('*', (_req: Request, res: Response) => {
//       res.sendFile(path.join(__dirname, '../client/dist/index.html'));
//     });
//   }

app.use(express.static(path.join(__dirname, '../../web-app/dist')));

app.get('*', (_req, res) => {
    res.sendFile(path.join(__dirname, '../../web-app/dist/index.html'));
});

// https.createServer(httpsOptions, app).listen(3000, () => {
//     console.log('HTTPS Server running on port 3000');
// });

app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}!`);
});
