import express from 'express';
import { saveShoppingList, getShoppingList } from '../../controllers/shoppingListController.js';

const router = express.Router();

/**
 * @route POST /shoppingList
 * @description Save shopping list to the new device
 * @access Public
 */
router.post('/', saveShoppingList);

/**
 * @route GET /shoppingList?week=YYYY-W##
 * @description Get the shopping list for that week
 * @access Public
 */
router.get('/',  getShoppingList);

export { router as shoppingListRouter };
