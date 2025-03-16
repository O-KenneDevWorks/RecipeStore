export interface Recipe {
    _id: string;
    name: string;
}

export interface MealPlan {
    userId: string;
    weekOfYear: number;
    year: number;
    meals: string[][];
}
