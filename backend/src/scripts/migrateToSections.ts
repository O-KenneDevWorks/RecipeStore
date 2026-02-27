import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

/**
 * Migration Script: Convert flat ingredients/directions arrays to sectioned format.
 *
 * Old format:
 *   ingredients: [{ amount, unit, name }, ...]
 *   directions:  ["step 1", "step 2", ...]
 *
 * New format:
 *   ingredients: [{ title: '', items: [{ amount, unit, name }, ...] }]
 *   directions:  [{ title: '', steps: ["step 1", "step 2", ...] }]
 *
 * Usage:
 *   node dist/scripts/migrateToSections.js
 */

async function migrate() {
    await mongoose.connect(process.env.MONGODB_URI || '');
    console.log('✅ Connected to MongoDB');

    const collection = mongoose.connection.collection('recipes');
    const recipes = await collection.find({}).toArray();

    console.log(`📖 Found ${recipes.length} recipe(s) to check`);

    let migrated = 0;

    for (const recipe of recipes) {
        const updates: Record<string, any> = {};

        // ── Ingredients ──────────────────────────────────────────────────────
        const ingredients = recipe.ingredients ?? [];
        const isOldIngredients =
            ingredients.length > 0 &&
            typeof ingredients[0] === 'object' &&
            !('items' in ingredients[0]);

        if (isOldIngredients) {
            updates.ingredients = [{ title: '', items: ingredients }];
        }

        // ── Directions ───────────────────────────────────────────────────────
        const directions = recipe.directions ?? [];
        const isOldDirections =
            directions.length > 0 &&
            (typeof directions[0] === 'string' ||
                (typeof directions[0] === 'object' && !('steps' in directions[0])));

        if (isOldDirections) {
            updates.directions = [{ title: '', steps: directions }];
        }

        if (Object.keys(updates).length > 0) {
            await collection.updateOne({ _id: recipe._id }, { $set: updates });
            console.log(`  ✅ Migrated: ${recipe.name}`);
            migrated++;
        }
    }

    console.log(`\n✅ Migration complete — ${migrated} recipe(s) updated`);
    await mongoose.disconnect();
}

migrate().catch((err) => {
    console.error('Migration failed:', err);
    process.exit(1);
});
