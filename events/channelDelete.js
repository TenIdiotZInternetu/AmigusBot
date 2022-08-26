const Discord = require('discord.js');
const APP = require('../index.js');
const Mongo = require('../dbGlobals');
const { getGuildDb } = require('../utils/dbUtils.js');



async function deleteCategory(categoryDoc, guild) {
    categoryDoc.channels.forEach(childId => {
        guild.channels.fetch(childId)
            .then(child => child.delete())
            .catch(err => console.error(err));
    });

    const channelsCol = await getGuildDb(guild, 'Channels')
    channelsCol.deleteOne({category: categoryDoc.category})
}


async function deleteSingleton(singletonDoc, field) {
    updateDoc = {'$unset': {}};
    updateDoc['$unset'][field] = '';
    filter = {};
    filter[field] = singletonDoc[field];
    Mongo.SINGLETONS.updateOne(filter, updateDoc);

    if (field == 'hofChannelId') {
        Mongo.HOF_MESSAGES.deleteMany();
    }
}

 
module.exports = {
    name: "channelDelete",
    once: false,

    async execute(channel) {
        getGuildDb(channel.guild, 'Channels')
            .then(col => {
                const doc = await col.findOne({category: channel.id})
                if (doc) deleteCategory(categoryDoc, channel.guild);
            })
            
        getGuildDb(channel.guild, 'Singletons').findOne({hofChannelId: channel.id})
            .then(col => {
                if (await col.findOne({category: channel.id})) deleteSingleton(hofDoc, 'hofChannelId');
            })
    }
}