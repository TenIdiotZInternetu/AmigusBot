const Discord = require('discord.js');
const APP = require('./index.js');
const { Markdown } = require('./utils/Markdown.js');

const errEmbedThumbnail = 'https://cdn.discordapp.com/attachments/742123756679331910/1005162710582956093/yikes.jpg';

class KnownError extends Error {
    constructor(message, title='', description='') {
        super(message);
        this.name = "KnownError";
        this.isKnown = true;

        this.title = title;          // unique for each error type
        this.description = description;    // ^
    }

    createEmbed(errEmbed) {
        errEmbed
            .setColor(APP.WarningColor)
            .setTitle(this.title)
            .setDescription(this.description)
    }
}


class UnknownError extends Error {
    constructor(message) {
        super(message);
        this.name = "UnknownError";
        this.message = message;
    }
    
    static alert(errEmbed, err, inter) {
        errEmbed
            .setColor(APP.ErrorColor)
            .setTitle("An unknown error has occured")
            .setDescription("Please contact **@TenIdiotZInternetu#8151**")
    
        APP.Client.users.fetch(process.env.TIZI_ID)
            .then(tizi => tizi.send(Markdown(
                `${err.name}: ${err.message} \n\
                ${err.cause} \n\n\
                StackTrace: \n\n\
                ${err.stack} \n\
                =============================================================== \n\n\
                Encountered in ${inter.guild.name} (id: ${inter.guild.id}) \n\
                Interaction ${inter.commandName} \n\
                created by ${inter.user.username} (id: ${inter.user.id}) \n\
                in the channel #${inter.channel.name} (id: ${inter.channelId}) \n\n\
                ${inter.createdAt}`.replaceAll('                ', ''), 'c'
            )))
    }
}


class InstanceLimitError extends KnownError {
    constructor(message, instance='', limit='') {
        super(message);
        this.name = "InstanceLimitError";

        this.title = message;
        this.description = `Cannot create more instances of ${instance} than its limit (${limit})`;
        if (!instance || !limit) this.description = '';
    }
}


class DependencyMissingError extends KnownError {
    constructor(message, instance='', instruction='') {
        super(message);
        this.name = "InstanceUndefinedError";

        this.title = message;
        this.description = `Cannot proceed without ${instance}. Please, ${instruction}`
    }
}


class InvalidInputError extends KnownError {
    constructor(message, parameter='', argument='') {
        super(message);
        this.name = "InvalidInputError";

        this.title = `"${argument}" is not a valid *${parameter}* input`;
        this.description = message;
        if (!argument || !parameter) this.title = 'Invalid input';
    }
}


class RequestDeniedError extends KnownError {
    constructor(message="Your request has been denied by the verifiers") {
        super(message);
        this.name = 'RequestDeniedError';

        this.title = message;
        this.description = '';
    }
}


module.exports = {
    UnknownError,
    InstanceLimitError,
    DependencyMissingError,
    InvalidInputError,
    RequestDeniedError,

    alert(err, inter) {
        const errEmbed = new Discord.MessageEmbed()
            .setThumbnail(errEmbedThumbnail)
        
        if (!err.isKnown) UnknownError.alert(errEmbed, err, inter);
        else err.createEmbed(errEmbed);

        inter.editReply({embeds: [errEmbed], ephemeral: true});
    },
}


