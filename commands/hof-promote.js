const Discord = require('discord.js');
const APP = require('../appGlobals.js')

const rounds = ["qualifs", "groups", "ro128", "ro64", "ro32", "ro16", "quarters",
                "semis", "finals", "gfinals"]

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
                },{
                    name: rounds[0],
                    description: "Did you pass the Qualifiers? (+1)",
                    type: 'BOOLEAN',
                    required: true,
                },{
                    name: rounds[1],
                    description: "Did you pass the Group Stage? (+1)",
                    type: 'BOOLEAN',
                    required: false,
                },{
                    name: rounds[2],
                    description: "Have you won all your matches in the Round of 128? (+1)",
                    type: 'BOOLEAN',
                    required: false,
                },{
                    name: rounds[3],
                    description: "Have you won all your matches in the Round of 64? (+1)",
                    type: 'BOOLEAN',
                    required: false,
                },{
                    name: rounds[4],
                    description: "Have you won all your matches in the Round of 32? (+1)",
                    type: 'BOOLEAN',
                    required: false,
                },{
                    name: rounds[5],
                    description: "Have you won all your matches in the Round of 16? (+1)",
                    type: 'BOOLEAN',
                    required: false,
                },{
                    name: rounds[6],
                    description: "Have you won all your matches in the Quarterfinals? (+1)",
                    type: 'BOOLEAN',
                    required: false,
                },{
                    name: rounds[7],
                    description: "Have you won all your matches in the Semifinals? (+2)",
                    type: 'BOOLEAN',
                    required: false,
                },{
                    name: rounds[8],
                    description: "Have you won all your matches in the Finals? (+3)",
                    type: 'BOOLEAN',
                    required: false,
                },{
                    name: rounds[9],
                    description: "Have you won all your matches in the Grand Finals, winning the tournament? (+5)",
                    type: 'BOOLEAN',
                    required: false,
                },{
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
                    name: "date",
                    description: "Date of your last match in the tournament (mm-yyyy)",
                    type: 'STRING',
                    required: false,
                },{
                    name: "binary",
                    description: "Won rounds in a binary format (10 digits)",
                    type: 'STRING',
                    required: false,
                }
            ]
        })
    },

    async execute(interaction) {
        const opts = interaction.options;

        const tour = opts.getString("tourney", true);
        const isBadged = opts.getBoolean("badged", false);
        const proofLink = opts.getString("proof", false);
        const members = opts.getString("members", false);
        const date = opts.getString("date", false);
        const bin = opts.getString("binary")
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