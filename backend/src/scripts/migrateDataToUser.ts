import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// Import models
import User from '../models/User.js';
import Recipe from '../models/Recipe.js';
import PantryItem from '../models/PantryItem.js';
import WeekMealPlan from '../models/WeekMealPlan.js';

/**
 * Migration Script: Assign all existing recipes, pantry items, and meal plans to a user
 * 
 * Usage:
 *   node dist/scripts/migrateDataToUser.js <email>
 * 
 * Example:
 *   node dist/scripts/migrateDataToUser.js user@example.com
 */

async function migrateDataToUser(userEmail: string) {
    try {
        console.log('🔄 Starting data migration...\n');

        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI || '');
        console.log('✅ Connected to MongoDB');

        // Find the user by email
        const user = await User.findOne({ email: userEmail.toLowerCase() });
        if (!user) {
            console.error(`❌ User not found with email: ${userEmail}`);
            process.exit(1);
        }

        console.log(`✅ Found user: ${user.name} (${user.email})`);
        console.log(`   User ID: ${user._id}\n`);

        const userId = user._id;

        // Update recipes
        console.log('📖 Migrating Recipes...');
        const recipeResult = await Recipe.updateMany(
            { $or: [{ userId: { $exists: false } }, { userId: null }] },
            { $set: { userId: userId } }
        );
        console.log(`   ✓ Updated ${recipeResult.modifiedCount} recipes`);
        
        // Also update recipes with different userIds (optional - uncomment if needed)
        // const allRecipesResult = await Recipe.updateMany(
        //     { userId: { $ne: userId } },
        //     { $set: { userId: userId } }
        // );
        // console.log(`   ✓ Updated ${allRecipesResult.modifiedCount} additional recipes from other users`);

        // Update pantry items
        console.log('\n🥫 Migrating Pantry Items...');
        const pantryResult = await PantryItem.updateMany(
            { $or: [{ userId: { $exists: false } }, { userId: null }] },
            { $set: { userId: userId } }
        );
        console.log(`   ✓ Updated ${pantryResult.modifiedCount} pantry items`);

        // Update meal plans
        console.log('\n📅 Migrating Meal Plans...');
        const mealPlanResult = await WeekMealPlan.updateMany(
            { $or: [{ userId: { $exists: false } }, { userId: null }] },
            { $set: { userId: userId } }
        );
        console.log(`   ✓ Updated ${mealPlanResult.modifiedCount} meal plans`);

        // Summary
        console.log('\n' + '='.repeat(50));
        console.log('✅ Migration Complete!');
        console.log('='.repeat(50));
        console.log(`📊 Summary:`);
        console.log(`   • Recipes:      ${recipeResult.modifiedCount} updated`);
        console.log(`   • Pantry Items: ${pantryResult.modifiedCount} updated`);
        console.log(`   • Meal Plans:   ${mealPlanResult.modifiedCount} updated`);
        console.log(`   • User:         ${user.name} (${user.email})`);
        console.log('='.repeat(50) + '\n');

        // Get final counts
        const totalRecipes = await Recipe.countDocuments({ userId: userId });
        const totalPantry = await PantryItem.countDocuments({ userId: userId });
        const totalMealPlans = await WeekMealPlan.countDocuments({ userId: userId });

        console.log(`📈 Current totals for ${user.name}:`);
        console.log(`   • Recipes:      ${totalRecipes}`);
        console.log(`   • Pantry Items: ${totalPantry}`);
        console.log(`   • Meal Plans:   ${totalMealPlans}\n`);

    } catch (error) {
        console.error('\n❌ Migration failed:', error);
        process.exit(1);
    } finally {
        await mongoose.disconnect();
        console.log('🔌 Disconnected from MongoDB');
        process.exit(0);
    }
}

// Get email from command line arguments
const userEmail = process.argv[2];

if (!userEmail) {
    console.error('❌ Error: Please provide a user email address');
    console.log('\nUsage: node dist/scripts/migrateDataToUser.js <email>');
    console.log('Example: node dist/scripts/migrateDataToUser.js user@example.com\n');
    process.exit(1);
}

// Run migration
migrateDataToUser(userEmail);
