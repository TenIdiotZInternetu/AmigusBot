const Discord = require('discord.js');
const APP = require('../appGlobals.js');


module.exports = {
    name: "hof-create",
    slash: true,

    async create() {
        APP.CommandManager.create({
            name: "hof-create",
            description: "[ADMIN ONLY] Creates #hall-of-fame channel with empty ranking slots",
            
            options: [{
                name: "slots",
                description: "Number of initial ranking slots (10 by default)",
                type: 'NUMBER',
                required: false,
            }]
        })
    },

    async execute(interaction) {
        const Mongo = require('../dbGlobals.js');
        let slots = interaction.options.getNumber('slots', false);

        if (!slots) slots = 10;
        const single = await Mongo.SINGLETONS.findOne()
        
        if (single.hofChannelId) {
            console.log("HOF already exists");
            return;
        }

        const hofChan = await interaction.guild.channels.create("hall-of-fame", {type: 'GUILD_TEXT'})
            .catch(err => console.error(err));
        
        hofChan.permissionOverwrites.edit(APP.Guild.roles.everyone, new Discord.Permissions(66624n).serialize());

        Mongo.SINGLETONS.updateOne({}, {
            $set: {hofChannelId: hofChan.id}
        })
        
        const slotsArray = Array(10).fill(new Discord.MessageEmbed().setDescription('Your future achievements here'));
        const remSlotsArray = Array(slots % 10).fill(new Discord.MessageEmbed().setDescription('Your future achievements here'));

        while (slots > 0) {
            let mess;

            if (slots > 10) mess = hofChan.send({embeds: slotsArray});
            else mess = hofChan.send({embeds: remSlotsArray})

            Mongo.HOF_MESSAGES.insertOne({
                messageId: mess.id
            })

            slots -= 10;
        }
    }
}