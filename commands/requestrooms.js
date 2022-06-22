const Discord = require('discord.js');
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
                    description: "Names of you and your teammates, use @",
                    type: 'STRING',
                    required: false,
                },{
                    name: "proof-atch",
                    description: "Screenshot proving your attendence in the tournament",
                    type: 'ATTACHMENT',
                    required: false,
                },{
                    name: "proof-link",
                    description: "Link proving your attendence in a tournament",
                    type: 'STRING',
                    required: false,
                }
            ]
        })
    },

    async execute(interaction) {
        const tour = interaction.options.getString('title', true);
        const abr = interaction.options.getString('abr', true).toLowerCase();
        const members = interaction.options.getString('members', false);
        const proofAtch = interaction.options.getAttachment('proof-atch', false).url;
        const proofLink = interaction.options.getString('proof-link', false);
        const memberIds = [];
        
        
        // Verification --------------------------------------------------------------------------------------------------------
        const verifEmbed = new Discord.MessageEmbed()
            .setThumbnail(process.env.KOKOT_MIGO)
            .setAuthor({name: interaction.member.user.username, iconURL: interaction.member.displayAvatarURL()}) 
            .setURL(interaction.url)
            .setColor('#24bdb8')
            .setTitle("Rooms request")
            .setDescription(`${tour} (${abr})`)

        if (members) {
            verifEmbed.addField("Team Members", members)

            for (const id of members.matchAll(/<@!(\d*)>/g)) {
                memberIds.push(id[1]);
            }
        }

        if (proofAtch) verifEmbed.setImage(proofAtch);
        if (proofLink) verifEmbed.addField("Proof link", proofLink);
        
        verif = await require('../events/adminVerif.js').execute(interaction, verifEmbed);
        if (!verif) return;


        // Role Assignement ----------------------------------------------------------------------------------------------------
        const newRole = await APP.Guild.roles.create({
            name: abr.toUpperCase(),
            position: 5,
            mentionable: true,
            color: Math.floor(Math.random() * (0xffffff + 1)),
            hoist: true
        })

        if (members) {
            for (const id of memberIds) {
                APP.Guild.members.cache.get(id).roles.add(newRole);
            }
        }


        // Room Creation -------------------------------------------------------------------------------------------------------
        const category = await interaction.guild.channels.create(tour, {type: 'GUILD_CATEGORY'});
        const catChannels = [];

        
        for (const title of ["announcements", "links", "general", "scores", "lobbies", "voice"]) {
            let chanType = 'GUILD_TEXT';
            let perms = new Discord.Permissions(1067365944896n);

            if (title == "announcements" || title == "links") perms = new Discord.Permissions(66624n);
            if (title == "voice") chanType = 'GUILD_VOICE';

            await interaction.guild.channels.create(`${abr}-${title}`, {parent: category, type: chanType})
                .then(chan => {
                    catChannels.push(chan.id);
                    chan.permissionOverwrites.edit(newRole, perms.serialize());
                    chan.permissionOverwrites.edit(APP.Guild.roles.everyone, new Discord.Permissions(0n).serialize());
                })
                .catch(err => console.error(err));
                
        }

        APP.cachedChannels.set(category.id, catChannels);
        APP.MongoDB.collection("Channels").insertOne({
            category: category.id,
            categoryName: category.name,
            channels: catChannels,
        })
    }
}