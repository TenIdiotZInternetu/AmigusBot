const Discord = require('discord.js')
const APP = require('../appGlobals.js')
let Mongo;


function deleteCategory(categoryDoc) {
    categoryDoc.channels.forEach(childId => {
        APP.Guild.channels.fetch(childId)
            .then(child => child.delete())
            .catch(err => console.error(err));
    });

    Mongo.CHANNELS.deleteOne({category: categoryDoc.category})
}


function deleteSingleton(singletonDoc, field) {
    updateDoc = {'$set': {}};
    updateDoc['$set'][field] = null;
    filter = {};
    filter[field] = singletonDoc[field];
    Mongo.SINGLETONS.updateOne(filter, updateDoc);
}

 
module.exports = {
    name: "channelDelete",
    description: "A channel was deleted",
    once: false,

    async execute(channel) {
        Mongo = await require('../dbGlobals.js');

        const categoryDoc = await Mongo.CHANNELS.findOne({category: channel.id});
        const hofDoc = await Mongo.SINGLETONS.findOne({hofChannelId: channel.id});

        if (categoryDoc) deleteCategory(categoryDoc);
        if (hofDoc) deleteSingleton(hofDoc, 'hofChannelId');

        
    }
}