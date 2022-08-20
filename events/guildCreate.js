const Discord = require('discord.js');
const APP = require('../index.js');
const Mongo = require('../dbGlobals');


module.exports = {
    name: "channelDelete",
    description: "A channel was deleted",
    once: false,

    async execute(channel) {
        
    }
}