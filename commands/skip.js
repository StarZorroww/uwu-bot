const util = require("../util/utils.js")

let roleName = "dj-uwu";

exports.info = {
	name: "skip",
    properName: "Skip",
	args: "",
	example: "",
	description: "Skips the current playing song.",
	allowed: "",
    aliases: ["s", "voteskip"],
	category: "Music"
}

exports.run = async (settings, client, message, args) => {
    let guildID = message.channel.guild.id;

    if (!message.member.voice.channel) {
        message.channel.send("join a voice channel retard")
        return;
    }

    if (client.musicQueue[guildID] === undefined) {
        message.channel.send("this guild has not played any music yet")
        return;
    }
    if (client.musicQueue[guildID].length === 0) {
        message.channel.send("there are no songs in the queue retarded baka")
        return;
    }

    if (client.voice.connections.filter(vConnection => vConnection.channel.guild.id === guildID).first() === undefined) {
        message.channel.send("the bot isn't even in any voice channels idiot")
        return;
    }

    if (client.voice.connections.filter(vConnection => vConnection.channel.guild.id === guildID).first().channel !== message.member.voice.channel) {
        message.channel.send("you aren't even in the same voice channel :joy:")
        return;
    }

    if (client.voters[guildID].find(id => id === message.member.id)) {
        message.channel.send("you already voted to skip");
        return;
    }

    let role = message.guild.roles.cache.some(x => x.name === roleName);
    const voiceChannel = message.member.voice.channel;
    const voiceSize = voiceChannel.members.size;
    const target = message.guild.members.cache.get(message.member.id);

    if (message.member.hasPermission("ADMINISTRATOR")) {
        let connection = client.voice.connections.filter(vConnection => vConnection.channel.guild.id === guildID).first();
        let currentSong = client.musicQueueInfo[guildID][0];
        util.skipQueueSong(currentSong, message.channel, connection);

        return;
    }

    if (voiceSize <= 3) {
        let connection = client.voice.connections.filter(vConnection => vConnection.channel.guild.id === guildID).first();
        let currentSong = client.musicQueueInfo[guildID][0];
        util.skipQueueSong(currentSong, message.channel, connection);

        return;
    }

    const skipAmount = (voiceSize >= 4) ? voiceSize - 2 : voiceSize - 1;
    if (!(client.voters[guildID].length >= skipAmount)) {
        if (role) {
            if (!target.roles.cache.find(x => x.name === roleName)) {
                client.voters[guildID].push(message.member.id);
                message.channel.send(message.author.username + " has voted to skip " + client.voters[guildID].length + "/" + skipAmount);
                return;
            } else {
                let connection = client.voice.connections.filter(vConnection => vConnection.channel.guild.id === guildID).first();
                let currentSong = client.musicQueueInfo[guildID][0];
                util.skipQueueSong(currentSong, message.channel, connection);
        
                return;
            }
        } else {
            client.voters[guildID].push(message.member.id);
            message.channel.send(message.author.username + " has voted to skip " + client.voters[guildID].length + "/" + skipAmount);
            return;
        }

    } else {
        let connection = client.voice.connections.filter(vConnection => vConnection.channel.guild.id === guildID).first();
        let currentSong = client.musicQueueInfo[guildID][0];
        util.skipQueueSong(currentSong, message.channel, connection);
    }
}
