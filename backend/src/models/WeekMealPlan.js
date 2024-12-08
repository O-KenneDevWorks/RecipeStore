"use strict";
const mongoose = require('mongoose');
const mealSchema = new mongoose.Schema({
    dayOfWeek: String,
    mainCourse: { type: mongoose.Schema.Types.ObjectId, ref: 'Recipe' },
    sides: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Recipe' }]
});
const weekMealPlanSchema = new mongoose.Schema({
    year: Number,
    weekOfYear: Number,
    meals: [mealSchema],
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } // Assuming user authentication
});
const WeekMealPlan = mongoose.model('WeekMealPlan', weekMealPlanSchema);
module.exports = WeekMealPlan;
