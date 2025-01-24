const path = require('path');
// Load .env from the root of the project
require('dotenv').config({ path: path.join(__dirname, '../../.env') });
const MongoClient = require('mongodb').MongoClient;
const fs = require('fs');

// MongoDB connection URL with authentication options
let url = process.env.MONGO_URL;
if (!url) {
    console.error('Error: Could not load environment variables');
    console.log('Current directory:', __dirname);
    console.log(
        'Attempted to load .env from:',
        path.join(__dirname, '../../.env')
    );
    throw new Error('MONGO_URL environment variable is not set');
}

// Ensure URL has proper protocol prefix
if (!url.startsWith('mongodb://') && !url.startsWith('mongodb+srv://')) {
    url = `mongodb+srv://${url}`;
}

console.log('Connection URL:', url);
let filename = `${__dirname}/gifts.json`;
const dbName = 'giftdb';
const collectionName = 'gifts';

// notice you have to load the array of gifts into the data object
const data = JSON.parse(fs.readFileSync(filename, 'utf8')).docs;

// connect to database and insert data into the collection
async function loadData() {
    const client = new MongoClient(url);

    try {
        // Connect to the MongoDB client
        await client.connect();
        console.log('Connected successfully to server');

        // database will be created if it does not exist
        const db = client.db(dbName);

        // collection will be created if it does not exist
        const collection = db.collection(collectionName);
        let cursor = await collection.find({});
        let documents = await cursor.toArray();

        if (documents.length == 0) {
            // Insert data into the collection
            const insertResult = await collection.insertMany(data);
            console.log('Inserted documents:', insertResult.insertedCount);
        } else {
            console.log('Gifts already exists in DB');
        }
    } catch (err) {
        console.error(err);
    } finally {
        // Close the connection
        await client.close();
    }
}

loadData();

module.exports = {
    loadData,
};
