import { Command } from '../../Interfaces';
import { Settings } from '../../Functions/settings';
import language, { insert } from '../../Functions/language';
import { addCoins, setCoins, getCoins, getColor } from '../../Functions/economy';
import Discord, { Client, Constants, Collection, EmbedBuilder } from 'discord.js';
import temporaryMessage from '../../Functions/temporary-message';
import settingsSchema from '../../schemas/settingsSchema';
import { ErrorEmbed } from '../../Functions/ErrorEmbed';

export const command: Command = {
    name: "unban",
    description: "unban a user",
    aliases: ["removeban"],
    group: __dirname,
    UserPermissions: ["BanMembers"],
    ClientPermissions: [
        'SendMessages',
        'AddReactions',
        'AttachFiles',
        'EmbedLinks',
        'ManageMessages',
        'ReadMessageHistory',
        'ViewChannel',
        'BanMembers',
        'ModerateMembers'
    ],
    run: async(client, message, args) => {
        message.delete()
        const { guild, author, mentions, channel } = message
        if (!guild) return;
        const guildId = guild?.id
        const setting = await Settings(message, 'moderation');

        if (!setting) return ErrorEmbed(message, client, command, `${insert(guild, 'SETTING_OFF', "Moderation")}`);
        
        let userID = args[0]
        guild.bans.fetch().then(async (bans) => {
            if (bans.size == 0) return 
            let bUser = bans.find(b => b.user.id == userID)
            if (!bUser) return
            guild.members.unban(bUser.user)

            // Log action
            let logembed = new Discord.EmbedBuilder()
                .setColor(client.config.botEmbedHex)
                .setAuthor({ name: `${bUser.user}`, iconURL: bUser.user.displayAvatarURL() })
                .setDescription(`${language(guild, 'BAN_UNBAN')}`)
                .setFooter({ text: `${author.username}`, iconURL: author.displayAvatarURL() })
            guild.systemChannel?.send({embeds: [logembed]});
        })
    }
}