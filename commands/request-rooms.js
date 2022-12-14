const Discord = require('discord.js');
const APP = require('../index.js');
const {execute: AdminVerif} = require('../events/adminVerif.js')
const { InvalidInputError } = require('../errors.js');
const { getGuildDb } = require('../utils/dbUtils.js');
const { membersToArray } = require('../utils/memberFormatting')

// Permission Calculator: https://discordapi.com/permissions.html#<bitfield>

PERMS_NO_ACCESS = 0n
PERMS_FULL_ACCESS = 1067365944896n
PERMS_READ_ONLY = 66624n


module.exports = {
    name: "request-rooms",

    getMetadata() {
        return {
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
                    name: "captain",
                    description: "Member with access to announcements and links, use @",
                    type: 'STRING',
                    required: false,
                },{
                    name: "members",
                    description: "Names of you and your teammates, use @",
                    type: 'STRING',
                    required: false,
                },{
                    name: "proof-image",
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
        }
    },

    async execute(interaction) {
        const tour = interaction.options.getString('title', true);
        const abr = interaction.options.getString('abr', true).toLowerCase();
        const captain = interaction.options.getString('captain', false);
        const members = interaction.options.getString('members', false);
        const proofAtch = interaction.options.getAttachment('proof-image', false);
        const proofLink = interaction.options.getString('proof-link', false);

        if (abr.length > 5) throw new InvalidInputError("Please don't use more than 5 characters", 'abr', abr)

        let captainIds = membersToArray(captain, interaction)
        const memberIds = membersToArray(members, interaction);

        if (!memberIds.length) throw new InvalidInputError("Please use @username format", 'members', members);
        if (!captainIds.length) captainIds = [memberIds[0]]
        
        
        // Verification --------------------------------------------------------------------------------------------------------
        const verifEmbed = new Discord.MessageEmbed()
            .setThumbnail(process.env.KOKOT_MIGO)
            .setAuthor({name: interaction.member.user.username, iconURL: interaction.member.displayAvatarURL()}) 
            .setURL(interaction.url)
            .setColor('#24bdb8')
            .setTitle("Rooms request")
            .setDescription(`${tour} (${abr})`)

        if (members) verifEmbed.addField("Team Members", members);
        if (proofAtch) verifEmbed.setImage(proofAtch.url);
        if (proofLink) verifEmbed.addField("Proof link", proofLink);
        
        await AdminVerif(interaction, verifEmbed)


        // Role Assignement ----------------------------------------------------------------------------------------------------
        const newRole = await interaction.guild.roles.create({
            name: abr.toUpperCase(),
            position: 5,
            mentionable: true,
            color: Math.floor(Math.random() * (0xffffff + 1)),
            hoist: true
        })

        for (const id of memberIds) {
            interaction.guild.members.cache.get(id).roles.add(newRole);
        }


        // Room Creation -------------------------------------------------------------------------------------------------------
        const category = await interaction.guild.channels.create(tour, {type: 'GUILD_CATEGORY'});
        const catChannels = [];

        
        for (const title of ["announcements", "links", "general", "scores", "lobbies", "voice"]) {
            let chanType, perms;

            if (title == "announcements" || title == "links") perms = new Discord.Permissions(PERMS_READ_ONLY);
            else perms = new Discord.Permissions(PERMS_FULL_ACCESS);

            if (title == "voice") chanType = 'GUILD_VOICE';
            else chanType = 'GUILD_TEXT';

            let chan = await interaction.guild.channels.create(`${abr}-${title}`, {parent: category, type: chanType})
            
            catChannels.push(chan.id);
            chan.permissionOverwrites.edit(newRole, perms.serialize());
            chan.permissionOverwrites.edit(interaction.guild.roles.everyone, new Discord.Permissions(PERMS_NO_ACCESS).serialize());

            for (const id of captainIds) {
                chan.permissionOverwrites.edit(id, new Discord.Permissions(PERMS_FULL_ACCESS).serialize())
            }
        }
 
        const channelDb = await db(interaction.guild)
        const channelCol = await channelDb.collection('Channels')

        channelCol.insertOne({
            category: category.id,
            categoryName: category.name,
            channels: catChannels,
        })
    }
}