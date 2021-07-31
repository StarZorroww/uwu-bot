const { MessageEmbed } = require("discord.js");
const fs = require("fs");
const path = require('path');
const util = require('../util/utils.js')

exports.info = {
	name: "reload",
	properName: "Reload",
	args: "(command)",
	example: "play",
	description: "Reload commands to apply updates.",
	allowed: "jack",
	category: "Jack"
}

exports.run = async function(settings, client, message, args) {
	let isDev = false;

	if (!message.author.bot) {
		// if (message.member && !message.member.hasPermission("ADMINISTRATOR")) {
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
		// }
	}


	var n = message.author.username;
	var a = message.author.avatarURL();

	switch (args.length) {
		case 1: {
			const commandName = args[0].toLowerCase();
			const command = message.client.commands.get(commandName);
			
			if (!command) {
				return message.channel.send(commandName + " doesn't exist idiot :joy:");
			}

			const commandFolders = fs.readdirSync('./commands');

			delete require.cache[require.resolve(path.resolve(__dirname, `./${commandName}.js`))];

			for (var ii = 0; ii < client.categories.length; ii++) {
				if (client.categories[ii] == client.commandInfo.get(commandName).category) {
					client.categories.splice(ii, 1);
					break;
				}
			}
			
			if (client.commandInfo.get(commandName).aliases !== undefined) {
				client.commandInfo.get(commandName).aliases.forEach(alias => {
					client.aliases.delete(alias, commandName);
				});
			}

			client.commandInfo.delete(commandName);

			try {
				const newCommand = require(path.resolve(__dirname, `./${commandName}.js`));
				
				let commandInfo = newCommand.info;
				client.commandInfo.set(commandName, commandInfo);

				if (commandInfo.aliases !== undefined) {
					for (var i = 0; i < commandInfo.aliases.length; i++) {
						client.aliases.set(commandInfo.aliases[i], commandName);
					}
				}

				if (commandInfo.category !== undefined) {
					if (client.categories.indexOf(commandInfo.category) === -1) {
						client.categories.push(commandInfo.category);
					}
				}

				client.commands.set(commandName, newCommand);
				console.log("Successfully reloaded " + commandName + ".js")
				message.channel.send("ur shitty command named " + commandName + " actually reloaded, lol...");
			} catch (error) {
				console.log(error);
				message.channel.send("ur command named " + commandName + " is broken because this shitty code wont reload it, nice one.");
			}

			break;
		}
		default: {
			let embed = new MessageEmbed()
				.setColor(settings.embedColor)
				.setAuthor(n, a, '')
				.setDescription('reloading commands...')
				.setTimestamp()
				.setFooter('uwu bot - reload (do not include the () and <>)');
			message.channel.send(embed).then(msg => {
				fs.readdir(path.resolve(__dirname, "./"), (err, files) => {
					if (err) return console.log(err);
					let before = Date.now();
					let amount = files.length;
					let reloaded = 6;

					for (var i = 0; i < amount; i++) {
						delete require.cache[require.resolve(path.resolve(__dirname, `./${files[i]}`))];
						client.commands.delete(files[i].split(".")[0].toLowerCase());
						client.commandInfo.delete(files[i].split(".")[0].toLowerCase());
						client.aliases.clear();
						client.categories = [];
					}
					files.forEach(file => {
						if (!file.endsWith(".js")) return;
						let commandName = file.split(".")[0].toLowerCase();
						let props = require(path.resolve(__dirname, `./${file}`));
						console.log("Successfully reloaded " + file)

						let commandInfo = props.info;
						client.commandInfo.set(commandName, commandInfo);

						if (commandInfo.aliases !== undefined) {
							for (var i = 0; i < commandInfo.aliases.length; i++) {
								client.aliases.set(commandInfo.aliases[i], commandName);
							}
						}

						if (commandInfo.category !== undefined) {
							if (client.categories.indexOf(commandInfo.category) === -1) {
								client.categories.push(commandInfo.category);
							}
						}

						client.commands.set(commandName, props);
						if (reloaded === 0) {
							msg.edit(embed
								.setDescription('reloaded ' + client.commands.size + '/' + amount
							))
							reloaded = 6;
						}
						if (client.commands.size === amount) {
							msg.edit(embed
								.setDescription('reloaded ' + client.commands.size + '/' + amount)
								.addField('done', 'time took: ' + Math.floor(Date.now() - before) + 'ms', true)
							);
						}
						--reloaded;
					})
				});
			})
		}
	}
}