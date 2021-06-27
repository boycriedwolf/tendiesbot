const Discord = require("discord.js");
const client = new Discord.Client();

client.on("ready", () => {
  console.log(`Logged in...`);
});

client.on("message", (msg) => {
  if (msg.content === "ping") {
    msg.reply("pong");
  } else if (
    msg.content === "!raffle" &&
    msg.author.username === "ProofOfBruh"
  ) {
    msg.reply("starting raffle");
  }
});

client.login("ODU4MjI2ODEwMTAxOTU2NjA5.YNbEAA.DgbJzn85UVcADhh3fkpxTHT_oOI");
