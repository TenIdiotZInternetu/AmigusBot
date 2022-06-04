const Discord = require('discord.js')

module.exports = {
    name: "requestroom",
    description: "",
    async execute(message=null, args=[]) {
        if (args[0]) { const tournament = args[0].replaceAll('_', ' '); }
        if (args[1]) { const abr = args[1].toLowerCase(); }
        if (args[2]) { const proof = args[2]; }
        
        verif = await require('../events/adminVerif.js').execute();
        if (!verif) return;

        const category = await message.guild.channels.create(tournament, {type: 'GUILD_CATEGORY'});
        const catChannels = [];

        ['announcements', 'links', 'general', 'scores', 'lobbies', 'voice'].forEach( title => {
            let catType = 'GUILD_TEXT';
            if (title == 'voice') catType = 'GUILD_VOICE';

            message.guild.channels.create(`${abr}-${title}`, {parent: category, type: catType})
                .then(chan => catChannels.push(chan.id))
                .catch(err => console.error(err));
        })

        global.cachedChannels.set(category.id, catChannels); 

        const embed = new Discord.MessageEmbed()
            .setThumbnail('https://media.discordapp.net/attachments/742124770040217651/957699743155388476/kokotmigo.gif')
            .setTitle("Your request has been sent")
            .setColor("#3ba55c")
            .setAuthor({name: message.member.user.username, iconURL: message.member.avatarURL()});

        message.channel.send({embeds: [embed]});
    }
}