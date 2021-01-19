const mcServerStatus = require("minecraft-server-status");

const poc3address = 'poc3.bloodcoffeegames.com';
const poc2address = 'poc2.bloodcoffeegames.com';

mcServerStatus(poc2address, 25565, res => {
    console.log(res);
});

mcServerStatus(poc3address, 25565, res => {
    console.log(res);
});
