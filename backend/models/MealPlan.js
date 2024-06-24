const mongoose = require('mongoose');

const MealPlanSchema = new mongoose.Schema({
    week: Number,
    year: Number,
    days: [{
        mainCourse: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Recipe'
        },
        sides: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Recipe'
        }]
    }]
    // createdBy: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'User' // Assuming you have a user model for user management
    // }
});

module.exports = mongoose.model('MealPlan', MealPlanSchema);


// const mongoose = require('mongoose');

// const mealSchema = new mongoose.Schema({
//     dayOfWeek: {
//         type: String,
//         enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
//         required: true
//     },
//     mainCourse: { type: mongoose.Schema.Types.ObjectId, ref: 'Recipe' },
//     sides: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Recipe' }]
// });

// const weekMealPlanSchema = new mongoose.Schema({
//     weekOfYear: Number,
//     year: Number,
//     meals: [mealSchema],
//     userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
// });

// const WeekMealPlan = mongoose.model('WeekMealPlan', weekMealPlanSchema);

// module.exports = WeekMealPlan;