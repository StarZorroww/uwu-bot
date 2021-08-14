const { MessageEmbed } = require("discord.js");
const util = require("../util/utils.js")

exports.info = {
	name: "rps",
	properName: "Rock Paper Scissors",
	args: "<move>",
	example: "rock",
	description: "Play rock paper scissors with the bot.",
	allowed: "",
    aliases: ["rockpaperscissors", "scissorspaperrock", "spr"],
	category: "Fun"
}

exports.run = async (settings, client, message, args) => {
	var move;
	var msg;
	var image;

	var n = message.author.username;
	var a = message.author.avatarURL();
	
	if (args.length === 0) {
		return message.channel.send(util.helpMenu(client, this.info));
	}
	
	switch (getRndInteger(0, 3)) {
		case 0:
			move = 0
			image = "https://cdn.discordapp.com/emojis/739361402535542875.png?v=1";
			break;
		
		case 1:
			move = 1
			image = "https://cdn.discordapp.com/emojis/739361822670585926.png?v=1";
			break;
		
		case 2:
			move = 2
			image = "https://www.pinclipart.com/picdir/middle/1-11382_ai-eps-svg-free-clipart-scissors-clipart-png.png";
	}
	
	switch (args[0].toString()) {
		case "rock":
			if (move === 2) {
				msg = "i lost :c"
				break;
			}
			if (move === 0) {
				msg = "we tied >:("
				break;
			}
			msg = "hahaha i won!! brrrrrr"
			break;
		
		case "paper":
			if (move === 0) {
				msg = "i lost :c"
				break;
			}
			if (move === 1) {
				msg = "we tied >:("
				break;
			}
			msg = "hahaha i won!! brrrrrr"
			break;
		
		case "scissors":
			if (move === 1) {
				msg = "i lost :c"
				break;
			}
			if (move === 2) {
				msg = "we tied >:("
				break;
			}
			msg = "hahaha i won!! brrrrrr"
			break;
		
		default:
			msg = "rock paper or scissors, not " + args[0].toString();
			image = "https://mpng.subpng.com/20171218/bd4/question-mark-png-5a381243a27317.0340541615136241316654.jpg";
	}
	
	let msgembed = new MessageEmbed()
		.setColor('#0099ff')
		.setTitle('uwu')
		.setDescription('Rock Paper Scissors: ' + `<@${message.author.id}>`)
		.setThumbnail(image)
		.addField(msg, 'uwu', true)
		.setTimestamp()
		.setFooter(`${settings.botName} - ${this.info.name} (do not include the () and <>)`);
	
    message.channel.send(msgembed)
}

function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min) ) + min;
}