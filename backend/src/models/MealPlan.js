"use strict";
const mongoose = require('mongoose');
const MealPlanSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    weekOfYear: {
        type: Number,
        required: true
    },
    year: {
        type: Number,
        required: true
    },
    days: [{
            date: Date,
            meals: [{
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Recipe'
                }]
        }]
});
module.exports = mongoose.model('MealPlan', MealPlanSchema);
// const mongoose = require('mongoose');
// const mealSchema = new mongoose.Schema({
//     dayOfWeek: String,
//     mainCourse: { type: mongoose.Schema.Types.ObjectId, ref: 'Recipe' },
//     sides: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Recipe' }]
// });
// const weekMealPlanSchema = new mongoose.Schema({
//     year: Number,
//     weekOfYear: Number,
//     meals: [mealSchema],
//     userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }  // Assuming user authentication
// });
// const WeekMealPlan = mongoose.model('WeekMealPlan', weekMealPlanSchema);
// module.exports = WeekMealPlan;
