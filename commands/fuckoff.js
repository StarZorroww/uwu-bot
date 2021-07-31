const util = require("../util/utils.js")

exports.info = {
	name: "fuckoff",
	properName: "Fuck Off",
	args: "",
	example: "",
	description: "The bot will disconnect from the voice chat.",
	allowed: "",
    aliases: ["disconnect", "leave", "dis", "frickoff", "bye", "goaway"],
	category: "Music"
}

exports.run = async (settings, client, message, args) => {
	var guildID = message.channel.guild.id;
	
	if (!message.member.voice.channel) {
		message.channel.send("join the voice channel you fucking troll")
		return;
	}
	if (client.voice.connections.size === 0) {
		message.channel.send("yup, lets disconnect the bot from a non existant voice channel")
		return;
	}
	await client.voice.connections.filter(connection => connection.channel.guild.id === guildID).first().disconnect()
}
