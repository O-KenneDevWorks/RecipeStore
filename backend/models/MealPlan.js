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
