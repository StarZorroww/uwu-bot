const { MessageEmbed } = require("discord.js");
const fs = require('fs');
const path = require('path');
const util = require("../util/utils.js")

exports.info = {
	name: "presence",
	properName: "Presence",
	args: "<check / status-type <1-4> / (new status)>",
	example: "check",
	description: "Check or change the status of the bot.",
	allowed: "jack",
    aliases: ["status"],
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
			}
			if (!isDev) {
				message.channel.send("you can't use this as you are not a permitted user")
				return;
			}
		// }
	}


	var n = message.author.username;
	var a = message.author.avatarURL();
	var newStatus = "";

	switch (args.length) {
		case 0: {
			if (args.length === 0) {
				return message.channel.send(util.helpMenu(client, this.info));
			}
		}
		case 1: {
			if (args[0] == "check") {
				let msgembed = new MessageEmbed()
				.setColor(settings.embedColor)
				.setTitle('Current Presence (Status)')
				.setAuthor(n, a, '')
				.setDescription(settings.status)
				.addField('Change status example: ', '-presence ooga booga', false)
				.setTimestamp()
				.setFooter(`${settings.botName} - ${this.info.name} (do not include the () and <>)`);
				message.channel.send(msgembed)
				return;
			}
			if (args[0] == "status-type") {
				let msgembed = new MessageEmbed()
				.setColor(settings.embedColor)
				.setTitle('Current Type (Status)')
				.setAuthor(n, a, '')
				.setDescription(settings.statusType)
				.addField('Change type example: ', '-presence status-type 3', false)
				.setTimestamp()
				.setFooter(`${settings.botName} - ${this.info.name} (do not include the () and <>)`);
				message.channel.send(msgembed)
				return;
			}
		}
		case 2: {
			if (args[0] == "status-type") {
				if (!Number.isInteger(parseInt(args[1]))) {
					message.channel.send("do you not know what a number is")
					return;
				}
				var type = parseInt(args[1]);
				
				if (type > 4 || type < 1) {
					message.channel.send("1, 2, 3 or 4 dumb ass")
					return;
				}
				
				settings.statusType = type - 1;
				writeToJson(message.channel, path.resolve(__dirname, '../config.json'), type, "statusType")
				return;
			}
		}
		default: {
			for (var i = 0; i < args.length; i++) {
				newStatus = newStatus + args[i] + " ";
			}
			newStatus = newStatus.trimEnd();
			settings.status = newStatus;
			writeToJson(message.channel, path.resolve(__dirname, '../config.json'), newStatus, "status")
		}
	}
}

function writeToJson(channel, path, newData, name) {
	const file = require(path);
	file[name] = newData;
	fs.writeFile(path, JSON.stringify(file, null, 2), function(err) {
		if (err) return console.log(err);
		channel.send("updated " + name + " to: " + newData);
	})
}