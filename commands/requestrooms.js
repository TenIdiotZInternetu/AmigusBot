const Discord = require('discord.js')
const APP = require('../appGlobals.js')

module.exports = {
    name: "request-rooms",
    slash: true,

    create() {
        APP.CommandManager.create({
            name: "request-rooms",
            description: "Get a category with private rooms for your team",
            options: [{
                    name: "title",
                    description: "Name of the tournament",
                    type: 'STRING',
                    required: true,
                },{
                    name: "abr",
                    description: "Title abbreviation (max. 5 characters)",
                    type: 'STRING',
                    required: true,
                },{
                    name: "members",
                    description: "Names of your teammates",
                    type: 'STRING',
                    required: false,
                }
            ]
        })
    },

    async execute(interaction) {
        const tour = interaction.options.getString('title', true)
        const abr = interaction.options.getString('abr', true)
        const members = interaction.options.getString('members', false)

        console.log(members);
        
        verif = await require('../events/adminVerif.js').execute(interaction);
        if (!verif) return;

        const category = await interaction.guild.channels.create(tour, {type: 'GUILD_CATEGORY'});
        const catChannels = [];

        ['announcements', 'links', 'general', 'scores', 'lobbies', 'voice'].forEach( title => {
            let catType = 'GUILD_TEXT';
            if (title == 'voice') catType = 'GUILD_VOICE';

            interaction.guild.channels.create(`${abr}-${title}`, {parent: category, type: catType})
                .then(chan => catChannels.push(chan.id))
                .catch(err => console.error(err));
        })

        APP.cachedChannels.set(category.id, catChannels);
    }
}