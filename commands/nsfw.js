const util = require("../util/utils.js")

exports.info = {
	name: "nsfw",
	properName: "NSFW",
	args: "(channel)",
	example: "#nsfw-chat",
	description: "Change the message channels nsfw status.",
	allowed: "admin",
	category: "Management"
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
			}
			if (!isDev) {
				message.channel.send("you can't use this as you are not a permitted user")
				return;
			}
		}
	}


    if (!message.guild.me.hasPermission("ADMINISTRATOR")) {
		if (!message.guild.me.hasPermission("MANAGE_CHANNELS")) {
			message.channel.send("i dont have permission change this channel sped")
			return;
		}
	}

	var n = message.author.username;
	var a = message.author.avatarURL();

	var channel = message.channel.id;
	if (args.length === 1) {
		if (args[0].startsWith("<#") && args[0].endsWith(">")) {
			channel = args[0].slice(2, -1);

			if (channel.startsWith('!')) {
				channel = message.channel.id;
			}
		} else {
			return message.channel.send(util.helpMenu(client, this.info));
		}
	}

	channel = client.channels.cache.get(channel)

    channel.edit({
        nsfw: !channel.nsfw
    })
    var nsfwstatus = "nsfw on"
    if (channel.nsfw) {
        nsfwstatus = "nsfw off"
    }

    channel.send("changed the nsfw setting in " + channel.name + " to: " + nsfwstatus)
}
