import { Command } from '../../Interfaces';
import { Settings } from '../../Functions/settings';
import * as gradient from 'gradient-string';
import language from '../../Functions/language';
import { addCoins, setCoins, getCoins, getColor } from '../../Functions/economy';
import Discord, { Client, Intents, Constants, Collection, MessageActionRow, MessageButton, MessageEmbed, MessageAttachment } from 'discord.js';
import temporaryMessage from '../../Functions/temporary-message';
import moment from 'moment';
import icon from '../../Functions/icon';
import profileSchema from '../../schemas/profileSchema';
import axios from 'axios';
import { re } from 'mathjs';

let lastWord: any;
export const command: Command = {
    name: "guesstheword",
    description: "guess the word and get a reward",
    details: "gueess the word and get a reward",
    aliases: ["gtw"],
    group: "Fun",
    hidden: false,
    UserPermissions: ["SEND_MESSAGES"],
    ClientPermissions: ["SEND_MESSAGES", "ADD_REACTIONS"],
    ownerOnly: false,
    examples: ["guesstheword"],
    
    run: async(client, message, args) => {
        const { guild, channel, author, member, mentions, attachments } = message;
        if (!guild) return


        
        let computer = [
            'computer',
            'mouse',
            'keyboard',
            'monitor',
            'speaker',
            'printer',
            'scanner',
            'projector',
            'harddrive',
            'ram',
            'cpu',
            'gpu',
            'motherboard',
            'case',
            'cable',
            'power supply',
            'server',
            'radiator'
        ]
        let network = [
            'network',
            'router',
            'switch',
            'modem',
            'wifi',
            'subnet mask',
        ]
        let os = [
            'distro',
            'operating system',
            'kernel',
            'bios',
            'shell',
            'terminal',
            'command',
        ]
        let protocol = [
            'http',
            'https',
            'ftp',
            'ssh',
            'tcp',
            'udp',
            'dns',
            'dhcp',
            'telnet',
        ]

        // list all ark: survival evolved dinosaurs
        let dinosaurs = [
            'brontosaurus',
            'carcharodon',
            'carnotaurus',
            'cetiosaurus',
            'chasmosaurus',
            'dilophosaurus',
            'dromaeosaurus',
            'europelta',
            'giganotosaurus',
            'hadrosaurus',
            'iguanodon',
            'jurassosaurus',
            'kentrosaurus',
            'lambdacisaurus',
            'lapparentosaurus',
            'mamenchisaurus',
            'mammoth',
            'nanosaurus',
            'nankosaurus',
            'ornithomimus',
            'ornithoprocopis',
            'parasaurolophus',
            'pteranodon',
            'quetzalcoatlus',
            'raptor',
            'megalodon',
            'stegosaurus',
            'triceratops',
            'tyrannosaurus',
            'velociraptor',
            'xenoceratops',
            'maewing',
            'oviraptor',
            'ankylosaurus',
            'dodo'
        ]
        let categories = [
            {
                name: 'computer',
                words: computer
            },
            {
                name: 'network',
                words: network
            },
            {
                name: 'os',
                words: os
            },
            {
                name: 'protocol',
                words: protocol
            },
            {
                name: "dinosaurs",
                words: dinosaurs
            }
        ]

        function scramble(a: any) {
            let words = a.split(" "); 
            for (let i = 0; i < words.length; i++) {
                function scrambleWord(word: string) {
                    let v = word.split("");
                    for(let b = v.length-1; 0 < b; b--) {
                        let c = Math.floor(Math.random()*(b+1));
                        let d = v[b]; 
                        v[b] = v[c];
                        v[c] = d
                    } 
                    return v.join("")
                }
                let word = scrambleWord(words[i])
                if (words[i] == word) word = scrambleWord(words[i]) // if the word is the same as the scrambled word, scramble again
                words[i] = word;
            }
            return words.join(' ')
        }
        let category: any = categories[Math.floor(Math.random() * categories.length)];

        // If category is mentioned
        if (args[0]) {
            category = categories.find(c => c.name.toLowerCase() == args[0].toLowerCase());
        }

        let word = category.words[Math.floor(Math.random() * category.words.length)];
        let scrambledWord = scramble(word).toUpperCase();

        if (lastWord == word) word = category.words[Math.floor(Math.random() * category.words.length)];
        lastWord = word;

        let embed = new MessageEmbed()
            .setColor(client.config.botEmbedHex)
            .setAuthor({ name: `Guess the Word!` })
            .setTitle(`Word: \`${scrambledWord}\``)
            .setDescription(`**Hint**: Starts with ${word.charAt(0).toUpperCase()}\nCategory: **${category.name}**`)
            .setFooter({ text: `Requested by ${author.tag}`, iconURL: author.displayAvatarURL() })
            .setTimestamp()
        
        let messageEmbed = channel.send({ embeds: [embed] })
        const filter = (m: any) => m.channel.id === channel.id && !m.author.bot && m.author.id === author.id;
        const collector = channel.createMessageCollector({filter, time: 60*1000});
        collector.on('collect', async (reaction) => {
            if (!reaction) return;
            embed.setTitle(`${author.username} failed to guess the word! 😭`);
                // embed.setDescription(`The correct word was: **${word}**`);
                channel.send({ embeds: [embed] })
            reaction.content.toLowerCase() === word ? collector.stop('correct') : channel.send({ embeds: [embed] });
        })

        // TODO - Gradually add letters to the hint over time.
        // setTimeout(() => {
            
        // }, 60*1000);

        collector.on('end', async (collected, reason) => {
            console.log(reason)
            
            if (reason === 'correct') {
                embed.setTitle(`${author.username} guessed the word! 🎉`);
                embed.setDescription(`The correct word was: **${word}**`);
                channel.send({ embeds: [embed] })
            } else if (reason === 'incorrect') {
                embed.setTitle(`${author.username} failed to guess the word! 😭`);
                embed.setDescription(`The correct word was: **${word}**`);
                channel.send({ embeds: [embed] })
            } else {
                embed.setTitle(`No one managed to put the letters in the right order! 😥`);
                embed.setDescription(`Letters were: **${scrambledWord}**\nRight order: **${word}**`);
                channel.send({ embeds: [embed] })
            }
            word = "";
        })

        return
        
    }
}


