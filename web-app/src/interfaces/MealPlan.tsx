export interface ShortRecipe {
    _id: string;
    name: string;
    image?: string;
}

export interface DayPlan {
    main: string | null;
    sides: string[];
  }

export interface MealPlan {
    userId: string;
    weekOfYear: number;
    year: number;
    meals: string[][];
}
