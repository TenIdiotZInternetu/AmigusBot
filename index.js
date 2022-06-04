require('dotenv').config();
const fs = require("fs");
const APP = require('./appGlobals.js')

const commandFiles = fs.readdirSync("./commands/").filter(f => f.endsWith(".js"));
const eventFiles = fs.readdirSync("./events/").filter(f => f.endsWith(".js"));

APP.Client.once('ready', () => {
    const guild = APP.Client.guilds.cache.get(process.env.GUILD_ID);
    APP.Guild = guild;
    APP.CommandManager = guild.commands;

    for (file of commandFiles) {
        const com = require(`./commands/${file}`);
        if (com.slash) com.create();
        APP.commands[com.name] = com;
    }
    
    for (file of eventFiles) {
        const event = require(`./events/${file}`);
        APP.events[event.name] = event;
    
        if (event.once) APP.Client.once(event.name, args => event.execute(args));
        else APP.Client.on(event.name, args => event.execute(args));
    }

    console.log('Amigus is online!');
});

APP.Client.login(process.env.TOKEN)