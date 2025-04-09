import mongoose from "mongoose";

export interface DayPlan {
  main: string | null;
  sides: string[];
}

interface MealPlanDoc extends mongoose.Document {
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
    year:       { type: Number, required: true },
    weekOfYear: { type: Number, required: true },
    meals:      [dayPlanSchema],
  },
  { timestamps: true },
);

// The combination of year + week must be unique
mealPlanSchema.index({ year: 1, weekOfYear: 1 }, { unique: true });

const WeekMealPlan =
mongoose.models.WeekMealPlan || mongoose.model<MealPlanDoc>('WeekMealPlan', mealPlanSchema);

export default WeekMealPlan;