const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const passport = require('passport');

const users = require('./routes/users');

const PantryItem = require('./models/PantryItem'); // Import the PantryItem model
const Recipe = require('./models/Recipe'); // Import the Recipe model
const MealPlan = require('./models/MealPlan'); // Import the Meal Plan Model
const WeekMealPlan = require('./models/WeekMealPlan');  // Import the meal plan model

const app = express();
const port = 3000;

const TEST_USER_ID = '1234567890abcdef12345678'; // Example ObjectId

app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
 
app.use(cors());
app.use(bodyParser.json());

// DB Config
const db = require('./config/keys').mongoURI;
 
mongoose.connect('mongodb://10.0.0.85:27017/recipeStore', {

})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Failed to connect to MongoDB', err));

// Passport middleware
app.use(passport.initialize());

// Passport config
require('./config/passport')(passport);

// Routes
app.use('/api/users', users);

// HTTPS server setup
const httpsOptions = {
    key: fs.readFileSync(path.join(__dirname, 'server.key')),
    cert: fs.readFileSync(path.join(__dirname, 'server.cert'))
};
 
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
        res.status(500).send('Error saving meal plan: ' + error.message);
    }
});

// Retrieve a meal plan
app.get('/mealPlan/:userId/:year/:weekOfYear', async (req, res) => {
    try {
        const { userId, year, weekOfYear } = req.params;
        const mealPlan = await WeekMealPlan.findOne({ userId, year, weekOfYear });
        if (!mealPlan) {
            return res.status(404).send('Meal plan not found.');
        }
        res.send(mealPlan);
    } catch (error) {
        res.status(500).send('Error fetching meal plan: ' + error.message);
    }
});

https.createServer(httpsOptions, app).listen(5000, () => {
    console.log('HTTPS Server running on port 5000');
});
 
app.listen(port, '0.0.0.0', () => {
    console.log(`Server running at http://0.0.0.0:${port}`);
});