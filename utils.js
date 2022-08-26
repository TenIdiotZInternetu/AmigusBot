const APP = require('./index.js');
const Discord = require('discord.js');
const Mongo = require('mongodb');
const { UnknownError } = require('./errors.js');

module.exports = {
    membersToArray(members, interaction='') {
        const memberIds = [];
    
        if (members) {
            for (const id of members.matchAll(/<@!(\d*)>/g)) {
                memberIds.push(id[1]);
            }
        } else {
            memberIds.push(interaction.member.id)
        }
    
        return memberIds;
    },
    
    
    membersIdsToString(memberIds, interaction='', sep=', ') {
        let outStr = "";
    
        for (const id of memberIds) {
            if (id !== memberIds[0]) outStr += sep;
            outStr += interaction.guild.members.cache.get(id).displayName;
        }
    
        return outStr;
    },
    
    
    pointsToRole(points) {
        const roles = APP.RANKS
        let lastRole = roles[0];
        
        for (const role of roles) {
            if (points < role.reqPoints) return lastRole;
            lastRole = role;
        }
    
        return roles[-1];
    },
    
    
    async newHofMessage(Mongo, hofChan) {
        mess = await hofChan.send({embeds: [new Discord.MessageEmbed().setDescription('Your future achievements here')]});

        Mongo.HOF_MESSAGES.insertOne({
            messageId: mess.id,
            dateCreated: new Date(),
        })

        return mess;
    },

    
    Markdown(string, tags) {
        string = string.toString();
        if (tags.includes('i')) string = `*${string}*`;
        if (tags.includes('b')) string = `**${string}**`;
        if (tags.includes('u')) string = `__${string}__`;
        if (tags.includes('s')) string = `~~${string}~~`;
        if (tags.includes('q')) string = `> ${string}`;
        if (tags.includes('c')) string = `\`\`\`${string}\`\`\``;
        if (tags.includes('m')) string = `"${string}"`;
        return string;
    },


    // Returns collection of database of guild accessible by given guildIdentifier type
    // i.e. guilds, interactions, channels, messages etc.
    async getGuildDb(guild, collection) {
        if (!(guild instanceof Discord.Guild)) throw new UnknownError("Unknown type of guildIdentifier");

        const dbCheck = await APP.MongoAdmin.command({listDatabases: 1});
        console.log("🚀 ~ file: utils.js ~ line 78 ~ getGuildDb ~ dbCheck", dbCheck);

        const collCheck = APP.MongoClient.db(guild.name).listCollections({name: 'grrr'});
        console.log("🚀 ~ file: utils.js ~ line 80 ~ getGuildDb ~ collCheck", collCheck);

        return APP.MongoClient.db(guild.name).collection(collection);
    },
}