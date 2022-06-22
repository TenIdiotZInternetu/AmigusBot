const Discord = require('discord.js');
const APP = require('../appGlobals.js');

const rounds = ["qualifs", "groups", "ro128", "ro64", "ro32", "ro16", "quarters",
                "semis", "finals", "gfinals"];

const roundsFull = ["Qualifiers", "Group Stage", "Round of 128", "Round of 64", "Round of 32", "Round of 16",
                    "Quarterfinals", "Semifinals", "Finals", "Grand Finals"];

const roundOptions = []

for (let i = 0; i < 10; i++) {
    let prefix = "Have you won all your matches in the "
    let suffix = "? (+1)"

    if (i < 2) prefix = "Did you pass the ";
    if (i === 7) suffix = "? (+2)";
    if (i === 8) suffix = "? (+3)";
    if (i === 9) suffix = ", winning the tournament? (+5)"

    roundOptions.push({
        name: rounds[i],
        description: prefix + roundsFull[i] + suffix,
        type: 'BOOLEAN',
        required: false,
    })
}

module.exports = {
    name: "hof-promote",
    slash: true,

    create() {
        APP.CommandManager.create({
            name: "hof-promote",
            description: "Register your tournament achievements to earn points and appear in the hall of fame",
            options: [{
                    name: "tourney",
                    description: "Name of the tournament",
                    type: 'STRING',
                    required: true,
                }].concat(roundOptions, [{
                    name: "badged",
                    description: "Is the tournament badged?",
                    type: 'BOOLEAN',
                    required: false,
                },{
                    name: "proof",
                    description: "Link to a sheet with your match results",
                    type: 'STRING',
                    required: false,
                },{
                    name: "members",
                    description: "Names of you and your teammates, use @",
                    type: 'STRING',
                    required: false,
                },{
                    name: "binary",
                    description: "Won rounds in a binary format (10 digits)",
                    type: 'STRING',
                    required: false,
                }
            ])
        })
    },

    async execute(interaction) {
        const opts = interaction.options;

        const tour = opts.getString("tourney", true);
        const isBadged = opts.getBoolean("badged", false);
        const proofLink = opts.getString("proof", false);
        const members = opts.getString("members", false);
        const bin = opts.getString("binary", false)
        const memberIds = [];


        // Points Calculation --------------------------------------------------------------------------------------------------
        let pointsBin = '';

        for (const round of rounds) {
            if (opts.getBoolean(round)) pointsBin += '1';
            if (!opts.getBoolean(round)) pointsBin += '0';
        }

        if (bin) {
            if (bin.length != 10) {
                interaction.channel.send("Binary not in correct format, skipping this step");
            }

            if (bin.length == 10) pointsBin = bin;
        }

        let points = 0;

        for (let i = 0; i < 7; i++) {
            points += parseInt(pointsBin[i]);
        }
        
        points += parseInt(pointsBin[7]) * 2;
        points += parseInt(pointsBin[8]) * 3;
        points += parseInt(pointsBin[9]) * 5;

        if (isBadged) points++;


        // Latest Reached Stage ------------------------------------------------------------------------------------------------
        if (pointsBin[9] === '1') {
            const lastStage = "Beyond";
        }

        for (let i = 8; i >= 2 && !lastStage; i--) {
            if (pointsBin[i] = '1') {
                const lastStage = roundsFull[i + 1]
                break;
            }
        }

        if (!lastStage) {
            const lastStage = "Qualified";
        }
        

        // Verification --------------------------------------------------------------------------------------------------------
        const verifEmbed = new Discord.MessageEmbed()
            .setThumbnail(process.env.KOKOT_MIGO)
            .setAuthor({name: interaction.member.user.username, iconURL: interaction.member.displayAvatarURL()}) 
            .setURL(interaction.url)
            .setColor('#24bdb8')
            .setTitle("Promotion request")
            .setDescription(`${tour} (${points} points)`)

        if (members) {
            verifEmbed.addField("Team Members", members)

            for (const id of members.matchAll(/<@!(\d*)>/g)) {
                memberIds.push(id[1]);
            }
        }

        if (proofLink) verifEmbed.addField("Proof link", proofLink);
        
        verif = await require('../events/adminVerif.js').execute(interaction, verifEmbed);
        if (!verif) return;
    }
}