const fs = require('fs');
const dotenv = require('dotenv')
const { MongoClient } = require('mongodb');

dotenv.config()

const uri = process.env.MONGODB_URI
const dbName = 'coverland_data';  // Name your database
const collectionName = 'product_data';  // Name your collection

async function insertDataIntoMongoDB(data) {
    const client = new MongoClient(uri, { useUnifiedTopology: true });
    try {
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection(collectionName);

        // Insert each object in the array as a separate document in the collection
        await collection.insertMany(data);
        console.log('Data inserted successfully!');
    } catch (err) {
        console.error('Error inserting data:', err);
    } finally {
        await client.close();
    }
}

fs.readFile('../../code/datasheet_conversion/output.json', 'utf8', (err, jsonString) => {
    if (err) {
        console.error('Error reading the file:', err);
        return;
    }
    try {
        const data = JSON.parse(jsonString);
        insertDataIntoMongoDB(data);
    } catch (error) {
        console.error('Error parsing JSON:', error);
    }
});
