const util = require("../util/utils.js")
const ytdl = require('discord-ytdl-core');

exports.info = {
	name: "join",
	properName: "Join",
	args: "<url> (ffmpeg audio args)",
	example: "https://www.youtube.com/watch?v=dQw4w9WgXcQ atempo=2,volume=5",
	description: "Makes the bot join your current voice channel.",
	allowed: "",
    aliases: ["j", "connect", "summon"],
	category: "Music"
}

exports.run = async function(settings, client, message, args) {
    var n = message.author.username;
	var a = message.author.avatarURL();

    if (args.length === 0) {
        return message.channel.send(util.helpMenu(client, this.info));
	}

	if (!args[0].startsWith("https://")) {
		message.channel.send("imagine not using a url dumb ass")
		return;
	}

	if (!message.member.voice.channel) {
		message.channel.send("you aren't even in a voice channel dumb ass :joy:")
		return;
	}

	let guildID = message.channel.guild.id;

	if (client.voice.connections.filter(vConnection => vConnection.channel.guild.id === guildID).first() !== undefined) {
		if (client.voice.connections.filter(vConnection => vConnection.channel.guild.id === guildID).first().channel === message.member.voice.channel) {
			message.channel.send("imagine trying to make the bot join the same voice channel it's already in")
			return;
		}
		if (client.musicQueue[guildID] !== undefined) {
			if (client.musicQueue[guildID].length !== 0) {
				if (!message.member.hasPermission("ADMINISTRATOR")) {
					message.channel.send("the bot is already playing music in another channel.");
					return;
				}
			} 
		}
	}

	let streamOptions = 'volume=0.5';
	
	if (args.length == 2) {
		if (!args[1].includes('volume=')) {
			if (args[1] !== '') {
				streamOptions = streamOptions + ',' + args[1];
			}
		} else {
			streamOptions = args[1];
		}
	}
	
	let songInfo = null;
	let song = null;
	
	try {
		songInfo = await ytdl.getInfo(args[0]);
		if (!songInfo) return message.channel.send("i can't fucking find whatever the fuck you linked me, sorry not sorry.");

		song = {
			id: songInfo.videoDetails.videoId,
			title: songInfo.videoDetails.title,
			url: songInfo.videoDetails.video_url,
			img: songInfo.player_response.videoDetails.thumbnail.thumbnails[0].url,
			duration: util.secondsToHMSFormatted(songInfo.videoDetails.lengthSeconds),
			ago: songInfo.videoDetails.publishDate,
			views: String(songInfo.videoDetails.viewCount).padStart(10, ''),
			req: message.author
		}

	} catch (error) {
		// console.error(error);
		return message.channel.send("that isn't a valid youtube link you fucking retarded crack addict");
	}

	if (client.musicQueue[guildID] === undefined) {
		util.queueSong(client, message.channel, args[0], streamOptions, song);
		try {
			const voiceConnection = await message.member.voice.channel.join();
			await util.playQueueSong(client, message.channel, voiceConnection, message.member.voice.channel);
		} catch (error) {
			console.error(error);
		}
	} else {
		if (!message.member.hasPermission("ADMINISTRATOR")) {
			message.channel.send("the bot is already playing music in another channel.");
			return;
		}
		await message.member.voice.channel.join();
		if (client.musicQueue[guildID].length === 0) {
			util.queueSong(client, message.channel, args[0], streamOptions, song);
			try {
				const voiceConnection = await message.member.voice.channel.join();
				await util.playQueueSong(client, message.channel, voiceConnection, message.member.voice.channel);
			} catch (error) {
				console.error(error);
			}
		} else {
			util.queueSong(client, message.channel, args[0], streamOptions, song);
		}
	}
}