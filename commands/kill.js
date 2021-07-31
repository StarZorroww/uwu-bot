const { MessageEmbed, MessageAttachment } = require("discord.js");
const path = require("path");
const util = require("../util/utils.js");

exports.info = {
	name: "kill",
	properName: "Kill",
	args: "<name>",
	example: "myself",
	description: "Kill someone lol.",
	allowed: "",
    aliases: ["die"],
	category: "Fun"
}

exports.run = async (settings, client, message, args) => {
	// if (message.author.id != 732554138801405953) {
	// 	message.channel.send("you're not starzorrow, fuck off retard")
	// 	return;
	// }

	var a = message.author.avatarURL;
	var a = message.author.avatarURL();
	var id = message.author.id;

	if (args.length === 0 || args.length !== 1) {
		return message.channel.send(util.helpMenu(client, this.info));
	}
	// var attachment = new MessageAttachment(path.resolve(__dirname, '../images/b5750bfe7505f52fca02d05a085821d301374868_hq.gif'), 'kill.gif')
	var image = "https://giffiles.alphacoders.com/695/69580.gif";
	// var image = 'attachment://kill.gif';
	var msg = " kills " + args[0];

	if (msg === " kills myself" || msg === " kills me" || msg === " kills <@" + id + ">") {
		msg = " killed themself";
	}

	let msgembed = new MessageEmbed()
		.setColor(settings.embedColor)
		.setTitle('')
		.setDescription("*<@" + id + ">" + msg + "*")
		// .attachFiles(attachment)
		.setImage(image)
		.setTimestamp()
		.setFooter(`${settings.botName} - ${this.info.name} (do not include the () and <>)`);
	
	message.channel.send(msgembed)

}