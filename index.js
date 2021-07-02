const Discord = require("discord.js");
const https = require("https");
const fetch = require("node-fetch");

const options = {
  hostname: "https://tendies-hodl.herokuapp.com/api/v1/hodl",
  port: 8080,
  path: "/get_leaderboard",
  method: "GET",
};

const client = new Discord.Client();
const weiToEth = 1000000000000000000;

client.on("ready", () => {
  console.log(`Logged in...`);
});

client.on("message", async (msg) => {
  if (msg.content === "ping") {
    msg.reply("pong");
  } else if (
    msg.content === "!raffle" &&
    msg.author.username === "ProofOfBruh"
  ) {
    msg.channel.send("Starting raffle");
    const options = { method: "GET" };
    const url =
      "https://tendies-hodl.herokuapp.com/api/v1/hodl/get_leaderboard?at_num_minted=1000";
    await fetch(url, options)
      .then((res) => res.json())
      .then((json) => {
        const raffle = [];

        json.leaderboard.sort(function (a, b) {
          return b.hodl_score - a.hodl_score;
        });

        json.leaderboard.forEach((addressAndScore, i) => {
          if (i <= 0.01 * json.leaderboard.length) {
            for (let j = 0; j < 150; j++) {
              raffle.push(addressAndScore.address);
            }
          } else if (i <= 0.1 * json.leaderboard.length) {
            for (let j = 0; j < 140; j++) {
              raffle.push(addressAndScore.address);
            }
          } else if (i <= 0.25 * json.leaderboard.length) {
            for (let j = 0; j < 125; j++) {
              raffle.push(addressAndScore.address);
            }
          } else if (i <= 0.5 * json.leaderboard.length) {
            for (let j = 0; j < 110; j++) {
              raffle.push(addressAndScore.address);
            }
          } else if (i <= 0.75 * json.leaderboard.length) {
            for (let j = 0; j < 105; j++) {
              raffle.push(addressAndScore.address);
            }
          } else {
            for (let j = 0; j < 100; j++) {
              raffle.push(addressAndScore.address);
            }
          }
        });

        msg.channel.send(
          "There are " + json.leaderboard.length + " addresses in the raffle"
        );

        // pick random address from raffle
        const randomIndex = Math.floor(Math.random() * raffle.length);
        const winner = raffle[randomIndex];
        const winnerHodlScore = json.leaderboard.find(
          (it) => it.address === winner
        ).hodl_score;
        msg.channel.send(
          "Address " +
            winner +
            " has won the raffle with a HODL score of " +
            winnerHodlScore
        );
      })
      .catch((err) => console.error("error:" + err));
  } else if (msg.content === "!floor") {
    let floorPrice = Number.MAX_VALUE;
    const requests = [];
    const contractAddress = "0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d";
    const limit = 50;
    let lowestSerial = -1;
    const options = { method: "GET" };

    for (let i = 0; i < 10000; i += limit) {
      const url =
        "https://api.opensea.io/api/v1/assets?asset_contract_address=" +
        contractAddress +
        "&limit=" +
        limit +
        "&offset=" +
        i;

      requests.push(
        fetch(url, options)
          .then((res) => res.json())
          .then((json) => {
            if (json.assets !== undefined) {
              json.assets.forEach((element) => {
                if (element.sell_orders !== null) {
                  // this means it's buy now
                  if (
                    element.sell_orders[0].current_price / weiToEth <
                    floorPrice
                  ) {
                    lowestSerial = element.token_id;
                  }
                  if (element.sell_orders[0].closing_date === null) {
                    floorPrice = Math.min(
                      floorPrice,
                      element.sell_orders[0].current_price / weiToEth
                    );
                  }
                }
              });
              return;
            }
          })
          .catch((err) => console.error("error:" + err))
      );
    }

    await Promise.all(requests);
    console.log(lowestSerial);
    msg.reply("Floor price for Tendies is " + floorPrice + " ETH");
  }
});

client.login("ODU4MjI2ODEwMTAxOTU2NjA5.YNbEAA.DgbJzn85UVcADhh3fkpxTHT_oOI");
