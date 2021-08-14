const util = require("../util/utils.js");
const { MessageEmbed } = require('discord.js');
const { getNameHistory } = require('mc-names');

exports.info = {
	name: "mcnames",
	properName: "Minecraft Past Names",
	args: "<username>",
	example: "",
	description: "Get past names of any player.",
	allowed: "",
    aliases: ["mc", "mcpn", "mcpastnames", "pastnames", "pn"],
	category: "Utility"
}

exports.run = async (settings, client, message, args) => {
	switch(args.length) {
		case 0: {
			return message.channel.send(util.helpMenu(client, this.info));
		}
		default: {
			const nameHistory = await getNameHistory(args[0]);
			if (!nameHistory) {
				return await message.channel.send("enter a real minecraft username fucktard.");
			}

			const skin = `https://mc-heads.net/avatar/${nameHistory.uuid}/256`;
			let username = nameHistory.username;
			const names = nameHistory.toPages(7, "`$username`| `$date`");

			let embed = new MessageEmbed()
				.setTitle(username)
				.setURL("https://namemc.com/profile/" + username)
				.setThumbnail(skin)
				.setColor(settings.embedColor);

            let pages = [];
            let page = 0;
            let maxPages = names.size;
            let cmdInfo = this.info;

            for (var i = 0; i < maxPages; i++) {
                pages[i] = names.get(i + 1).join("\n");
            }
            embed.setDescription(pages[page]);
            
            if (maxPages === 1) {
                embed.setFooter(`${settings.commandPrefix}${cmdInfo.name} ${cmdInfo.args}`);
                message.channel.send(embed);
                return;
            } else {
                util.createEmbedPagination(message, embed, page, pages, cmdInfo);
            }
		}
	}
}