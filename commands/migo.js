const Discord = require('discord.js');
const APP = require("../index.js");
const {UnknownError} = require('../errors.js');

module.exports = {
    name: "migo",
    slash: true,

    getMetadata() {
        return {
            name: "migo",
            description: "je kokot"
        }
    },

    async execute(interaction) {
        const embed = new Discord.MessageEmbed()
            .setImage('https://media.discordapp.net/attachments/742124770040217651/957699743155388476/kokotmigo.gif')
            .setTitle('Migo')
            .setDescription('je kokot')
            .setColor('#f172fc');
 
        interaction.editReply('.');
        interaction.channel.send({embeds: [embed], ephemeral: false})
    }
}