const Discord = require('discord.js');
const APP = require("../index.js");

module.exports = {
    name: "migo",
    slash: true,

    async create() {
        APP.CommandManager.create({
            name: "migo",
            description: "je kokot"
        })
    },

    async execute(interaction) {
        const embed = new Discord.MessageEmbed()
            .setImage(process.env.KOKOT_MIGO)
            .setTitle('Migo')
            .setDescription('je kokot')
            .setColor('#f172fc');

        interaction.editReply({embeds: [embed]});
    }
}