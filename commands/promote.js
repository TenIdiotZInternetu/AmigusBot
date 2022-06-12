const Discord = require('discord.js');
const APP = require('../appGlobals.js')

const roundPointsChoices = [
    {name: "Qualifiers", value: 1},
    {name: "Group Stage", value: 1},
    {name: "Round of 128", value: 1},
    {name: "Round of 64", value: 1},
    {name: "Round of 32", value: 1},
    {name: "Round of 16", value: 1},
    {name: "Quarterfinals", value: 1},
    {name: "Semifinals", value: 2},
    {name: "Finals", value: 3},
    {name: "Grand Finals", value: 5},
]

module.exports = {
    name: "promote",
    slash: true,

    create() {
        APP.CommandManager.create({
            name: "promote",
            description: "Register your tournament achievements to earn points and appear in the hall of fame",
            options: [{
                    name: "tourney",
                    description: "Name of the tournament",
                    type: 'STRING',
                    required: true,
                },{
                    name: "last-round-won",
                    description: "The last stage in which you emerged victorious",
                    type: 'NUMBER',
                    required: true,
                    choices: roundPointsChoices
                },{
                    name: "rounds-total",
                    description: "Total amount of rounds in the entire tournament \r\n(from the aformentioned choices)",
                    type: 'NUMBER',
                    required: true,
                },{
                    name: "badged",
                    description: "Is the tournament badged?",
                    type: 'BOOLEAN',
                    required: true,
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
                }
            ]
        })
    },

    execute(interaction) {
        
    }
}