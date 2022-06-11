const discord = require('discord.js');
require('dotenv').config();
const mongoDB = require('mongodb');

const intents = ['GUILDS', 'GUILD_MEMBERS', 'GUILD_MESSAGES', 'GUILD_MESSAGE_REACTIONS', 'GUILD_PRESENCES', 'GUILD_VOICE_STATES'];
const partials = ['GUIlD_MEMBER', 'MESSAGE', 'REACTION'];

const client = new discord.Client({intents: intents, partials: partials});
const mongoClient = new mongoDB.MongoClient(process.env.MONGODB_URI);

globals = {
    Discord: discord,
    Client: client,
    Guild: null,            // Defined in index.js once ready
    CommandManager: null,   // ^

    MongoClient: mongoClient,
    MongoDB: null,          // Defined in index.js on connect

    commands: {},
    events: {},
    cachedChannels: new Map()
};

module.exports = globals;