const util = require("../util/utils.js")

exports.info = {
	name: "dj",
	properName: "DJ",
	args: "<member>",
	example: "@starzorrow",
	description: "Allow someone to bypass the music command limits.",
	allowed: "admin",
    aliases: ["musicperms"],
	category: "Roles"
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

	if (message.member && !message.guild.me.hasPermission("ADMINISTRATOR")) {
		if (!message.guild.me.hasPermission("MANAGE_ROLES")) {
			message.channel.send("i dont have permission create or give out roles you twat")
			return;
		}
	}

	let roleName = 'dj-uwu';
	let role = message.guild.roles.cache.some(x => x.name === roleName);
	if (!role) {
		message.guild.roles.create({ data: { name: 'dj-uwu', permissions: ['ATTACH_FILES', 'EMBED_LINKS'] } });
		message.channel.send("dj-uwu role doesn't exist so i, the genuis i am have created it")
		return;
		// Role doesn't exist, safe to create
	}

	const roleID = message.guild.roles.cache.find(x => x.name === roleName);
    var n = message.author.username;
	var a = message.author.avatarURL();

    if (args.length === 0 || args.length !== 1) {
        return message.channel.send(util.helpMenu(client, this.info));
	}

	if (getUserFromMention(args[0]) === null) {
		message.channel.send("no such user exists retard")
		return;
	}

	const target = message.mentions.members.first()
	const member = message.guild.members.cache.get(target.id)

	if (!member.roles.cache.find(x => x.name === roleName)) {
		member.roles.add(roleID).catch(console.error)
		message.channel.send("succsexfully given " + args[0] + " dj perms uwu")
	} else {
		member.roles.remove(roleID).catch(console.error)
		message.channel.send("succsexfully taken " + args[0] + "'s dj perms uwu")
	}

	function getUserFromMention(mention) {
		if (!mention) return;
	
		if (mention.startsWith('<@') && mention.endsWith('>')) {
			mention = mention.slice(2, -1);
	
			if (mention.startsWith('!')) {
				mention = mention.slice(1);
			}
	
			return mention;
		}
		else {
			return null;
		}
	}
}
