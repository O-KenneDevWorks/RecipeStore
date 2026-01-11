import mongoose from 'mongoose';

// Use environment variable for MongoDB URI with fallback
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://10.0.0.85:27017/recipeStore';

mongoose.connect(MONGODB_URI);

export default mongoose.connection;
