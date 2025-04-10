import mongoose, { Schema, Document } from 'mongoose';

export interface ShoppingItem {
  name: string;
  amount: number;
  unit: string;
  checked?: boolean;
}

interface ShoppingListDoc extends Document {
  week: string;               // e.g. 2025-W15
  items: ShoppingItem[];
}

const itemSchema = new Schema<ShoppingItem>(
  {
    name:   { type: String, required: true },
    amount: { type: Number, required: false },
    unit:   { type: String, required: true },
    checked:{ type: Boolean, default: false },
  },
  { _id: false },
);

const shoppingListSchema = new Schema<ShoppingListDoc>(
  {
    week:  { type: String, required: true, unique: true },
    items: [itemSchema],
  },
  { timestamps: true },
);

export const ShoppingList =
  mongoose.models.ShoppingList ||
  mongoose.model<ShoppingListDoc>('ShoppingList', shoppingListSchema);
