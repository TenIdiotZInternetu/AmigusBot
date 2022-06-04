const Discord = require('discord.js')

module.exports = {
    name: "adminVerif",
    description: "Creates embed for actions requiring admin verification",
    once: false,

    async execute(message) {
        if (message.member.roles.cache.has(process.env.ADMIN_ROLE_ID)) return true;

        const row = new Discord.MessageActionRow()
            .addComponents(
                new Discord.MessageButton()
                    .setLabel("Verify")
                    .setStyle("SUCCESS"),
                new Discord.MessageButton()
                    .setLabel("Ignore")
                    .setStyle("DANGER")
            )

        const embed = new Discord.MessageEmbed()
            .setAuthor({name: message.member.user.username}) 
            .setURL(message.url)
            .setColor('#24bdb8')
            .setTitle("Rooms request")
            .setDescription()
    }
}