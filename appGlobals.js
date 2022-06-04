const discord = require('discord.js');
require('dotenv').config();

const intents = ["GUILDS", "GUILD_MEMBERS", "GUILD_MESSAGES", "GUILD_MESSAGE_REACTIONS"];
const partials = ["GUIld_MEMBER", "MESSAGE", "REACTION"];

const client = new discord.Client({intents: intents, partials: partials});

globals = {
    Discord: discord,
    Client: client,
    Guild: null,            // Defined in index.js on ready
    CommandManager: null,   // ^

    commands: {},
    events: {},
    cachedChannels: new Map()
};

module.exports = globals;