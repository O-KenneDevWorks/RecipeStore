import mongoose from 'mongoose';

mongoose.connect('mongodb://10.0.0.85:27017/recipeStore');

export default mongoose.connection;
