const Discord = require('discord.js')
const APP = require('../appGlobals.js')


module.exports = {
    name: "channelDelete",
    description: "A channel was deleted",
    once: false,
    async execute(channel) {
        if (!channel.type === 'GUILD_CATEGORY') return;
        if (!APP.cachedChannels.has(channel.id)) return;

        APP.cachedChannels.get(channel.id).forEach(childId => {
            channel.guild.channels.fetch(childId)
                .then(child => child.delete())
                .catch(err => console.error(err));
        });

        APP.cachedChannels.delete(channel.id);
    }
}