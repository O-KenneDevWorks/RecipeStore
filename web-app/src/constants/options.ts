export const COURSE_OPTIONS = [
    "Appetizer",
    "Breakfast",
    "Cocktail",
    "Dessert",
    "Main Course",
    "Marinades",
    "Salad",
    "Sauces/Condiments",
    "Side",
    "Soup",
];

export const CUISINE_OPTIONS = [
    "American",
    "Chinese",
    "French",
    "Indian",
    "Italian",
    "Japanese",
    "Korean",
    "Mexican",
    "Thai",
];

export const SUGGESTED_TAGS = [
    "Untried",
    "Liked",
    "Favourite",
    "Spring",
    "Summer",
    "Autumn",
    "Winter",
]

interface UnitOption {
    value: string;
    label: string;
}

export const UnitOptions: UnitOption[] = [
    { value: 'Teaspoon', label: 'Teaspoon (tsp)' },
    { value: 'Tablespoon', label: 'Tablespoon (tbsp)' },
    { value: 'Fluid Ounce', label: 'Fluid Ounce (fl oz)' },
    { value: 'Cup', label: 'Cup' },
    { value: 'Pint', label: 'Pint (pt)' },
    { value: 'Quart', label: 'Quart (qt)' },
    { value: 'Gallon', label: 'Gallon (gal)' },
    { value: 'Milliliter', label: 'Milliliter (ml)' },
    { value: 'Liter', label: 'Liter (l)' },
    { value: 'Deciliter', label: 'Deciliter (dl)' },
    { value: 'Ounce', label: 'Ounce (oz)' },
    { value: 'Pound', label: 'Pound (lb)' },
    { value: 'Gram', label: 'Gram (g)' },
    { value: 'Kilogram', label: 'Kilogram (kg)' },
    { value: 'Inch', label: 'Inch (in)' },
    { value: 'Centimeter', label: 'Centimeter (cm)' },
    { value: 'Millimeter', label: 'Millimeter (mm)' },
    { value: 'Each', label: 'Each' },
    { value: 'Dozen', label: 'Dozen' },
    { value: 'Pinch', label: 'Pinch' },
    { value: 'Dash', label: 'Dash' },
    { value: 'Smidgen', label: 'Smidgen' },
    { value: 'Handful', label: 'Handful' },
    { value: 'Bunch', label: 'Bunch' },
    { value: 'ToTaste', label: 'To Taste' },
    { value: 'Small', label: 'Small' },
    { value: 'Medium', label: 'Medium' },
    { value: 'Large', label: 'Large' },
    { value: 'Degrees Fahrenheit', label: 'Degrees Fahrenheit (°F)' },
    { value: 'Degrees Celsius', label: 'Degrees Celsius (°C)' }
];

export const Themes = [
    { value: 'theme-light', label: 'Light Mode' },
    { value: 'theme-dark', label: 'Dark Mode' },
    { value: 'theme-minimal', label: 'Minimalistic' },
    { value: 'theme-warm', label: 'Warm' },
    { value: 'theme-organic', label: 'Organic' },
    { value: 'theme-modern', label: 'Modern' },
    { value: 'theme-rustic', label: 'Rustic' },
    { value: 'theme-vibrant', label: 'Vibrant' },
    // { value: 'theme-night', label: 'Night' },
];