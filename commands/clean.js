exports.info = {
	name: "clean",
	properName: "Clean",
	args: "",
	example: "",
	description: "Clean messages from the bot.",
	allowed: "admin",
    aliases: ["c", "cleanup", "clear"],
	category: "Utility"
}

exports.run = async (settings, client, message, args) => {
	let isDev = false;

	if (!message.author.bot) {
		if (message.member && !message.member.hasPermission("ADMINISTRATOR")) {
			for (let ids = 0; ids < settings.developerIDS.length; ids++) {
				if (settings.developerIDS[ids] === message.author.id) {
					isDev = true;
					break;
				}
				console.log(settings.developerIDS[ids])
			}
			if (!isDev) {
				message.channel.send("you're not starzorrow, fuck off retard")
				return;
			}
		}
	}


    var n = message.author.username;
	var a = message.author.avatarURL();

    const collected = await message.channel.messages.fetch({limit: 50})
    const collecteda = collected.filter(msg => msg.author.id == message.client.user.id)

    await message.channel.bulkDelete(collecteda)

}