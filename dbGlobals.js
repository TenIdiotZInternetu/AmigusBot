const mongoDB = require('mongodb');
require('dotenv').config();

const client = new mongoDB.MongoClient(process.env.MONGODB_URI);
client.connect()

db = client.db('SVK_Tournament_Scene')

module.exports = {
    Client: client,
    DB: db,
}