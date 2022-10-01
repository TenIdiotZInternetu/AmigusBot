const Discord = require('discord.js');
const { InstanceLimitError, DependencyMissingError} = require('../errors.js');
const APP = require('../index.js');
const { pointsToRole, membersIdsToString } = require('../utils/memberFormatting.js');
const { newHofMessage } = require('../utils/hofUtils.js');
const { Markdown: m } = require('../utils/Markdown.js');


function createFields(hofDoc) {
    let tourVal = placeVal = ptsVal = "";

    for (const tour of hofDoc.tournamentList) {
        const badge = tour.isBadged && tour.lastWonStage === "Grand Finals" ? "+ BADGED" : "";
        let members = tour.members.filter(id => id !== hofDoc.memberId)
        members = membersIdsToString(members, interaction);

        tourVal += m(tour.title, 'bq') + '\n' + m('** **', 'q')
        if (members) tourVal += `with ${members}`
        tourVal += '\n\n'

        placeVal += tour.lastWonStage + '\n' + tour.placement + '\n\n'
        ptsVal += tour.pointsEarned + '\n' + badge + '\n\n'
    }

    return [
        {name: m("Tournament", 'bu'), value: tourVal, inline: true},
        {name: m("Placement", 'b'), value: placeVal, inline: true},
        {name: m("Points", ''), value: ptsVal, inline: true},
    ];
}

module.exports = {
    name: "hof-update",
    slash: true,

    getMetadata() {
        return {
            name: "hof-update",
            description: "Updates the Hall of Fame with the most recent data"
        }
    },

    async execute(interaction) {
        const singles = await Mongo.SINGLETONS.findOne({hofChannelId: {$exists: true}});

        if (!singles) {
            throw new DependencyMissingError(
                "The Hall of Fame channel doesn't exist",
                "#hall-of-fame",
                "create it using */hof-create* first"
            )
        }

        // Query searches ------------------------------------------------------------------------------
        const {hofChannel, hofMessages, hofEntries, mesCount, hofCount} = await (async () => {
            const chan = interaction.guild.channels.cache.get(singles.hofChannelId);
            const mess = Mongo.HOF_MESSAGES.find()
                .sort({dateCreated: 1})
                .project({messageId: 1, _id: 0})
                .toArray();
            const docs = Mongo.HOF.find()
                .sort({badges: -1, totalPoints: -1})
                .toArray();
            const mesCount = Mongo.HOF_MESSAGES.countDocuments()
            const hofCount = Mongo.HOF.countDocuments()

            return {
                hofChannel: await chan,
                hofMessages: await mess,
                hofEntries: await docs,
                mesCount: await mesCount,
                hofCount: await hofCount
            }
        })();
            
        let rank = 0;
        let messageRank = 0; 
        let message = await hofChannel.messages.fetch(hofMessages[messageRank].messageId);
        let newEmbeds = []

        // Embed creation ------------------------------------------------------------------------------
        for (const entry of hofEntries) {
            const member = interaction.guild.members.cache.get(entry.memberId);
            const role = pointsToRole(entry.totalPoints);
            let nextRoleDesc;

            if (role.level < 7) {
                const pointsToRankup = APP.RANKS[role.level+1].reqPoints - entry.totalPoints
                const nextRole = APP.RANKS[role.level+1].name
                nextRoleDesc = `Earn ${m(`${pointsToRankup} more points`, 'i')} to gain the role ${m(nextRole, 'u')}`
            } else {
                nextRoleDesc = "You already achieved the highest role. Congrutalations! Now touch grass."
            }
            

            let badgeSuffix = "";
            if (entry.badges == 1) badgeSuffix = "- 1 BADGE";
            if (entry.badges > 1) badgeSuffix = `- ${entry.badges} BADGES`;

            newEmbeds.push(
                new Discord.MessageEmbed()
                    .setThumbnail(member.displayAvatarURL())
                    .setColor(role.color)
                    .setTitle(m(`#${rank + 1} ${member.displayName} ${badgeSuffix}`, 'bu') + '\n')
                    .setDescription(
                        m(`${entry.totalPoints} points`, 'b') + " => " + m(role.name, 'b') + 
                        ` \n ${nextRoleDesc} \n** **.\n`
                    )
                    .addFields(createFields(entry))
            )

            rank++;
            
            // Message edit and swap --------------------------------------------------------------------
            if (rank % 10 == 0 || rank == hofCount) {
                message.edit({embeds: newEmbeds})
                messageRank++;

                if (messageRank > mesCount) {
                    message = newHofMessage(Mongo, hofChannel)
                    continue
                }

                message = await hofChannel.messages.fetch(hofMessages[messageRank].messageId)
                newEmbeds = message.embeds
            }
        }
    }
}