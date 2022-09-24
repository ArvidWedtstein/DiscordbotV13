import { Command } from '../../Interfaces';
import { EmbedBuilder } from 'discord.js';
import { text } from 'stream/consumers';

export const command: Command = {
    name: "blackjack",
    aliases: ["black"],
    description: "play blackjack",
    ClientPermissions: [
        'SendMessages',
        'AddReactions',
        'ATTACH_FILES',
        'EmbedLinks',
        'MANAGE_MESSAGES',
        'READ_MESSAGE_HISTORY',
        'ViewChannel'
    ],
    run: async(client, message, args) => {
        const { author, guild, channel } = message;

        if (!guild) return;
        // message.delete()
        const user = author;
        const member = guild.members.cache.get(user.id)

        // TODO - Add help embed

        let suits = ["Spades", "Hearts", "Diamonds", "Clubs"]
        let values = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"]

        let deck = new Array();
        let currentplayer = 0;
        
        let rules = [
            `Please decide what to do in the following 60 seconds or you will lose!\n`,
            `🔴 Stand | not asking for more cards.`,
            `🔵 Hit | get another card.`,
            `⛔ Surrender | Get half of your bet back.`
        ]

        const createDeck = (() => {
            deck = new Array();
            values.forEach((value) => {
                suits.forEach((suit) => {
                    let weight = parseInt(value);
                    if (value == "J" || value == "Q" || value == "K") {
                        weight = 10;
                    }
                    if (value == "A") {
                        weight = 11;
                    }
                    let card = { Value: value, Suit: suit, Weight: weight };
                    deck.push(card)
                })
            })
        })
        const shuffle = (() => {
            for (let i = 0; i < 1000; i++) {
                let location1 = Math.floor((Math.random() * deck.length));
                let location2 = Math.floor((Math.random() * deck.length));
                let temp = deck[location1];

                deck[location1] = deck[location2];
                deck[location2] = temp;
            }
        })
        const getPoints = ((player: number) => {
            let points = 0;
            for(let i = 0; i < players[player].Hand.length; i++)
            {
                points += players[player].Hand[i].Weight;
            }
            players[player].Points = points;
            return points;
        })

        const updatePoints = (() =>  
        {
            for (let i = 0 ; i < players.length; i++)
            {
                getPoints(i);
            }
        })
        let players = new Array();
        const createPlayers = ((num: number) => {
            players = new Array();
            for (let i = 0; i < num; i++) {
                if (i === 1) {
                    let hand = new Array();
                    let player = { Name: "Dealer", Id: i, Points: 0, Hand: hand };
                    players.push(player);
                } else {
                    let hand = new Array();
                    let player = { Name: `${user.username}#${user.discriminator}`, Id: i, Points: 0, Hand: hand };
                    players.push(player);
                }
            }
        })
        const dealHands = (() => {
            // alternate handing cards to each player
            // 2 cards each
            for (let i = 0; i < 2; i++) {
                for (let x = 0; x < players.length; x++) {
                    let card = deck.pop();
                    players[x].Hand.push(card);
                    updatePoints();
                }
            }
            // updateDeck();
            createPlayersUI();
        })


        const filter = (reaction: any, user: any) => {
            return user.id === author.id
        }

        function genText(textArray: any, players: any) {
            for (let i = 0; i < players.length; i++) {
                textArray.push(`${players[i].Name === 'Dealer' ? '🕵️‍♂️' : '👨‍🦰'} (**${players[i].Points}** points) | ${players[i].Name} **your** cards are:`)
                for (let c = 0; c < players[i].Hand.length; c++) {
                    let hand = players[i].Hand[c]
                    textArray.push(`**${hand.Value}** of ${hand.Suit}`)
                }
                textArray.push(``);
            }
            return textArray;
        }
        const createPlayersUI = (async () => {
            
            let txt = []
            for (let i = 0; i < players.length; i++) {
                let usertxt = `${players[i].Name === 'Dealer' ? '🕵️‍♂️' : '👨‍🦰'} (**${players[i].Points}** points) | ${players[i].Name} **your** cards are:\n`
                for (let c = 0; c < players[i].Hand.length; c++) {
                    usertxt += `**${players[i].Hand[c].Value}** of ${players[i].Hand[c].Suit}\n`
                }
                txt.push(usertxt);
            }   
            
            txt.push(rules.join('\n'));

            const embed = new EmbedBuilder()
                .setTitle("Blackjack")
                .setDescription(txt.join('\n'))
                .setThumbnail("https://images-ext-1.discordapp.net/external/EWCXIQ_PqlxJwZx-yXLU_DNZv65J3kl3o8xxJZJaoPI/https/images.emojiterra.com/mozilla/512px/1f0cf.png?width=456&height=456")
                .setFooter({ text: `Requested by ${author.tag}`, iconURL: author.displayAvatarURL() })
                .setTimestamp()
            channel.send({ embeds: [embed] }).then((msg) => {
                msg.react('🔴')
                msg.react('🔵')
                msg.react('⛔')

                const collector = msg.createReactionCollector({
                    filter,
                    max: 1,
                    time: 1000 * 60
                })
        
                collector.on('collect', (reaction) => {
                    switch (reaction.emoji.name) {
                        case '🔴':
                            collector.stop("stand");
                            stay();
                            break;
                        case '🔵':
                            collector.stop("hit")
                            hit();
                            break;
                        case '⛔':
                            collector.stop("surrender")
                            surrender();
                            break;
                    }
                })
        
                collector.on('end', (collected, reason) => {
                    console.log(collected, reason)
                })
            })
        })

        const startBlackjack= (async () => {
            currentplayer = 0;
            createDeck();
            shuffle();
            createPlayers(2);
            dealHands();
        })

        currentplayer = 0;
        function hit() {
            // pop a card from the deck to the current player
            // check if current player new points are over 21
            let card = deck.pop();
            players[currentplayer].Hand.push(card);

            
            updatePoints();
            check();
        }
        function surrender() {
            return channel.send('You surrendered. Here is half your money back.')
        }

        // Check if user or dealer has over 21 points
        function check() {
            let txt: string[] = [];

            if (players[currentplayer].Points > 21) {
                txt.push(`😡${players[currentplayer].Name} you lost!\n`);
                
                txt = genText(txt, players);

                // const embed = new EmbedBuilder()
                //     .setTitle("Blackjack")
                //     .setDescription(txt.join('\n'))
                //     .setFooter({ text: `Requested by ${author.tag}`, iconURL: author.displayAvatarURL() })
                //     .setTimestamp()

                // channel.send({ embeds: [embed] })
                end(); 
            } else {
                txt = []
                txt = genText(txt, players);
                txt.push(...rules.slice(0, -1));

                const embed = new EmbedBuilder()
                    .setTitle("Blackjack")
                    .setDescription(txt.join('\n'))
                    .setFooter({ text: `Requested by ${author.tag}`, iconURL: author.displayAvatarURL() })
                    .setTimestamp()

                channel.send({ embeds: [embed] }).then((msg) => {
                    msg.react('🔴')
                    msg.react('🔵')
                    
                    const collector = msg.createReactionCollector({
                        filter,
                        max: 1,
                        time: 5 * 1000 * 60
                    })
            
                    collector.on('collect', (reaction, user) => {
                        console.log(reaction.emoji.name)
                        switch (reaction.emoji.name) {
                            case '🔴':
                                collector.stop("stand");
                                stay();
                                break;
                            case '🔵':
                                collector.stop("hit")
                                hit();
                                break;
                            case '⛔':
                                collector.stop("surrender")
                                surrender();
                                break;
                        }
                    })
            
                    collector.on('end', (collected, reason) => {
                        console.log(collected, reason)
                    })
                })
            }
        }

        // If player pressed stay
        function stay() {
            if (currentplayer != players.length-1) {
                currentplayer += 1
                let card = deck.pop();
                players[currentplayer].Hand.push(card);

                updatePoints();
                check();
            } else {
                end();
            }
        }
        function end() {
            let winner = -1;
            let score = 0;

            let txt = [];
            for (let i = 0; i < players.length; i++) {
                let player = players[i];
                // Check if player points are over score 
                if (player.Points > score && player.Points < 22) {
                    winner = i;
                    txt.push(`${players[winner].Name} you won!\n`);
                }
                score = player.Points;

                txt.push(`${player.Name === 'Dealer' ? '🕵️‍♂️' : '👨‍🦰'} (**${player.Points}** points) | ${player.Name} **your** cards are:`)
                for (let c = 0; c < player.Hand.length; c++) {
                    txt.push(`**${player.Hand[c].Value}** of ${player.Hand[c].Suit}`)
                }
                txt.push(``);
            }

            const embed = new EmbedBuilder()
                .setTitle("Blackjack")
                .setDescription(txt.join('\n'))
                .setFooter({ text: `Requested by ${author.tag}`, iconURL: author.displayAvatarURL() })
                .setTimestamp()
            channel.send({ embeds: [embed] })
        }
        startBlackjack();
    }
}
