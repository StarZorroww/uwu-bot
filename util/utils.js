const { MessageEmbed } = require('discord.js');
const ytdl = require('discord-ytdl-core');
const settings = require('../config.json');

/** 
 * Converts seconds into hours minutes and seconds
*/
module.exports.secondsToHMS = function(d) {
    d = Number(d);
    var h = Math.floor(d / 3600);
    var m = Math.floor(d % 3600 / 60);
    var s = Math.floor(d % 3600 % 60);
    
    var hDisplay = h > 0 ? h + (h == 1 ? " hr" : " hrs") + (m > 0 || s > 0 ? ", ":"") : "";
    var mDisplay = m > 0 ? m + (m == 1 ? " min" : " mins") + (s > 0 ? ", ":"") : "";
    var sDisplay = s > 0 ? s + (s == 1 ? " sec" : " secs") : "";
    
    return hDisplay + mDisplay + sDisplay;
}

/** 
 * Converts seconds into HH:MM:SS
*/
module.exports.secondsToHMSFormatted = function(d) {
    d = Number(d);
    var h = Math.floor(d / 3600);
    var m = Math.floor(d % 3600 / 60);
    var s = Math.floor(d % 3600 % 60);
    
    var hDisplay = h > 0 ? h + ":" : "";
    var mDisplay = m > 0 ? m + ":" : "0:";
    var sDisplay = s > 0 ? ((s < 10) ? "0" + s : s) : "00";
    
    return hDisplay + mDisplay + sDisplay;
}

/**
 * Setup the guild music arrays
 * 
 * @param {*} client returns the bot client
 * @param {*} channel returns the channel the bot was used in
 * @param {*} video returns the video link
 * @param {*} options returns the stream options
 * @param {*} info returns the video info
 */
module.exports.queueSong = async function(client, channel, video, options, info) {
    let guildID = channel.guild.id;
    if (client.musicQueue !== undefined) {
		if (client.musicQueue[guildID] !== undefined) {
			client.musicQueue[guildID].push(video);
			client.musicQueueOptions[guildID].push(options);
			client.musicQueueInfo[guildID].push(info);
		} else {
			client.musicQueue[guildID] = [video];
			client.musicQueueOptions[guildID] = [options];
			client.musicQueueInfo[guildID] = [info];
			client.voters[guildID] = [];
		}
	} else {
		client.musicQueue[guildID] = [video];
		client.musicQueueOptions[guildID] = [options];
		client.musicQueueInfo[guildID] = [info];
		client.voters[guildID] = [];
	}
    this.queueEmbed(channel, info, client.musicQueue[guildID].length);
}

/**
 * Adds a song to the music queue in a guild
 * 
 * @param {*} channel returns the channel the bot was used in
 * @param {*} info returns the song info
 * @param {*} queuePos returns the queue position of the song.
 */
module.exports.queueEmbed = async function(channel, info, queuePos) {
    let n = info.req.username;
    let a = info.req.avatarURL();

    let queueEmbed = new MessageEmbed()
        .setColor(settings.embedColor)
        .setAuthor(n, a, '')
        .setThumbnail(info.img)
        .setTitle("queued: " + info.url)
        .addField("name", info.title, true)
        .addField("duration", info.duration, true)
        .addField("requested by", info.req.tag, true)
        .addField("queue position", queuePos, true)
        .setTimestamp()
        .setFooter(`${settings.botName} - music (views ${info.views} | ${info.ago})`);
	channel.send(queueEmbed)
}

/**
 * Handle queue system
 * 
 * @param {*} client returns the discord client.
 * @param {*} messageChannel will send an embeded message to the channel the first command was issued in.
 * @param {*} voiceConnection returns the current voice connection in the guild.
 * @param {*} voiceChannel returns the voice channel the bot is in.
 */
module.exports.playQueueSong = async function(client, messageChannel, voiceConnection, voiceChannel) {
    if (voiceConnection === undefined) {
        return;
    }

    const stream = ytdl(client.musicQueue[messageChannel.guild.id][0], {
        filter: 'audioonly',
        opusEncoded: true,
        encoderArgs: ['-af', client.musicQueueOptions[messageChannel.guild.id][0]]
    });
    const dispatcher = voiceConnection.play(stream, {
        type: 'opus'
    });

    let song = client.musicQueueInfo[messageChannel.guild.id][0];
    let n = song.req.username;
    let a = song.req.avatarURL();
    let msgembed = new MessageEmbed()
			.setColor(settings.embedColor)
			.setAuthor(n, a, '')
			.setThumbnail(song.img)
			.setTitle("now playing: " + song.url)
			.addField("name", song.title, true)
			.addField("duration", song.duration, true)
			.addField("requested by", song.req.tag, true)
			.setTimestamp()
			.setFooter(`${settings.botName} - music (views ${song.views} | ${song.ago})`);
    messageChannel.send(msgembed);

    dispatcher.on('finish', () => {
        client.musicQueue[messageChannel.guild.id].shift();
        client.musicQueueOptions[messageChannel.guild.id].shift();
        client.musicQueueInfo[messageChannel.guild.id].shift();

        if (client.musicQueue[messageChannel.guild.id].length === 0) {
            voiceChannel.leave();
        } else {
            setTimeout(() => {
                this.playQueueSong(client, messageChannel, voiceConnection, voiceChannel);
            }, 2000)
        }
    })

}

/**
 * 
 * @param {*} messageChannel will send a message to the channel the command was issued in.
 * @param {*} voiceConnection returns the current voice connection in the guild.
 */
module.exports.skipQueueSong = async function(song, messageChannel, voiceConnection) {
    if (voiceConnection === undefined) {
        return;
    }

    if (voiceConnection.dispatcher === null) {
        messageChannel.send("the bot is still starting the song")
        return;
    }

    messageChannel.send(`:white_check_mark: skipped - ${song.title}`);
    voiceConnection.dispatcher.end();
}

/**
 * Generate help menu based on @param info
 * 
 * @param {*} info returns command info
 * @returns an embed message
 */
module.exports.helpMenu = function(client, info) {
    let desc = `${info.description}\n\n**Usage:** \`${settings.commandPrefix}${info.name}`;
    if (info.args !== "") {
        desc = `${desc} ${info.args}\``;
    } else {
        desc = `${desc}\``;
    }
    if (info.example !== "") {
        desc = `${desc}\n**Example:** \`${settings.commandPrefix}${info.name} ${info.example}\``;
    }
    if (info.aliases !== undefined) {
        desc = `${desc}\n**Aliases:** `;

        info.aliases.forEach(alias => {
            desc = `${desc}\`${settings.commandPrefix}${alias}\`, `
        });
        desc = desc.replace(/(,\s*$)/g, '');
    }
    if (info.category !== "") {
        desc = `${desc}\n**Category:** \`${info.category}\``;
    }

    let helpEmbed = new MessageEmbed()
        .setColor(settings.embedColor)
        .setTitle(`Command: ${info.properName}`)
        .setThumbnail(client.user.avatarURL())
        .setDescription(`${desc}`)
        .setTimestamp()
        .setFooter(`${settings.botName} - ${info.name} (do not include the () and <>)`);
    return helpEmbed;
}

/**
 * Creates a formatted help command message based on @param info
 * 
 * @param {*} info returns command info
 * @returns a formatted help command message
 */
module.exports.formatHelpCommand = function(info) {
    return `${settings.commandPrefix}**${info.name}** *\`${info.description}${(info.allowed !== "") ? ` (${info.allowed} only)` : ""}\`*\n`;
}

/**
 * Find a key inside a map based on a map value
 * 
 * @param {*} map returns map
 * @param {*} searchValue returns map value
 * @returns map key
 */
module.exports.getKeyFromValue = function(map, searchValue) {
    for (let [key, value] of map.entries()) {
        if (value === searchValue) {
            return key;
        }
    }
}

/**
 * Creates an embedded pagination message which will timeout after 15 seconds.
 * 
 * @param {*} message returns the original message the command came from
 * @param {*} embed returns the embed for pagination
 * @param {*} page returns the page number
 * @param {*} pages returns the page content
 * @param {*} info returns the command info
 */
module.exports.createEmbedPagination = function(message, embed, page, pages, info) {
    const footerPart = `${settings.commandPrefix}${info.name} ${info.args}`;

    embed.setFooter(`page ${page + 1}/${pages.length} | ${footerPart}`);
    message.channel.send(embed).then(async function (msg) {
        await msg.react('◀');
        await msg.react('▶');

        const isBackwards = (reaction, user) => reaction.emoji.name === '◀' && user.id === message.author.id;
        const isForwards = (reaction, user) => reaction.emoji.name === '▶' && user.id === message.author.id;

        const backwards = msg.createReactionCollector(isBackwards, {idle: 10000});
        const forwards = msg.createReactionCollector(isForwards, {idle: 10000});

        backwards.on("collect", r => {
            if (page + 1 === 1) {
                msg.reactions.resolve("◀").users.remove(message.author.id);
                return;
            }
            page--;

            embed.setDescription(pages[page]);
            embed.setFooter(`page ${page + 1}/${pages.length} | ${footerPart}`);
            msg.edit(embed);

            msg.reactions.resolve("◀").users.remove(message.author.id);
        }).on("end", r => {
            msg.reactions.removeAll().catch(error => console.error(error));
        })

        forwards.on("collect", r => {
            if (page + 1 === pages.length) {
                msg.reactions.resolve("▶").users.remove(message.author.id);
                return;
            }
            page++;

            embed.setDescription(pages[page]);
            embed.setFooter(`page ${page + 1}/${pages.length} | ${footerPart}`);
            msg.edit(embed);

            msg.reactions.resolve("▶").users.remove(message.author.id);
        })
    });
}
