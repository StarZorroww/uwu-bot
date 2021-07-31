const util = require("../util/utils.js")

exports.info = {
	name: "autism-attack",
	properName: "Autism Attack",
	args: "(channel) <message>",
	example: "#general joe mama",
	description: "Don't question it.",
	allowed: "jack",
    aliases: ["spam", "annoy"],
	category: "Jack"
}

exports.run = async (settings, client, message, args) => {
	let isDev = false;

	if (!message.author.bot) {
		// if (message.member && !message.member.hasPermission("ADMINISTRATOR")) {
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
		// }
	}


	var n = message.author.username;
	var a = message.author.avatarURL();

	if (args.length === 0) {
		return message.channel.send(util.helpMenu(client, this.info));
	}

	var channel = message.channel.id;

	if (args[0].startsWith("<#") && args[0].endsWith(">")) {
		if (args.length === 1) {
			return message.channel.send(util.helpMenu(client, this.info));
		}
		channel = args[0].slice(2, -1);

		if (channel.startsWith('!')) {
			channel = message.channel.id;
		}
	}

	var msg = "";
	var i = 0;

	if (channel !== message.channel.id)
		i = 1;
	
	for (i; i < args.length; i++) {
		msg = msg + args[i] + " ";
	}
	msg = msg.trimEnd();

	for (var repeat = 0; repeat < 20; repeat++) {
		client.channels.cache.get(channel).send(msg)
	}

}