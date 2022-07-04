const Discord = require('discord.js');
const { resolve } = require('path');
const APP = require('../appGlobals.js')


module.exports = {
    name: "adminVerif",
    description: "Creates embed for actions requiring admin verification",
    once: false,

    async execute(interaction, questionEmbed) {
        if (interaction.member.permissions.has('ADMINISTRATOR')) return true;
        

        // Interaction Creation -----------------------------------------------------------------------------------------------------------
        const embed = new Discord.MessageEmbed()
            .setThumbnail(process.env.KOKOT_MIGO)
            .setTitle("Your request has been sent for verification")
            .setColor('#3ba55c')
            .setAuthor({name: interaction.member.user.username, iconURL: interaction.member.displayAvatarURL()});

        interaction.reply({embeds: [embed], ephemeral: true});

        const row = new Discord.MessageActionRow()
            .addComponents(
                new Discord.MessageButton()
                    .setCustomId('verifApprove')
                    .setLabel("Verify")
                    .setStyle('SUCCESS'),
                new Discord.MessageButton()
                    .setCustomId('verifIgnore')
                    .setLabel("Ignore")
                    .setStyle('DANGER')
            )

        const verifChannel = APP.Client.channels.cache.get(process.env.VERIF_CHANNEL_ID);
        const verifMessage = await verifChannel.send({ embeds: [questionEmbed], components: [row] });


        // Interaction Resolution --------------------------------------------------------------------------------------------------------
        const collector = verifMessage.createMessageComponentCollector({max: 1});
        let answer;

        answer = await new Promise(resolve => collector.on('collect', async bi => {
            if (bi.customId === 'verifApprove') {
                questionEmbed.setTitle(`${questionEmbed.title} - APPROVED`);
                questionEmbed.setColor('#3ba55c');
                bi.update({ embeds: [questionEmbed], components: []});
                resolve(true);
            }

            if (bi.customId === 'verifIgnore') {
                questionEmbed.setTitle(`${questionEmbed.title} - IGNORED`);
                questionEmbed.setColor('#ed4245');
                bi.update({ embeds: [questionEmbed], components: []});
                resolve(false);
            }
        }))

        return answer;
    }
}