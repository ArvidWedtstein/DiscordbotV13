import { Command } from '../../Interfaces';
import { Settings } from '../../Functions/settings';
import * as gradient from 'gradient-string';
import language from '../../Functions/language';
import { addCoins, setCoins, getCoins, getColor } from '../../Functions/economy';
import Discord, { Client, Intents, Constants, Collection, MessageActionRow, MessageButton, MessageEmbed, GuildMember, EmbedFieldData, MessageAttachment } from 'discord.js';
import temporaryMessage from '../../Functions/temporary-message';
import moment from 'moment';
import axios from 'axios';
import { PageEmbed } from 'Functions/PageEmbed'
export const command: Command = {
    name: "gamble",
    description: "lets gamble!",
    details: "gamble away your coins",
    aliases: [],
    hidden: false,
    UserPermissions: ["SEND_MESSAGES"],
    ClientPermissions: ["SEND_MESSAGES", "ADD_REACTIONS"],
    ownerOnly: false,
    examples: ["gamble {amount}"],
    run: async(client, message, args) => {
        const { guild, mentions, author, member, channel, attachments } = message;

        if (!guild) return
        
        let gambleamount: any = args[0];
        
        if (!gambleamount || Number.isNaN(gambleamount)) return temporaryMessage(channel, "Please provide a a valid amount to gamble for", 10)

        function getRandomIntInclusive(min: number, max: number) {
            min = Math.ceil(min);
            max = Math.floor(max);
            return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive 
        }
        function WinOrLose() { return getRandomIntInclusive(1, 10) % 2 === 0 ? 'win' : 'lost';}

        const embed = new MessageEmbed({
            color: client.config.botEmbedHex,
            title: `Gambling`,
            footer: {
                text: `Requested by ${author.tag}`,
                icon_url: author.displayAvatarURL()
            }
        })

        let win = WinOrLose();
        
        if (win === 'win') {
            addCoins(guild.id, author.id, gambleamount)

            embed.setDescription(`${author.tag}, **you won ${gambleamount} ErlingCoins!**`)
        } else if (win === 'lost') {
            addCoins(guild.id, author.id, -gambleamount)
            embed.setDescription(`🕵️‍♂️ ${author.tag}, **you lost ${gambleamount} ErlingCoins!**`)
        }

        return channel.send({ embeds: [embed] })
    }
}


