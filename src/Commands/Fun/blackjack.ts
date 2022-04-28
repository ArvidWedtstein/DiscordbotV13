import { Command } from '../../Interfaces';
import { MessageEmbed } from 'discord.js';

export const command: Command = {
    name: "blackjack",
    aliases: ["black"],
    description: "play blackjack",
    run: async(client, message, args) => {
        const { author, guild } = message;
        message.delete()
        const user = author;
        const member = guild?.members.cache.get(user.id)

        let suits = ["Spades", "Hearts", "Diamonds", "Clubs"]
        let values = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"]

        let deck = new Array();
        let currentplayer = 0;
        
        let rules = `Please decide what to do in the following 60 seconds or you will lose!
        🔴 Stand | not asking for more cards.
        🔵 Hit | get another card.
        ⛔ Surrender | Get half of your bet back.`

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
        const createPlayersUI = (async () => {
            const embed = new MessageEmbed()
                .setTitle("Blackjack")
                .setTimestamp()
            let txt = ""
            for (let i = 0; i < players.length; i++) {
                let usertxt = `${players[i].Name === 'Dealer' ? '🕵️‍♂️' : '👨‍🦰'} (**${players[i].Points}** points) | ${players[i].Name} **your** cards are:\n`
                for (let c = 0; c < players[i].Hand.length; c++) {
                    usertxt += `**${players[i].Hand[c].Value}** of ${players[i].Hand[c].Suit}\n`
                }
                txt += `${usertxt}\n`;

            }   
            
            txt += `\n${rules}`
            embed.setDescription(txt)
            let messageEmbed = message.channel.send({ embeds: [embed]}).then((msg) => {
                msg.react('🔴')
                msg.react('🔵')
                msg.react('⛔')
                const filter = (reaction: any, user: any) => {
                    return user.id === message.author.id
                }
                const collector = msg.createReactionCollector({
                    filter,
                    max: 1,
                    time: 1000 * 60
                })
        
                collector.on('collect', (reaction) => {
                    console.log(reaction.emoji.name)
                    if (reaction.emoji.name == '🔵') {
                        hit();
                    }
                    if (reaction.emoji.name == '🔴') {
                        stay();
                    }
                    if (reaction.emoji.name == '⛔') {
                        surrender();
                    }
                })
        
                collector.on('end', (collected) => {
                    //console.log(collected)
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
            return message.channel.send('You surrendered. Here is half your money back.')
        }

        function check() {
            if (players[currentplayer].Points > 21) {
                const embed = new MessageEmbed()
                    .setTitle("Blackjack")
                    .setTimestamp()
                let txt = [];
                
                txt.push(`${players[currentplayer].Name} lost!\n`);
                for (let i = 0; i < players.length; i++) {

                    txt.push(`${players[i].Name === 'Dealer' ? '🕵️‍♂️' : '👨‍🦰'} (**${players[i].Points}** points) | ${players[i].Name} **your** cards are:`)
                    for (let c = 0; c < players[i].Hand.length; c++) {
                        txt.push(`**${players[i].Hand[c].Value}** of ${players[i].Hand[c].Suit}`)
                    }
                    txt.push(``);
                }
                embed.setDescription(txt.join('\n'))
                let messageEmbed = message.channel.send({ embeds: [embed]})
                // end(); 
            } else {
                const embed = new MessageEmbed()
                    .setTitle("Blackjack")
                    .setTimestamp()
                let txt = ""
                for (let i = 0; i < players.length; i++) {
                    let usertxt = `${players[i].Name === 'Dealer' ? '🕵️‍♂️' : '👨‍🦰'} (**${players[i].Points}** points) | ${players[i].Name} **your** cards are:\n`
                    for (let c = 0; c < players[i].Hand.length; c++) {
                        usertxt += `**${players[i].Hand[c].Value}** of ${players[i].Hand[c].Suit}\n`
                    }
                    txt += `${usertxt}\n`;

                }   
                txt += rules
                embed.setDescription(txt)
                let messageEmbed = message.channel.send({ embeds: [embed]}).then((msg) => {
                    msg.react('🔴')
                    msg.react('🔵')
                    const filter = (reaction: any, user: any) => {
                        return user.id === message.author.id
                    }
                    const collector = msg.createReactionCollector({
                        filter,
                        max: 1,
                        time: 1000 * 60
                    })
            
                    collector.on('collect', (reaction, user) => {
                        console.log(reaction.emoji.name)
                        if (reaction.emoji.name == '🔵') {
                            hit();
                        }
                        if (reaction.emoji.name == '🔴') {
                            stay();
                        }
                        if (reaction.emoji.name == '⛔') {
                            surrender();
                        }
                    })
            
                    collector.on('end', (collected) => {
                        //console.log(collected)
                    })
                })
            }
        }
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

            const embed = new MessageEmbed()
                .setTitle("Blackjack")
                .setTimestamp()
            let txt = [];
            
            for (let i = 0; i < players.length; i++) {
                if (players[i].Points > score && players[i].Points < 22) {
                    winner = i;
                    txt.push(`${players[winner].Name} you won!\n`);
                }
                score = players[i].Points;

                
                txt.push(`${players[i].Name === 'Dealer' ? '🕵️‍♂️' : '👨‍🦰'} (**${players[i].Points}** points) | ${players[i].Name} **your** cards are:`)
                for (let c = 0; c < players[i].Hand.length; c++) {
                    txt.push(`**${players[i].Hand[c].Value}** of ${players[i].Hand[c].Suit}`)
                }
                txt.push(``);
            }

            embed.setDescription(txt.join('\n'))
            let messageEmbed = message.channel.send({ embeds: [embed]})

        }
        startBlackjack();
    }
}
