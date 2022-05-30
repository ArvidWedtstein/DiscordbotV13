import { Event } from '../Interfaces';
import * as gradient from 'gradient-string';
import language, { loadLanguages } from '../Functions/language';
import Discord, { Client, Intents, Constants, Collection, MessageActionRow, MessageButton, MessageEmbed, Guild, GuildMember } from 'discord.js';
import profileSchema from '../schemas/profileSchema';
import { Settingsguild } from '../Functions/settings';
export const event: Event = {
    name: "guildMemberAdd",
    run: async (client, member: GuildMember) => {
        const date1 = Date.now();
        
        if (!member) return
        const { user, guild } = member;
        const guildId = guild.id;
        const setting = await Settingsguild(guild.id, 'welcome');
        if (!setting) return
        const channelId = guild.systemChannel?.id;
        if (!channelId) {
            return
        }
        const userId = user.id;
        const channel = guild.channels.cache.get(channelId);
        
        if (!channel || !channel.isText()) {
            return
        }
        const result = await profileSchema.findOneAndUpdate({
            guildId,
            userId
        }, {
            joinedDate: date1
        }, {
            upsert: true
        }).catch((err: any) => {
            console.log(err)
        })

        
        const embed = new MessageEmbed()
            .setAuthor({ name: `${language(guild, 'WELCOME')} ${member.user.tag}`, iconURL: member.user.displayAvatarURL() })
            .setDescription(`${language(guild, 'WELCOME_RULES')}`)
            .setFooter({ text: `New member detected by ${client.user?.tag}` })
        channel.send({ embeds: [embed] })
    }
}
