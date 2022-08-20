const Discord = require('discord.js');
const APP = require('../index.js');
const Mongo = require('../dbGlobals');



function deleteCategory(categoryDoc, guild) {
    categoryDoc.channels.forEach(childId => {
        guild.channels.fetch(childId)
            .then(child => child.delete())
            .catch(err => console.error(err));
    });

    Mongo.CHANNELS.deleteOne({category: categoryDoc.category})
}


function deleteSingleton(singletonDoc, field) {
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
    description: "A channel was deleted",
    once: false,

    async execute(channel) {
        const categoryDoc = await Mongo.CHANNELS.findOne({category: channel.id});
        const hofDoc = await Mongo.SINGLETONS.findOne({hofChannelId: channel.id});

        if (categoryDoc) deleteCategory(categoryDoc, channel.guild);
        if (hofDoc) deleteSingleton(hofDoc, 'hofChannelId');
    }
}