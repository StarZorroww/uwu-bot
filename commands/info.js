const { MessageEmbed } = require('discord.js');

exports.info = {
	name: "info",
	properName: "Info",
	args: "",
	example: "",
	description: "Information about the bot",
	allowed: "",
    aliases: ["botinfo", "i"],
	category: "Info"
}

exports.run = async (settings, client, message, args) => {
	var n = message.author.username;
	var a = message.author.avatarURL();

	let msgembed = new MessageEmbed()
		.setTitle(`${settings.botName} | developer`)
		.setURL("https://github.com/StarZorroww")
		.setAuthor(n, a, '')
		.setDescription(`\`starzorrow#7208\` is the developer of \`${settings.botName}\`.\nstarzorrow is a \`coomer\` and ` +
		`an \`osu player\`\n**socials**:\nyoutube: *[starzorrow yt](https://www.youtube.com/starzorrow)*\ntwitter:` +
		` *[starzorrow twt](https://www.twitter.com/starzorrowffs)*\ntwitch: *[starzorrow twitch](https://www.twitch.tv/starzorroww)*`)
	
	message.channel.send(msgembed);
}
