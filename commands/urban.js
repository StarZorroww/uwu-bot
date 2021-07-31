const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch')
const util = require("../util/utils.js")

exports.info = {
	name: "urban",
	properName: "Urban",
	args: "<search term>",
	example: "sussy baka",
	description: "Check the definition of a term from urban dictionary. cough lan-anh cough",
	allowed: "",
    aliases: ["definition", "define", "def", "ur"],
	category: "Info"
}

exports.run = async (settings, client, message, args) => {
    if (!message.author.bot) {
		if (message.member && !message.member.hasPermission("ADMINISTRATOR")) {
			if (message.author.id != 732554138801405953) {
				message.channel.send("you're not starzorrow, fuck off retard")
				return;
			}
		}
	}

    var n = message.author.username;
	var a = message.author.avatarURL();

	switch (args.length) {
		case 0: {
			return message.channel.send(util.helpMenu(client, this.info));
		}

		default: {
			let search = "";

			for (var i = 0; i < args.length; i++) {
				search = search + args[i] + " ";
			}
			search = search.trim();

			try {
				const response = await fetch(`https://api.urbandictionary.com/v0/define?term=${search}`)
				const {list} = await response.json();
				const [def] = list;
				const trim = (str, max) => ((str.length > max) ? `${str.slice(0, max - 3)}...` : str)

				let msgembed = new MessageEmbed()
					.setColor(settings.embedColor)
					.setAuthor(n, a, '')
					.setTitle(`urban dictionary | ${def.word}`)
					.addFields({
						name: 'Definition',
						value: trim(def.definition, 4096) + '\n\n*' + trim(def.example, 4096) + `*\n\n**[${def.word}](${def.permalink}) | published by ${def.author}**`,
						inline: false
					}, {
						name: ':thumbsup:',
						value: `${def.thumbs_up}`,
						inline: true
					}, {
						name: ':thumbsdown:',
						value: `${def.thumbs_down}`,
						inline: true
					})
					.setFooter(`${settings.botName} - ${this.info.name} (do not include the () and <>)`);
				
				message.channel.send(msgembed);
			} catch (error) {
				return message.channel.send(`your dumb search \`${search}\` didn't appear anywhere on urban dictionary :rolling_eyes:`)
			}
		}
	}
}
