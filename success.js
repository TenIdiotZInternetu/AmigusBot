const Discord = require('discord.js');
const APP = require('./index.js');


module.exports = {
    requestApproved() {
        return new Discord.MessageEmbed()
            .setColor(APP.SuccessColor)
            .setTitle("Your request has been approved")
            .setThumbnail('https://cdn.discordapp.com/attachments/977547565807579179/1009162234322223115/checkmark.png')
    }
}