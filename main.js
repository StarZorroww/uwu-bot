const Discord = require("discord.js");
const fs = require('fs');
const path = require('path');
const readline = require('readline');
const client = new Discord.Client();
const settings = require('./config.json');
exec = require('child_process').exec;
pingFrequency = (settings.pingInterval * 1000);
embedColor = ("0x" + settings.embedColor);

let status = settings.status;
let statusTypes = ['PLAYING', 'STREAMING', 'LISTENING', 'WATCHING'];
let statusType = statusTypes[settings.statusType];
let statusURL = settings.statusURL;

function getStatus() {
    return status = settings.status;
}

function getStatusType() {
    return statusType = statusTypes[settings.statusType];
}

function getStatusURL() {
    return statusURL = settings.statusURL;
}

function updatePrecense() {
    client.user.setActivity(getStatus(), { url: getStatusURL(), type: getStatusType() });
}

//Music Handler
client.musicQueue = new Discord.Collection();
client.musicQueueOptions = new Discord.Collection();
client.musicQueueInfo = new Discord.Collection();
client.voters = new Discord.Collection();

//Command Handler
client.commands = new Discord.Collection();
client.commandInfo = new Discord.Collection();
client.aliases = new Discord.Collection();
client.categories = [];
client.events = new Discord.Collection();

fs.readdir("./commands", (err, files) => {
    if (err) return console.log(err);
    files.forEach(file => {
        if (!file.endsWith(".js")) return;
        let props = require(`./commands/${file}`);
        console.log("Successfully loaded " + file)
        let commandName = file.split(".")[0];
        
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
    });
});

fs.readdir('./events/', (err, files) => {
    if (err) console.log(err);
    files.forEach(file => {
        let eventFunc = require(`./events/${file}`);
        console.log("Successfully loaded " + file);
        let eventName = file.split(".")[0];
        client.on(eventName, (...args) => eventFunc.run(client, settings, ...args));
    });
});

client.on("ready", () => {
    console.log("Ready!");
    client.user.setStatus('online');
    updatePrecense()
    client.setInterval(updatePrecense, pingFrequency);

    if (!fs.existsSync(path.join(__dirname, 'logs'))) {
        fs.mkdirSync(path.join(__dirname, 'logs'));
    }

    client.on('message', async message => {
        if (message.channel == null) {
            return;
        }
        if (message.channel.type === 'dm') { 
            if (message.author.id !== client.user.id) {
                var msg = message.author.username + " says: " + message.content;
                fs.appendFile(path.join(__dirname, 'logs', "file.txt"), replaceAll(msg, "\n", ", ") + '\n', function(err) {
                    if (err)
                        throw err;
                });
                console.log(`${message.author.username} says: ${message.content}`);
                const rl = readline.createInterface({
                    input: process.stdin,
                    output: process.stdout
                });
        
                rl.question(`REPLY TO ${message.author.username}: `, (answer) => {
                    fs.appendFile(path.join(__dirname, 'logs', "file.txt"), `${client.user.username} says: ${answer}\n`, function(err) {
                        if (err)
                            throw err;
                    });
                    console.log(`${client.user.username} says: ${answer}`)
                    message.author.send(`${answer}`);
                    rl.close();
                });
            }
    
        }
    });

    client.on('voiceStateUpdate', (oldState, newState) => {
        if (oldState.channelID === null || typeof oldState.channelID == 'undefined') return;
        if (oldState.id !== client.user.id) {
            if (oldState.channelID !== oldState.guild.me.voice.channelID || newState.channel) {
                return;
            }
            if (oldState.channel.members.size - 1 === 0) {
                oldState.channel.leave();
            }
        }
        fs.readdir("./temp", (err, files) => {
            if (err) return console.log(err);
            files.forEach(file => {
                if (!file.endsWith(".wav")) return;
                unlinkIfUnused(`./temp/${file}`);
            });
        });
        client.musicQueue[oldState.guild.id] = [];
        client.musicQueueOptions[oldState.guild.id] = [];
        client.musicQueueInfo[oldState.guild.id] = [];
        client.voters[oldState.guild.id] = [];
    });
});

client.login(settings.token);

function replaceAll(string, search, replace) {
    return string.split(search).join(replace);
}

function unlinkIfUnused(path) {
    exec('lsof ' + path, function(err, stdout, stderr) {
        if (stdout.length === 0) {
            console.log(path, " not in use. unlinking...");
            try {
                fs.unlinkSync(path);
            } catch {
                console.log(path, " is in use, cannot delete.");
            }
        } else {
            console.log(path, "IN USE. Ignoring...");
        }
    });
}