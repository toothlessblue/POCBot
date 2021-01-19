const Discord = require('discord.js');
const mcutil = require("minecraft-server-util");
const client = new Discord.Client();
const poc3address = 'poc3.bloodcoffeegames.com';
const poc2address = 'poc2.bloodcoffeegames.com';

const servers = [
    'poc3.bloodcoffeegames.com',
    'poc2.bloodcoffeegames.com',
];

async function getServerStatus() {
    let statuses = {};

    for (let server of servers) {
        statuses[server] = await (async () => {
            try {
                return await mcutil.status(server);
            } catch {
                return null;
            }
        })();
    }

    return statuses;
}

client.once('ready', () => {
    console.log('Ready!');
});

client.on('message', async (message) => {
    if (message.content === '!server') {
        await getServerStatus().then((res) => {
            let reply = 'Here\'s the server statuses! \n\n';

            for (let server in res) {

                if (res[server] !== null) {
                    reply += ':green_square: ';
                    reply += server;
                    reply += '   |   ' + res[server].onlinePlayers + ' / ' + res[server].maxPlayers + ' players.';
                } else {
                    reply += ':red_square: '
                    reply += server;
                }

                reply += '\n'
            }

            message.channel.send(reply);
        });
    }

    if (message.channel.id === '800404487058489394') { // votes channel
        await message.react('☑️');
        await message.react('🇽');
    }
});

client.login('ODAwODc1Mzk2NDgwMzY4NjYy.YAYfVg.zVN4BkAjsWBM276thooAAWR2ejI');