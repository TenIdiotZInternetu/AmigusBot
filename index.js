const discord = require('discord.js');
require('dotenv').config();
const mongoDB = require('mongodb');
const fs = require("fs");

const intents = ['GUILDS', 'GUILD_MEMBERS', 'GUILD_MESSAGES', 'GUILD_MESSAGE_REACTIONS', 'GUILD_PRESENCES', 'GUILD_VOICE_STATES'];
const partials = ['GUIlD_MEMBER', 'MESSAGE', 'REACTION'];

const commandFiles = fs.readdirSync("./commands/").filter(f => f.endsWith(".js"));
const eventFiles = fs.readdirSync("./events/").filter(f => f.endsWith(".js"));

const mongoClient = new mongoDB.MongoClient(process.env.MONGODB_URI);
mongoClient.connect()

const client = new discord.Client({intents: intents, partials: partials});
client.login(process.env.TOKEN)
    .then(async t => {
        const guild = client.guilds.cache.get(process.env.GUILD_ID)
        const emotes = client.emojis.cache
        // const getEmote = client.emojis.cache.get

        commands = {}
        events = {}

        module.exports = {
            Client: client,
            MongoClient: mongoClient,
            MongoAdmin: mongoClient.db('Admin'). admin(),

            commands: commands,
            events: events,

            RANKS: [
                {name: "Impostor", level: 0, color: '#c7c7c7', reqPoints: 0, emote: emotes.get('1002556741478785114')},
                {name: "Newbie", level: 1, color: '#b2e0e3', reqPoints: 1, emote: emotes.get('852934215350878238')},
                {name: "Apprentice", level: 2, color: '#6bf1ca', reqPoints: 5, emote: emotes.get('977860400022441994')},
                {name: "Regular", level: 3, color: '#35ff55', reqPoints: 15, emote: emotes.get('743863548379398225')},
                {name: "Skilled", level: 4, color: '#f3c155', reqPoints: 30, emote: emotes.get('772840665603506206')},
                {name: "Master", level: 5, color: '#f34c44', reqPoints: 75, emote: emotes.get('1002560701866446858')},
                {name: "Amigus", level: 6, color: '#ff28e4', reqPoints: 150, emote: emotes.get('971492971788791818')},
            ],

            SuccessColor: '#3ba55c',
            ErrorColor: '#ed4245',
            WarningColor: '#e8c202',
        };

        await client.application.commands.set([]);
        await guild.commands.set([])

        for (file of commandFiles) {
            const com = require(`./commands/${file}`);
            client.application.commands.create(com.getMetadata());
            commands[com.name] = com;
        }
        
        for (file of eventFiles) {
            const event = require(`./events/${file}`);
            events[event.name] = event;
        
            if (event.once) client.once(event.name, args => event.execute(args));
            else client.on(event.name, args => event.execute(args));
        }

        console.log('Amigus is online!');
    })

