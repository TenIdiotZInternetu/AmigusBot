const Discord = require('discord.js');
const APP = require("../appGlobals.js");

module.exports = {
    name: "migo",
    slash: true,

    create() {
        APP.CommandManager.create({
            name: "migo",
            description: "je kokot"
        })
    },

    execute(interaction) {
        const embed = new Discord.MessageEmbed()
            .setImage('https://media.discordapp.net/attachments/742124770040217651/957699743155388476/kokotmigo.gif')
            .setTitle('je kokot')
            .setColor('#f172fc');

        interaction.channel.send({embeds: [embed]});

    }
}