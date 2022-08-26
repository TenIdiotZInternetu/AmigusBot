const Discord = require('discord.js');
const APP = require('../index.js');
const Mongo = require('../dbGlobals');


module.exports = {
    name: "guildCreate",
    once: false,

    async execute(guild) {
        guildDb = APP.MongoClient.db(guild.name);

        guildDb.createCollection('Singletons');
        guildDb.createCollection('Channels');
        guildDb.createCollection('HoF');
        guildDb.createCollection('HoFMessages');
    }
}