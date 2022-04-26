import { Command } from '../../Interfaces';
import { Settings } from '../../Functions/settings';
import * as gradient from 'gradient-string';
import language, { insert } from '../../Functions/language';
import { addCoins, setCoins, getCoins, getColor } from '../../Functions/economy';
import Discord, { Client, Intents, Constants, Collection, MessageActionRow, MessageButton, MessageEmbed } from 'discord.js';
import temporaryMessage from '../../Functions/temporary-message';
import settingsSchema from '../../schemas/settingsSchema';

export const command: Command = {
    name: "unban",
    description: "unban a user",
    aliases: ["removeban"],
    group: __dirname,
    UserPermissions: ["BAN_MEMBERS"],
    ClientPermissions: [
        'SEND_MESSAGES',
        'ADD_REACTIONS',
        'ATTACH_FILES',
        'EMBED_LINKS',
        'MANAGE_MESSAGES',
        'READ_MESSAGE_HISTORY',
        'VIEW_CHANNEL',
        'BAN_MEMBERS',
        'MODERATE_MEMBERS'
    ],
    run: async(client, message, args) => {
        message.delete()
        const { guild, author, mentions, channel } = message
        if (!guild) return;
        const guildId = guild?.id
        const setting = await Settings(message, 'moderation');

        if (!setting) return temporaryMessage(channel, `${insert(guild, 'SETTING_OFF', "Moderation")}`, 10);
        
        let userID = args[0]
        guild.bans.fetch().then(async (bans) => {
            if (bans.size == 0) return 
            let bUser = bans.find(b => b.user.id == userID)
            if (!bUser) return
            guild.members.unban(bUser.user)

            // Log action
            let logembed = new Discord.MessageEmbed()
                .setColor("DARKER_GREY")
                .setAuthor({ name: `${bUser.user}`, iconURL: bUser.user.displayAvatarURL() })
                .setDescription(`${language(guild, 'BAN_UNBAN')}`)
                .setFooter({ text: `${author.username}`, iconURL: author.displayAvatarURL() })
            guild.systemChannel?.send({embeds: [logembed]});
        })
    }
}