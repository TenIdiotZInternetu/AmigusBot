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
            .setImage(process.env.KOKOT_MIGO)
            .setTitle('je kokot')
            .setColor('#f172fc');

        interaction.channel.send({embeds: [embed]});

    }
}