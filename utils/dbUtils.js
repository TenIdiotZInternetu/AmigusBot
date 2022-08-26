const APP = require('../index.js');
const Discord = require('discord.js');
const { UnknownError } = require('../errors.js');

module.exports = {
    async getGuildDb(guild, collection) {
        if (!(guild instanceof Discord.Guild)) throw new UnknownError("Unknown type of guildIdentifier");

        const dbCheck = await APP.MongoAdmin.command({listDatabases: 1});
        console.log("🚀 ~ file: utils.js ~ line 78 ~ getGuildDb ~ dbCheck", dbCheck);

        const collCheck = APP.MongoClient.db(guild.name).listCollections({name: 'grrr'});
        console.log("🚀 ~ file: utils.js ~ line 80 ~ getGuildDb ~ collCheck", collCheck);

        return APP.MongoClient.db(guild.name).collection(collection);
    },
}