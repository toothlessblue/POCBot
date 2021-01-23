const Discord = require('discord.js');
const mcutil = require("minecraft-server-util");
const client = new Discord.Client();

client.login('ODAwODc1Mzk2NDgwMzY4NjYy.YAYfVg.zVN4BkAjsWBM276thooAAWR2ejI');
client.once('ready', async () => {
    const modChatChannel = await client.channels.fetch('682043432574648435', true);

    const servers = [
        {
            ip: 'poc3.bloodcoffeegames.com',
            lastState: false
        },
        {
            ip: 'poc2.bloodcoffeegames.com',
            lastState: false
        },
    ];

    async function getServerStatus() {
        let statuses = {};
        for (let server of servers) {
            statuses[server.ip] = await (async () => {
                try {
                    return await mcutil.status(server.ip);
                } catch {
                    return null;
                }
            })();
        }
        return statuses;
    }

    getServerStatus().then(res => {
        for (let server in servers) {
            if (servers.hasOwnProperty(server)) {
                servers[server].lastState = res[servers[server].ip] !== null;
            }
        }
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

                console.log('Replied with server status');
            });
        }

        if (message.channel.id === '800404487058489394') { // votes channel
            await message.react('☑️');
            await message.react('🇽');
            console.log('Added reacts to voting channel message')
        }
    });

    function serverStatusNotify() {
        getServerStatus().then(res => {
            for (let server in servers) {
                if (servers.hasOwnProperty(server)) {
                    if (res[servers[server].ip] === null && servers[server].lastState) {
                        modChatChannel.send(servers[server].ip + ' is now down!');
                    } else if (res[servers[server].ip] !== null && !servers[server].lastState) {
                        modChatChannel.send(servers[server].ip + ' is now up!')
                    }

                    servers[server].lastState = res[servers[server].ip] !== null;
                }
            }
        });
    }

    setInterval(serverStatusNotify, 30000)

    console.log('Ready!');
});