const Discord = require('discord.js');
const { InstanceLimitError } = require('../errors.js');
const APP = require('../index.js');
const { newHofMessage } = require('../utils.js');
const Mongo = require('../dbGlobals');
const { getMetadata } = require('./requestrooms.js');


module.exports = {
    name: "hof-create",
    slash: true,

    getMetadata() {
        return {
            name: "hof-create",
            description: "[ADMIN ONLY] Creates #hall-of-fame channel with empty ranking slots",
            
            options: [{
                name: "slots",
                description: "Number of initial ranking slots (10 by default)",
                type: 'NUMBER',
                required: false,
            }]
        }
    },

    async execute(interaction) {
        let slots = interaction.options.getNumber('slots', false);

        if (!slots) slots = 5;
        const single = await Mongo.SINGLETONS.findOne()
        
        if (single.hofChannelId) {
            throw new InstanceLimitError("Hall of fame channel already exists", "#hall-of-fame", 1)
        }


        // Creating the #hall-of-fame channel -------------------------------------------------------------------------------------=
        const hofChan = await interaction.guild.channels.create("hall-of-fame", {type: 'GUILD_TEXT'})
            .catch(err => console.error(err));
        
        hofChan.permissionOverwrites.edit(interaction.guild.roles.everyone, new Discord.Permissions(66624n).serialize());

        Mongo.SINGLETONS.updateOne({}, {
            $set: {hofChannelId: hofChan.id}
        })
        

        // Sending messages with empty embeds --------------------------------------------------------------------------------------
        for (; slots > 0; slots--) {
            newHofMessage(Mongo, hofChan);
        }
    }
}