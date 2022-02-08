import { Event } from '../Interfaces';
import * as gradient from 'gradient-string';
import language, { loadLanguages } from '../Functions/language';
import Discord, { Client, Intents, Constants, Collection, MessageActionRow, MessageButton, MessageEmbed, Guild, GuildMember } from 'discord.js';
import profileSchema from '../schemas/profileSchema';
import { Settingsguild } from '../Functions/settings';
export const event: Event = {
    name: "guildMemberAdd",
    run: async (client, member: GuildMember) => {
        const guild: Guild = member.guild;
        const setting = await Settingsguild(guild.id, 'welcome');
        
        if (setting == false) {
            // message.reply(`${language(guild, 'SETTING_OFF')} Welcome/Leave ${language(guild, 'SETTING_OFF2')}`);
            return
        } else if (setting == true) {
            const channelId = guild.systemChannel?.id;
            if (!channelId) {
                return
            }
            
            const channel = guild.channels.cache.get(channelId);
            if (!channel) {
                return
            }
            channel.send(`${language(guild, 'LEAVE')} ${member.user.tag}`)
        
        }
    }
}



