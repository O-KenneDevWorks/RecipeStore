import mongoose from "mongoose";

export interface DayPlan {
  main: string | null;
  sides: string[];
}

interface MealPlanDoc extends mongoose.Document {
  userId: string;
  year: number;
  weekOfYear: number;
  meals: DayPlan[];
}

const dayPlanSchema = new mongoose.Schema<DayPlan>(
  {
    main:  { type: String, ref: 'Recipe', default: null },
    sides: { type: [String], ref: 'Recipe', default: [] },
  },
  { _id: false },
);

const mealPlanSchema = new mongoose.Schema<MealPlanDoc>(
  {
    userId:     { type: String, required: true },
    year:       { type: Number, required: true },
    weekOfYear: { type: Number, required: true },
    meals:      [dayPlanSchema],
  },
  { timestamps: true },
);

// The combination of userId + year + week must be unique
mealPlanSchema.index({ userId: 1, year: 1, weekOfYear: 1 }, { unique: true });

const WeekMealPlan =
mongoose.models.WeekMealPlan || mongoose.model<MealPlanDoc>('WeekMealPlan', mealPlanSchema);

export default WeekMealPlan;