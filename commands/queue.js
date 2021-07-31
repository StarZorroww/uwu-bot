const { MessageEmbed } = require("discord.js");
const util = require("../util/utils.js")

exports.info = {
	name: "queue",
    properName: "Queue",
	args: "",
	example: "",
	description: "Check what song is next in the queue.",
	allowed: "",
    aliases: ["q", "upnext"],
	category: "Music"
}

exports.run = async (settings, client, message, args) => {
    let guildID = message.channel.guild.id;

    if (client.musicQueue[guildID] === undefined) {
        message.channel.send("this guild has not played any music yet")
        return;
    }
    if (client.musicQueue[guildID].length === 0) {
        message.channel.send("there is are no songs in the queue retarded baka")
        return;
    }

    let n = message.author.username;
	let a = message.author.avatarURL();

    let queue = client.musicQueueInfo[guildID];
    let currentSong = queue[0];
    let queueSize = client.musicQueue[guildID].length;
    let limit = queueSize;
    let videoDuration = currentSong.duration;

    let msgembed = new MessageEmbed()
        .setTitle("music queue for " + message.channel.guild.name)
        .setAuthor(n, a, '')
        .addField('currently playing', `[${currentSong.title}](${currentSong.url}) | \`${videoDuration} requested by: ${currentSong.req.tag}\``)
    
    if (queueSize > 1) {
        if (client.musicQueue[guildID].length > 12) {
            limit = 12;
        }
        videoDuration = queue[1].duration;
        msgembed.addField('up next:', `\`1.\` [${queue[1].title}](${queue[1].url}) | \`${videoDuration} requested by: ${queue[1].req.tag}\``)

        let pos = 2;
        for (var i = 2; i < limit; i++) {
            videoDuration = queue[i].duration;
            msgembed.addField('\u200b', `\`${pos++}.\` [${queue[i].title}](${queue[i].url}) | \`${videoDuration} requested by: ${queue[i].req.tag}\``)
        }
        if (limit === 12) {
            let notplural = queueSize - limit === 1;
            let plurala = notplural ? "is" : "are";
            let pluralb = notplural ? "song" : "songs";
            msgembed.addField('\u200b', `There ${plurala} \`${queueSize - limit}\` more ${pluralb} in the queue that ${plurala} not shown.`);
        }
    } else {
        message.channel.send(currentSong.title + " is the last song in the queue")
        return;
    }

    message.channel.send(msgembed);
}
