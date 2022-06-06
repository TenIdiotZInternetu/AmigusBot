const Discord = require('discord.js');
const { resolve } = require('path');
const APP = require('../appGlobals.js')


module.exports = {
    name: "adminVerif",
    description: "Creates embed for actions requiring admin verification",
    once: false,

    async execute(interaction) {
        if (interaction.member.roles.cache.has(process.env.ADMIN_ROLE_ID)) resolve(true);

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

        const question = new Discord.MessageEmbed()
            .setThumbnail(process.env.KOKOT_MIGO)
            .setAuthor({name: interaction.member.user.username, iconURL: interaction.member.displayAvatarURL()}) 
            .setURL(interaction.url)
            .setColor('#24bdb8')
            .setTitle("Rooms request")

        const verifChannel = APP.Client.channels.cache.get(process.env.VERIF_CHANNEL_ID);
        await verifChannel.send({ embeds: [question], components: [row] });

        const collector = verifChannel.createMessageComponentCollector({max: 1});
        let answer;

        answer = await new Promise(resolve => collector.once('collect', async bi => {
            if (bi.customId === 'verifApprove') {
                question.setTitle("Rooms request - APPROVED");
                question.setColor('#3ba55c');
                bi.update({ embeds: [question], components: []});
                resolve(true);
            }

            if (bi.customId === 'verifIgnore') {
                question.setTitle("Rooms request - IGNORED");
                question.setColor('#ed4245');
                bi.update({ embeds: [question], components: []});
                resolve(false);
            }
        }))

        return answer;
    }
}