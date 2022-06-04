const Discord = require('discord.js');
const APP = require('../appGlobals.js');

async function execute(interaction) {
    if (interaction.isButton()) exButton();
    if (interaction.isCommand()) exCommand();

    function exButton() {

    }

    function exCommand() {
        APP.commands[interaction.commandName].execute(interaction);
    }
}


module.exports = {
    name: "interactionCreate",
    description: "",
    once: false,
    execute: execute
}