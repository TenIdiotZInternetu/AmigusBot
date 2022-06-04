const Discord = require('discord.js');
const dotenv = require('dotenv').config();
const fs = require("fs");

const intents = ["GUILDS", "GUILD_MEMBERS", "GUILD_MESSAGES", "GUILD_MESSAGE_REACTIONS"];
const partials = ["GUIld_MEMBER", "MESSAGE", "REACTION"];
const Client = new Discord.Client({intents: intents, partials: partials});

const commandFiles = fs.readdirSync("./commands/").filter(f => f.endsWith(".js"));
global.commands = {};
const eventFiles = fs.readdirSync("./events/").filter(f => f.endsWith(".js"));
global.events = {};
global.cachedChannels = new Map()

for (file of commandFiles) {
    const com = require(`./commands/${file}`);
    if (com.create) com.create()
    commands[com.name] = com;
}

for (file of eventFiles) {
    const event = require(`./events/${file}`);
    events[event.name] = event;

    if (event.once) Client.once(event.name, args => event.execute(args));
    else Client.on(event.name, args => event.execute(args));
}


Client.once('ready', () => {
    console.log('Amigus is online!');
});

Client.login(process.env.TOKEN)