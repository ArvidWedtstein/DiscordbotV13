import { Command } from '../../Interfaces';
import { Settings } from '../../Functions/settings';
import language from '../../Functions/language';
import { addCoins, setCoins, getCoins, getColor } from '../../Functions/economy';
import Discord, { Client, Constants, Collection, ActionRowBuilder, ButtonBuilder, EmbedBuilder, GuildMember, AttachmentBuilder } from 'discord.js';
import temporaryMessage from '../../Functions/temporary-message';
import moment from 'moment';
import axios from 'axios';
import { PageEmbed } from '../../Functions/PageEmbed'
import { ErrorEmbed } from '../../Functions/ErrorEmbed';
export const command: Command = {
    name: "gamble",
    description: "lets gamble!",
    details: "gamble away your coins!!",
    aliases: [],
    hidden: false,
    UserPermissions: ["SendMessages"],
    ClientPermissions: ["SendMessages", "AddReactions"],
    ownerOnly: false,
    examples: ["gamble {amount}"],
    cooldown: 60,
    run: async(client, message, args) => {
        const { guild, mentions, author, member, channel, attachments } = message;

        if (!guild) return
        
        let gambleamount: any = args[0];
        

        if (!gambleamount || Number.isNaN(gambleamount)) return ErrorEmbed(message, client, command, `${language(guild, "ECONOMY_VALID")}`);

        if (gambleamount > 200) return ErrorEmbed(message, client, command, "You can only gamble for a maximum of 200 coins");
        if (gambleamount < 25) return ErrorEmbed(message, client, command, "The minimum can only gamble for is 25 coins");
        function getRandomIntInclusive(min: number, max: number) {
            min = Math.ceil(min);
            max = Math.floor(max);
            return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive 
        }
        function WinOrLose() { return getRandomIntInclusive(1, 10) % 2 === 0 ? 'win' : 'lost';}

        const embed = new EmbedBuilder({
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
            addCoins(guild.id, author.id, gambleamount * -1)
            embed.setDescription(`🕵️‍♂️ ${author.tag}, **you lost ${gambleamount} ErlingCoins!**`)
        }

        return channel.send({ embeds: [embed] })
    }
}


