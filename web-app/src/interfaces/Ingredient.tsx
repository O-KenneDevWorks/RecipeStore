export interface Ingredient {
    amount: string;
    unit: string;
    name: string;
}

export interface IngredientSection {
    title: string;
    items: Ingredient[];
}

export interface DirectionSection {
    title: string;
    steps: string[];
}