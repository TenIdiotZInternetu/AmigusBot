const mongoDB = require('mongodb');
require('dotenv').config();

let globals;

const client = new mongoDB.MongoClient(process.env.MONGODB_URI);
client.connect(async (err) => {
    if (err) {
        console.error("MongoDBConnectionError: " + err);
    }
    
    db = client.db('SVK_Tournament_Scene');
    singles = db.collection("Singletons");
    const singlesDoc = await singles.findOne();
    
    if (!singlesDoc) {
        singles.insertOne({
            hofChannel: null,       // defined in hof-create.js
        });
    }

    globals = {
        Client: client,
        DB: db,

        SINGLETONS: singles,
        CHANNELS: db.collection("Channels"),
        HOF: db.collection("HoF"),
        HOF_MESSAGES: db.collection("HoFMessages"),
    }

    module.exports = globals
});
