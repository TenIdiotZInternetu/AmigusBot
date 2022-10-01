const Discord = require('discord.js');
const { InstanceLimitError } = require('../errors.js');
const APP = require('../index.js');


module.exports = {
    name: "create-adminverif",
    slash: true,

    getMetadata() {
        return {
            name: "create-adminverif",
            description: "[ADMIN ONLY] Creates #amigus-verification channel",
        }
    },

    execute(interaction) {

    }
}
