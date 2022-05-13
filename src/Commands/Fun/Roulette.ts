import { Command } from '../../Interfaces';
import { Settings } from '../../Functions/settings';
import * as gradient from 'gradient-string';
import language from '../../Functions/language';
import { addCoins, setCoins, getCoins, getColor } from '../../Functions/economy';
import Discord, { Client, Intents, Constants, Collection, MessageActionRow, MessageButton, MessageEmbed } from 'discord.js';
import temporaryMessage from '../../Functions/temporary-message';
import moment from 'moment';
import icon from '../../Functions/icon';

export const command: Command = {
    name: "roulette",
    description: "Roulette",
    details: "Roulette",
    aliases: ["roulettegame"],
    group: "Fun",
    hidden: false,
    UserPermissions: ["SEND_MESSAGES"],
    ClientPermissions: ["SEND_MESSAGES", "ADD_REACTIONS"],
    ownerOnly: false,
    examples: ["roulette {odd or even}"],
    
    run: async(client, message, args) => {
        const { guild, channel, author, member, mentions, attachments } = message;
        if (!guild) return

        let chosenOddOrEven = args[0];
        if (!chosenOddOrEven) return temporaryMessage(channel, `Please choose odd or even`, 15);

        function getRandomIntInclusive(min: number, max: number) {
            min = Math.ceil(min);
            max = Math.floor(max);
            return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive 
        }
        function EvenOrOdd(num: number) { return num % 2 === 0 ? 'even' : 'odd';}

        let randomInt = getRandomIntInclusive(1, 10);
        let embed = new MessageEmbed()
            .setColor(client.config.botEmbedHex)
            .setTitle(`Roulette`)
            .setDescription(`
            ${chosenOddOrEven.toLowerCase() === EvenOrOdd(randomInt) ? '**You win!**' : '**You lose!**'}
            
            ${chosenOddOrEven.toLowerCase() === EvenOrOdd(randomInt) ? `🎉${author.tag}, you have won!` : `😭${author.tag}, you have lost!`}

            Result: **${randomInt}**
            `)
            .setFooter({ text: `Requested by ${author.tag}`, iconURL: author.displayAvatarURL() })
        channel.send({ embeds: [embed] })
        
    }
}


