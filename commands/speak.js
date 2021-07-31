const util = require("../util/utils.js")
const say = require('say');
const fs = require('fs');
exec = require('child_process').exec;

exports.info = {
	name: "speak",
	properName: "Speak",
	args: "<message>",
	example: "joe mama",
	description: "Make the bot say anything in a voice channel.",
	allowed: "admin",
    aliases: ["tts"],
	category: "Voice-Chat"
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

	if (args.length === 0) {
		return message.channel.send(util.helpMenu(client, this.info));
	}

	if (!message.member.voice.channel) {
		message.channel.send("you aren't even in a voice channel dumb ass :joy:")
		return;
	}

	var guildID = message.channel.guild.id;

	if (client.voice.connections.filter(connection => connection.channel.guild.id === guildID).first() !== undefined) {
		message.channel.send("wait your turn you impatient fuck")
		return;
	}

	var msg = "";
	
	for (var i = 0; i < args.length; i++)
		msg = msg + args[i] + " ";
	
	const timestamp = new Date().getTime();
	const soundPath = `./temp/${timestamp}.wav`;

	tts(message.member.voice.channel, msg, soundPath)
	
	function tts(voiceChannel, text, soundPath) {
		if (!fs.existsSync('./temp')) {
			fs.mkdirSync('./temp');
		}
		say.export(text, null, 1, soundPath, (err) => {
			if (err) {
				console.error(err);
				return;
			}
			else {
				voiceChannel.join().then((connection) => {
					connection.play(soundPath).on('finish', () => {
						connection.disconnect();
					}).on('error', (err) => {
						console.error(err);
						connection.disconnect();
					});
				}).catch((err) => {
					console.error(err);
				});
			}
		});
	}
}