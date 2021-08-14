const { MessageEmbed } = require("discord.js");
const util = require('../util/utils.js');

exports.info = {
	name: "help",
    properName: "Help",
	args: "(admin / command-name / category)",
	example: "join",
	description: "Show the help menu for a certain command.",
    allowed: "",
    noUse: "",
    aliases: ["h"],
	category: "General"
}

exports.run = async (settings, client, message, args) => {
    switch(args.length) {
        case 1: {
            if (args[0] === "admin") {
                let isDev = false;

                if (!message.author.bot) {
                    if (message.member && !message.member.hasPermission("ADMINISTRATOR")) {
                        for (let ids = 0; ids < settings.developerIDS.length; ids++) {
                            if (settings.developerIDS[ids] === message.author.id) {
                                isDev = true;
                                break;
                            }
                        }
                        if (!isDev) {
                            return message.channel.send("when you try to view the admin commands without perms :joy:");
                        }
                    }
                }
                let helpEmbed = new MessageEmbed()
                    .setTitle('Admin Commands:')
                    .setColor(settings.embedColor)
            
                let pagination = client.commandInfo.size;
                let pages = [];
                let page = 0;
                let maxPages = 1;
                let limit = 5;
                let paginationList = client.commandInfo.filter(info => info.noUse === undefined);
                paginationList = paginationList.filter(info => info.allowed !== "");
                let cmdInfo = this.info;
                
                if (paginationList.size > limit) {
                    pagination = limit;
                    maxPages = paginationList.size / limit;
                }

                let pageDesc;
                for (var i = 0; i < maxPages; i++) {
                    pageDesc = "";
                    paginationList.first(pagination).forEach(info => {
                        pageDesc = pageDesc + util.formatHelpCommand(info);
                        paginationList.delete(util.getKeyFromValue(paginationList, info))
                    })
                    pages[i] = pageDesc.substring(0, pageDesc.length - 1);
                }
                helpEmbed.setDescription(pages[page]);
                
                if (maxPages === 1) {
                    helpEmbed.setFooter(`${settings.commandPrefix}${cmdInfo.name} ${cmdInfo.args}`);
                    message.channel.send(helpEmbed);
                    return;
                } else {
                    util.createEmbedPagination(message, helpEmbed, page, pages, cmdInfo);
                }
                break;
            } else {
                if (client.categories.find(category => category.toUpperCase() === args[0].toUpperCase())) {
                    let category = client.categories.find(category => category.toUpperCase() === args[0].toUpperCase());

                    let helpEmbed = new MessageEmbed()
                    .setTitle(`${category} Category:`)
                    .setColor(settings.embedColor)

                    let pagination = 0;
                    let pages = [];
                    let page = 0;
                    let maxPages = 1;
                    let limit = 5;
                    let paginationList = client.commandInfo.filter(info => info.category !== undefined);
                    paginationList = paginationList.filter(info => info.category.toUpperCase() === category.toUpperCase());
                    pagination = paginationList.size;
                    let cmdInfo = this.info;
                    
                    if (paginationList.size > limit) {
                        pagination = limit;
                        maxPages = paginationList.size / limit;
                    }

                    let pageDesc;
                    for (var i = 0; i < maxPages; i++) {
                        pageDesc = "";
                        paginationList.first(pagination).forEach(info => {
                            pageDesc = pageDesc + util.formatHelpCommand(info);
                            paginationList.delete(util.getKeyFromValue(paginationList, info))
                        })
                        pages[i] = pageDesc.substring(0, pageDesc.length - 1);
                    }
                    helpEmbed.setDescription(pages[page]);
                    
                    if (maxPages === 1) {
                        helpEmbed.setFooter(`${settings.commandPrefix}${cmdInfo.name} ${cmdInfo.args}`);
                        message.channel.send(helpEmbed);
                        return;
                    } else {
                        util.createEmbedPagination(message, helpEmbed, page, pages, cmdInfo);
                    }
                    break;
                }
                let commandName = args[0];
                
                if (!client.commands.get(commandName)) {
                    if (client.aliases.get(commandName) !== undefined) {
                        commandName = client.aliases.get(commandName);
                    } else {
                        return message.channel.send("that command doesn't exist idiot");
                    }
                }
                
                let who = client.commandInfo.get(commandName).allowed;

                if (who === "admin" || who === "jack") {
                    let isDev = false;

                    if (!message.author.bot) {
                        if (message.member && !message.member.hasPermission("ADMINISTRATOR")) {
                            for (let ids = 0; ids < settings.developerIDS.length; ids++) {
                                if (settings.developerIDS[ids] === message.author.id) {
                                    isDev = true;
                                    break;
                                }
                                
                            }
                            if (!isDev) {
                                return message.channel.send("when you try to view the admin commands without perms :joy:");
                            }
                        }
                    }
                }

                let info = client.commandInfo.get(commandName);
                message.channel.send(util.helpMenu(client, info));
                break;
            }
        }

        default: {
            let helpEmbed = new MessageEmbed()
                .setTitle('General Commands:')
                .setColor(settings.embedColor)
            
            let pagination = client.commandInfo.size;
            let pages = [];
            let page = 0;
            let maxPages = 1;
            let limit = 5;
            let paginationList = client.commandInfo.filter(info => info.noUse === undefined);
            paginationList = paginationList.filter(info => info.allowed === "");
            let cmdInfo = this.info;
            
            if (paginationList.size > limit) {
                pagination = limit;
                maxPages = paginationList.size / limit;
            }

            let pageDesc;
            for (var i = 0; i < maxPages; i++) {
                pageDesc = "";
                paginationList.first(pagination).forEach(info => {
                    pageDesc = pageDesc + util.formatHelpCommand(info);
                    paginationList.delete(util.getKeyFromValue(paginationList, info))
                })
                pages[i] = pageDesc.substring(0, pageDesc.length - 1);
            }
            helpEmbed.setDescription(pages[page]);
            
            if (maxPages === 1) {
                helpEmbed.setFooter(`${settings.commandPrefix}${cmdInfo.name} ${cmdInfo.args}`);
                message.channel.send(helpEmbed);
                return;
            } else {
                util.createEmbedPagination(message, helpEmbed, page, pages, cmdInfo);
            }
        }
    }
}