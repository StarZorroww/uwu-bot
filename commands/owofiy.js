const util = require("../util/utils.js")
const owo = require('owofy');

exports.info = {
	name: "owofiy",
    properName: "owofiy",
	args: "<message>",
	example: "Banana!",
	description: "weebifies a fucking message.",
	allowed: "",
    aliases: ["owo", "uwu", "owothis", "uwuthis"],
	category: "Fun"
}

exports.run = async (settings, client, message, args) => {
	switch (args.length) {
		case 0: {
			return message.channel.send(util.helpMenu(client, this.info));
		}
		default: {
			let owothis = "";
			for (let i = 0; i < args.length; i++) {
				const user = getMention(args[i]);
				if (args[i].startsWith("@") && args[i].length != 1) {
					owothis += `\`${args[i]}\` `
				} else if (user) {
					owothis += `\`@${user.username}\` `
				} else {
					owothis += owo(args[i]) + " "
				}
			}
			owothis = owothis.trim();

			message.channel.send(owothis)
		}
	}

	function getMention(mention) {
		if (!mention) return;
	
		if (mention.startsWith('<@') && mention.endsWith('>')) {
			mention = mention.slice(2, -1);
	
			if (mention.startsWith('!')) {
				mention = mention.slice(1);
			}
	
			return client.users.cache.get(mention);
		}
	}
}