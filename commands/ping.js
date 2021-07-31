exports.info = {
	name: "ping",
    properName: "Ping",
	args: "",
	example: "",
	description: "Check the bots ping.",
	allowed: "",
    aliases: ["latency", "ms"],
	category: "Utility"
}

exports.run = async (settings, client, message, args) => {
    message.channel.send("pinging... ").then(msg => {
        msg.edit("ping pong: " + Math.floor(msg.createdAt - message.createdAt) + "ms")
    })

}
