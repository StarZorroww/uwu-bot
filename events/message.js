exports.run = async (client, settings, message) => {
    let prefix = settings.commandPrefix;
    if (message.author.bot) return;

    if (message.content.startsWith(prefix + " "))
        return;
        
    if (message.content.startsWith(prefix)) {

        let messageArray = message.content.split(" ");
		let cmd = messageArray[0];
		cmd = cmd.toLowerCase();
        let args = messageArray.slice(1);

        if (!isLetter(cmd.slice(prefix.length).charAt(0))) {
            return;
        }

        let commandFile = client.commands.get(cmd.slice(prefix.length));
        let aliasFile = client.commands.get(client.aliases.get(cmd.slice(prefix.length)));
		if (commandFile) {
            commandFile.run(settings, client, message, args);
            message.delete().catch(console.error);
		} else if (aliasFile) {
            aliasFile.run(settings, client, message, args);
            message.delete().catch(console.error);
        }
    }
};

function isLetter(str) {
    return str.length === 1 && str.match(/[a-z]/i);
}
