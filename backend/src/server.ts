import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import routes from './routes/index.js';


const PORT = process.env.PORT || 3001;
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(routes);

mongoose.connect('mongodb://10.0.0.85:27017/recipeStore', {})
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Failed to connect to MongoDB', err));

if (process.env.NODE_ENV === 'production') {
    console.log("prod")
    app.use(express.static(path.join(__dirname, '../../web-app/dist')));

    app.get('*', (_req, res) => {
        res.sendFile(path.join(__dirname, '../../web-app/dist/index.html'));
    });
}

app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}!`);
});
