const { MessageEmbed } = require("discord.js");

exports.info = {
	name: "nutcoupon",
	properName: "Nut Coupon",
	args: "",
	example: "",
	description: "Generates a no nut november coupon.",
	allowed: "admin",
    aliases: ["nc"],
	category: "Fun"
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
	var image = "https://i.redd.it/esfheo71u5w31.jpg";
	
	let msgembed = new MessageEmbed()
		.setColor(settings.embedColor)
		.setTitle('nut coupon')
		.setAuthor(n, a, '')
		.setThumbnail(image)
		.addField('no nut november bypass coupon', 'react to the message for 1 free nut coupon', false)
		.setTimestamp()
		.setFooter(`${settings.botName} - ${this.info.name} (do not include the () and <>)`);
	
	message.channel.send(msgembed).then(async function (message) {
		await message.react('🥜');
	})
}