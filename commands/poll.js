const { MessageEmbed } = require("discord.js");
const util = require("../util/utils.js")

exports.info = {
	name: "poll",
	properName: "Poll",
	args: "<question> <answers>",
	example: "funny amogus? A: yes A: no A: shut up nerd",
	description: "Create a poll with auto-generated reactions.",
	allowed: "admin",
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

	if (args.length == 0) {
		return message.channel.send(util.helpMenu(client, this.info));
	}
	
	var msg = "";
	var i;
	
	for (i = 0; i < args.length; i++) {
		msg += args[i] + " ";
	}
	
	var q = msg;
	var qargs = q.split(" A: ");
	
	if (qargs.length - 1 === 0) {
		return message.channel.send(util.helpMenu(client, this.info));
	}
	
	if (qargs.length - 1 === 1) {
		message.channel.send("add more than 1 answer or it's not a fucking poll is it?")
		return;
	}
	
	if (qargs.length - 1 > 10) {
		message.channel.send("you do realise there is only 10 emojis for numbers 1 - 10 right?")
		return;
	}
	
	q = qargs[0];
	
	var r = "";
	
	for (i = 1; i < qargs.length; i++) {
		r += i + " - " + qargs[i] + " \n";
	}
	

	var image = "https://www.qualtrics.com/m/assets/marketplace/wp-content/uploads/2020/03/Quick-Poll.png";
	
	let msgembed = new MessageEmbed()
		.setColor(settings.embedColor)
		.setTitle('Poll: ' + q)
		.setAuthor(n, a, '')
		.setDescription('Poll Responses: ')
		.setThumbnail(image)
		.addField(r, 'Use the reactions to vote on this poll!', false)
		.setTimestamp()
		.setFooter(`${settings.botName} - ${this.info.name} (do not include the () and <>)`);
	
	message.channel.send(msgembed).then(async function (message) {
		for (i = 1; i < qargs.length; i++) {
			if (i === 10) {
				await message.react('🔟')
			} else {
				await message.react(i + '⃣')
			}
		}
	})
}