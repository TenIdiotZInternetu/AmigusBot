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
            .setImage(process.env.KOKOT_MIGO)
            .setTitle('Migo')
            .setDescription('je kokot')
            .setColor('#f172fc');
 
        interaction.editReply('.');
        interaction.channel.send({embeds: [embed], ephemeral: false})
    }
}