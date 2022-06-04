const APP = require("../appGlobals.js");

module.exports = {
    name: "messageCreate",
    description: "A message was sent",
    once: false,
    async execute(message) {
        const prefix = "$";
        if (!message.content.startsWith(prefix) || message.author.bot) return;

        const comArgs = message.content.slice(prefix.length).split(" ");
        const com = comArgs.shift().toLowerCase();
    
        if (!(Object.keys(APP.commands).includes(com))) APP.commands['invalid'].execute(message);
        else APP.commands[com].execute(message, comArgs);
    }

}