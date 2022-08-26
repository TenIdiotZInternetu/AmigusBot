const Discord = require('discord.js');

module.exports = {
    async newHofMessage(Mongo, hofChan) {
        mess = await hofChan.send({embeds: [new Discord.MessageEmbed().setDescription('Your future achievements here')]});

        Mongo.HOF_MESSAGES.insertOne({
            messageId: mess.id,
            dateCreated: new Date(),
        })

        return mess;
    },
}