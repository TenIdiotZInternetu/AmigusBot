const Discord = require('discord.js');
const APP = require('../index.js');
const { RequestDeniedError } = require('../errors.js');
const { requestApproved } = require('../success.js');
const { alert } = require('../errors.js');



module.exports = {
    name: "adminVerif",
    description: "Creates embed for actions requiring admin verification",
    once: false,

    async execute(interaction, questionEmbed) {
        // if (interaction.member.permissions.has('ADMINISTRATOR')) {
        //     interaction.editReply({embeds: [requestApproved()], ephemeral: true})
        //         .catch(err => alert(err, interaction))
                
        //     return;
        // };
        

        // Interaction Creation -----------------------------------------------------------------------------------------------------------
        const embed = new Discord.MessageEmbed()
            .setThumbnail(process.env.KOKOT_MIGO)
            .setTitle("Your request has been sent for verification")
            .setColor('#3ba55c')
            .setAuthor({name: interaction.member.user.username, iconURL: interaction.member.displayAvatarURL()});

        interaction.editReply({embeds: [embed], ephemeral: true})
            .catch(err => alert(err, interaction))


        const buttonRow = new Discord.MessageActionRow()
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
        const verifMessage = await verifChannel.send({ embeds: [questionEmbed], components: [buttonRow] });


        // Interaction Resolution --------------------------------------------------------------------------------------------------------
        const collector = verifMessage.createMessageComponentCollector({max: 1});

        await new Promise((resolve, reject) => collector.on('collect', async bi => {
            if (bi.customId === 'verifApprove') {
                questionEmbed.setTitle(`${questionEmbed.title} - APPROVED`);
                questionEmbed.setColor(APP.SuccessColor);
                bi.update({ embeds: [questionEmbed], components: []});
                resolve();
            }

            if (bi.customId === 'verifIgnore') {
                questionEmbed.setTitle(`${questionEmbed.title} - IGNORED`);
                questionEmbed.setColor(APP.ErrorColor);
                bi.update({ embeds: [questionEmbed], components: []});
                reject();
            }
        }))
        .then(
            () => { interaction.editReply({embeds: [requestApproved()], ephemeral: true}); },
            () => { throw new RequestDeniedError(); }
        )
        .catch(err => alert(err, interaction))
    }
}