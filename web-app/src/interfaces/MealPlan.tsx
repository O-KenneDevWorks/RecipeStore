export interface ShortRecipe {
    _id: string;
    name: string;
}

export interface MealPlan {
    userId: string;
    weekOfYear: number;
    year: number;
    meals: string[][];
}
