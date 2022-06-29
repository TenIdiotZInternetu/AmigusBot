const discord = require('discord.js');
require('dotenv').config();

const intents = ['GUILDS', 'GUILD_MEMBERS', 'GUILD_MESSAGES', 'GUILD_MESSAGE_REACTIONS', 'GUILD_PRESENCES', 'GUILD_VOICE_STATES'];
const partials = ['GUIlD_MEMBER', 'MESSAGE', 'REACTION'];

const client = new discord.Client({intents: intents, partials: partials});

module.exports = {
    Discord: discord,
    Client: client,
    Guild: null,            // Defined in index.js once ready
    CommandManager: null,   // ^

    commands: {},
    events: {},
    cachedChannels: new Map()
};