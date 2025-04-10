import { Request, Response } from 'express';
import { ShoppingList } from '../models/shoppingList.js';

export const saveShoppingList = async (req: Request, res: Response) => {
  const { week, items } = req.body;
  if (!week || !Array.isArray(items))
    return res.status(400).send('Invalid body');

  console.log("save triggered")
  console.log(req.body)

  try {
    const doc = await ShoppingList.findOneAndUpdate(
      { week },
      { week, items },
      { upsert: true, new: true, runValidators: true },
    );
    return res.status(201).json(doc);
  } catch (err: any) {
    console.log(('Error saving shopping list: ' + err.message))
    return res.status(500).send('Error saving shopping list: ' + err.message);
  }
};

export const getShoppingList = async (req: Request, res: Response) => {
  const week = req.query.week as string;
  if (!week) return res.status(400).send('week query param required');

  const doc = await ShoppingList.findOne({ week });
  if (!doc) return res.status(404).send('Not found');
  return res.json(doc);
};
