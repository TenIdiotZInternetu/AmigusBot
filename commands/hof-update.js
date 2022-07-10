const Discord = require('discord.js');
const APP = require('../appGlobals.js');
const Utils = require('../utils');


function createFields(hofDoc) {
    let tourVal = placeVal = ptsVal = "";

    for (const tour of hofDoc.tournamentList) {
        const badge = tour.isBadged && tour.lastWonStage === "Grand Finals" ? "+ BADGED" : "";
        const members = tour.members.filter(id => id !== hofDoc.memberId)

        tourVal += tour.title + '\n\t with ' + Utils.membersToString(members) + '\n\n'
        placeVal += tour.lastWonStage + '\n' + tour.placement + '\n\n'
        ptsVal += tour.pointsEarned + '\n' + badge + '\n\n'
    }

    return [
        {name: "Tournament", value: tourVal, inline: true},
        {name: "Placement", value: placeVal, inline: true},
        {name: "Points", value: ptsVal, inline: true},
    ];
}

module.exports = {
    name: "hof-update",
    slash: true,

    async create() {
        APP.CommandManager.create({
            name: "hof-update",
            description: "Updates the Hall of Fame with the most recent data"
        })
    },

    async execute() {
        const Mongo = await require('../dbGlobals');
        const singles = await Mongo.SINGLETONS.findOne({hofChannelId: {$exists: true}});

        if (!singles) {
            console.log("The HOF channel doesn't exist")
            return;
        }

        // Query searches
        const {hofChannel, hofMessages, hofEntries, hofCount} = await (async () => {
            const chan = APP.Guild.channels.cache.get(singles.hofChannelId);
            const mess = Mongo.HOF_MESSAGES.find()
                .sort({dateCreated: 1})
                .project({messageId: 1, _id: 0})
                .toArray();
            const docs = Mongo.HOF.find()
                .sort({badges: -1, totalPoints: -1})
                .toArray();
            const count = Mongo.HOF.countDocuments();

            return {
                hofChannel: await chan,
                hofMessages: await mess,
                hofEntries: await docs,
                hofCount: await count
            }
        })();
            
        let rank = 0;
        let messageRank = 0;
        let tempEmbeds;

        await hofChannel.messages.fetch(hofMessages[messageRank].messageId)
            .then(mess => tempEmbeds = mess.embeds);

        for (const entry of hofEntries) {
            const member = APP.Guild.members.cache.get(entry.memberId);
            const role = Utils.pointsToRole(entry.totalPoints);

            let badgeSuffix = "";
            if (entry.badges == 1) badgeSuffix = "- 1 BADGE";
            if (entry.badges > 1) badgeSuffix = `- ${entry.badges} BADGES`;

            tempEmbeds[rank % 10] = 
                new Discord.MessageEmbed()
                    .setThumbnail(member.displayAvatarURL())
                    .setColor(role.color)
                    .setTitle(`#${rank + 1} ${member.displayName} ${badgeSuffix}`)
                    .setDescription(`${entry.totalPoints} points --> ${role.name}`)
                    .addFields(createFields(entry))

            rank++;
            
            // Message edit and swap
            if ((rank + 1) % 10 == 0 || rank == hofCount) {
                hofChannel.messages.fetch(hofMessages[messageRank].messageId)
                    .then(mess => mess.edit({embeds: tempEmbeds}))
                    
                messageRank++;
                await hofChannel.messages.fetch(hofMessages[messageRank].messageId)
                    .then(mess => tempEmbeds = mess.embeds);
            }
        }
    }
}