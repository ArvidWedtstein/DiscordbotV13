import { Event } from '../Interfaces';
import * as gradient from 'gradient-string';
import language, { loadLanguages } from '../Functions/language';
import Discord, { Client, Constants, Collection, ActionRowBuilder, ButtonBuilder, EmbedBuilder, Guild, GuildMember } from 'discord.js';
import profileSchema from '../schemas/profileSchema';
import { Settingsguild } from '../Functions/settings';
export const event: Event = {
    name: "guildMemberRemove",
    run: async (client, member: GuildMember) => {
        const guild: Guild = member.guild;
        const setting = await Settingsguild(guild.id, 'welcome');
        
        if (!setting) return;

        const channelId = guild.systemChannel?.id;
        if (!channelId) {
            return
        }
        
        const channel = guild.channels.cache.get(channelId);
        if (!channel) {
            return
        }
        if (!channel.viewable || !channel.isText()) return

        const embed = new EmbedBuilder()
            .setAuthor({ name: `${language(guild, 'LEAVE')} ${member.user.tag} 😪`, iconURL: member.user.displayAvatarURL() })
            .setFooter({ text: `Detected by ${client.user?.tag}` })
        channel.send({ embeds: [embed] })
    }
}



