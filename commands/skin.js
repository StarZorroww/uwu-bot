const util = require("../util/utils.js");
const fetch = require('node-fetch');
const { MessageEmbed } = require('discord.js');

exports.info = {
	name: "skin",
	properName: "Skin",
	args: "<username>",
	example: "i_bun",
	description: "Get the minecraft skin of any player.",
	allowed: "",
    aliases: ["mcskin", "getskin", "wtfskin"],
	category: "Utility"
}

exports.run = async (settings, client, message, args) => {
	switch(args.length) {
		case 0: {
			return message.channel.send(util.helpMenu(client, this.info));
		}
		default: {
			const uuidURL = "https://api.mojang.com/users/profiles/minecraft/" + args[0];
			let uuid;

			try {
				uuid = await fetch(uuidURL).then((uuidURL) => uuidURL.json());
			} catch (e) {
				return message.channel.send("can you like, use a real fucking minecraft username retard?");
			}

			const image = `https://crafatar.com/renders/body/${uuid.id}?overlay`;

			let embed = new MessageEmbed()
				.setColor(settings.embedColor)
				.setTitle(uuid.name)
				.setURL(`https://namemc.com/profile/${args[0]}`)
				.setImage(image)
				.setDescription(`[download](https://mc-heads.net/download/${uuid.id})`);

			return message.channel.send(embed);
		}
	}
}