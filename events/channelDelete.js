const Discord = require('discord.js')

module.exports = {
    name: "channelDelete",
    description: "A channel was deleted",
    once: false,
    async execute(channel) {
        if (!channel.type === 'GUILD_CATEGORY') return;
        if (!global.cachedChannels.has(channel.id)) return;

        global.cachedChannels.get(channel.id).forEach(childId => {
            channel.guild.channels.fetch(childId)
                .then(child => child.delete())
                .catch(err => console.error(err));
        });

        cachedChannels.delete(channel.id);
    }
}