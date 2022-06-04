module.exports = {
    name: "invalid",
    description: "Executes if entered command couldn't be found",
    execute(message=null, args=[]) {
        message.channel.send("Invalid command!");
    }
}