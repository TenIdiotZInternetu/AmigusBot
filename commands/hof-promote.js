const Discord = require('discord.js');
const APP = require('../appGlobals.js');
const Utils = require('../utils.js');
const Mongo = require('../dbGlobals');

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

    async create() {
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
                    name: "placement",
                    description: "Your final placement in the tournament",
                    type: 'NUMBER',
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
        const placement = opts.getNumber("placement", false);

        const memberIds = Utils.membersToArray(members, interaction)

        // Points Calculation --------------------------------------------------------------------------------------------------
        let pointsBin = '';

        for (const round of rounds) {
            if (opts.getBoolean(round)) pointsBin += '1';
            if (!opts.getBoolean(round)) pointsBin += '0';
        }

        if (bin) {
            if (bin.length != 10) {
                interaction.reply("Binary not in correct format, skipping this step");
            }

            if (bin.length == 10) pointsBin = bin;
        }

        let earnedPoints = 0;

        for (let i = 0; i < 7; i++) {
            earnedPoints += parseInt(pointsBin[i]);
        }
        
        earnedPoints += parseInt(pointsBin[7]) * 2;
        earnedPoints += parseInt(pointsBin[8]) * 3;
        earnedPoints += parseInt(pointsBin[9]) * 5;

        if (isBadged) earnedPoints++;


        // Latest Reached Stage ------------------------------------------------------------------------------------------------
        let lastStage = '';

        for (let i = 9; i >= 2; i--) {
            if (pointsBin[i] === '1') {
                lastStage = roundsFull[i];
                break;
            }
        }


        // Placement -----------------------------------------------------------------------------------------------------------
        let placementString = '';

        if (placement) {
            if (placement === 1) placementString = "1st place";
            if (placement === 2) placementString = "2nd place";
            if (placement === 3) placementString = "3rd place";
            if (placement > 3) placementString = `top ${placement}`;
        }
        

        // Verification --------------------------------------------------------------------------------------------------------
        const verifEmbed = new Discord.MessageEmbed()
            .setThumbnail(process.env.KOKOT_MIGO)
            .setAuthor({name: interaction.member.user.username, iconURL: interaction.member.displayAvatarURL()}) 
            .setURL(interaction.url)
            .setColor('#24bdb8')
            .setTitle("Promotion request")
            .setDescription(`${tour} - ${lastStage} (${earnedPoints} points)`)
            .addField("Rounds", pointsBin);

        if (members) verifEmbed.addField("Team Members", members);
        if (placementString) verifEmbed.addField("Placement", placementString);
        if (proofLink) verifEmbed.addField("Proof link", proofLink);
        if (isBadged) verifEmbed.addField("Badged?", 'badged!');
        
        verif = await require('../events/adminVerif.js').execute(interaction, verifEmbed);
        if (!verif) return;

        // Database Insert -----------------------------------------------------------------------------------------------------
        const hofCol = await Mongo.HOF;
        const tourEntry = {
            title: tour,
            lastWonStage: lastStage,
            pointsEarned: earnedPoints,
            members: memberIds,
            placement: placementString,
            isBadged: isBadged
        }

        for (const memberId of memberIds) {
            const doc = await hofCol.findOne({memberId: memberId})
            let badges = 0

            if (isBadged && parseInt(pointsBin[9])) badges++;

            // Insert new document if it doesn't already exist
            if (!doc) {
                hofCol.insertOne({
                    memberId: memberId,
                    totalPoints: earnedPoints,
                    badges: badges,
                    tournamentList: [tourEntry]
                });

                continue;
            }

            // Update existing document
            const updateDoc = { 
                $set: {
                    totalPoints: doc.totalPoints + earnedPoints,
                    badges: doc.badges + badges,
                },
                $push: {
                    "tournamentList": tourEntry,
                },
                isUpdated: true,
            }

            hofCol.updateOne({memberId: memberId}, updateDoc)
        }
    }
}