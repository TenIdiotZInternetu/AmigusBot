const Discord = require('discord.js')

module.exports = {
    name: "migo",
    execute(message=null, args=[]) {
        const embed = new Discord.MessageEmbed()
            .setImage('https://media.discordapp.net/attachments/742124770040217651/957699743155388476/kokotmigo.gif')
            .setTitle('je kokot')
            .setColor('#f172fc');

        message.channel.send({embeds: [embed]});

    }
}