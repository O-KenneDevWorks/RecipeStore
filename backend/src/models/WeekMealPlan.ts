import mongoose from "mongoose";

const mealSchema2 = new mongoose.Schema({
    dayOfWeek: String,
    mainCourse: { type: mongoose.Schema.Types.ObjectId, ref: 'Recipe' },
    sides: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Recipe' }]
});

const weekMealPlanSchema2 = new mongoose.Schema({
    year: Number,
    weekOfYear: Number,
    meals: [mealSchema2]
    // userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }  // Assuming user authentication
});

const WeekMealPlans = mongoose.model('WeekMealPlan', weekMealPlanSchema2);

export default WeekMealPlans;