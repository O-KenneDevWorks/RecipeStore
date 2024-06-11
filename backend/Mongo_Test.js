const { MongoClient } = require('mongodb');

const url = 'mongodb://localhost:27017'
const dbName = 'recipeStore'

// console.log('Connectiong to MongoDB...')
// MongoClient.connect(url, (err, client) => {
//     if (err) {
//         console.error('Failed to connect to MongoDB', err);
//         process.exit(1);
//     };

//     console.log('Connected to MongoDB')
//     const db = client.db(dbName);
//     client.close();
// });

async function testMongoConnection() {
    try {
        console.log('connecting to mongoDB...');
        const client = await MongoClient.connect(url);
        console.log(client)
        console.log('connected to mongoDB');
        const db = client.db(dbName);
        console.log('connected to database: ${dbName}');
        console.log(db)
        await client.close();
        console.log('closed connection');
    } catch (err) {
        console.error('failed to connect to mongo', err);
    }
}

testMongoConnection();