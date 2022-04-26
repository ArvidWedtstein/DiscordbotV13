import { Command } from '../../Interfaces';
import { Settings } from '../../Functions/settings';
import * as gradient from 'gradient-string';
import language from '../../Functions/language';
import { addCoins, setCoins, getCoins, getColor } from '../../Functions/economy';
import Discord, { Client, Intents, Constants, Collection, MessageActionRow, MessageButton, MessageEmbed } from 'discord.js';
import temporaryMessage from '../../Functions/temporary-message';
export const command: Command = {
    name: "botinfo",
    description: "info bout bot",
    run: async(client, message, args) => {
        const { guild, channel } = message
        const { uptime, user, registry, guilds }: any = client;
        let commandsize = registry.commands.size;
        let guildsize = 0
        client.guilds.cache.each(() => {
            guildsize += 1;
        })
        let totalSeconds = (uptime / 1000);
        let days = Math.floor(totalSeconds / 86400);
        totalSeconds %= 86400;
        let hours = Math.floor(totalSeconds / 3600);
        totalSeconds %= 3600;
        let minutes = Math.floor(totalSeconds / 60);
        let uptimestring = `${days}d, ${hours}h, ${minutes}m`;


        
        const embed = new MessageEmbed()
            .setAuthor({ name: `${user.tag}`, iconURL: `${user.displayAvatarURL()}` })
            .setThumbnail(user.displayAvatarURL())
            .setColor(client.config.botEmbedHex)
            .addFields(
                { name: 'Author', value: 'ArvidWedtstein' },
                { name: 'Repository', value: 'https://github.com/ArvidWedtstein/DiscordbotV13', inline: false },
		        { name: '\u200B', value: '\u200B' },
                { name: 'Uptime', value: `\`${uptimestring}\``, inline: true },
                { name: 'Prefix', value: `\`${client.config.prefix}\``, inline: true },
                { name: 'Commands Loaded:', value: `\`${commandsize}\``, inline: true },
                { name: 'Currently in:', value: `\`${guildsize}\` servers`, inline: true },
            )
        channel.send({ embeds: [embed] });
    }
}
