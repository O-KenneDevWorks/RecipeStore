export interface ShortRecipe {
    _id: string;
    name: string;
    image?: string;
}

export interface MealPlan {
    userId: string;
    weekOfYear: number;
    year: number;
    meals: string[][];
}
