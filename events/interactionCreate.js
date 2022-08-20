const Discord = require('discord.js');
const APP = require('../index.js');
const { alert } = require('../errors.js')

async function execute(interaction) {
    if (interaction.isButton()) exButton();
    if (interaction.isCommand()) exCommand();

    async function exButton() {
    }

    async function exCommand() {
        await interaction.deferReply({ ephemeral: true });
        APP.commands[interaction.commandName].execute(interaction)
            .catch(err => alert(err, interaction));
    }
}


module.exports = {
    name: "interactionCreate",
    once: false,
    execute: execute
}