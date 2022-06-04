const Discord = require('discord.js')

module.exports = {
    name: "interactionCreate",
    description: "",
    once: false,
    async execute(interaction) {
        if (!interaction.isButton()) return;
        
    }
}