import mongoose from "mongoose";

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

const MealPlan = mongoose.model('MealPlan', MealPlanSchema);

export default MealPlan;