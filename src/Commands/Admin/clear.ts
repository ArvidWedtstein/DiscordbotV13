import { MessageEmbed } from 'discord.js';
import language from '../../Functions/language';
import { Settings } from '../../Functions/settings';
import { Command } from '../../Interfaces';
import settingsSchema from '../../schemas/settingsSchema';

export const command: Command = {
    name: "clear",
    description: "clear messages in a channel",
    group: __dirname.toLowerCase(),
    run: async(client, message, args: any) => {
        const { guild, author, mentions, channel } = message
        if (!guild) return;
        const guildId = guild?.id
        const setting = await Settings(message, 'moderation');
        if (!setting) return message.reply(`${await language(guild, 'SETTING_OFF')} Moderation ${await language(guild, 'SETTING_OFF2')}`);
        
        if(!args[0]) return message.reply(`${language(guild, 'CLEAR_AMOUNT')}`);
        if(isNaN(args[0])) return message.reply(`${language(guild, 'CLEAR_NaN')}`);

        if(args[0] > 100) return message.reply(`${language(guild, 'CLEAR_LIMIT')}`);
        if(args[0] < 1) return message.reply(`${language(guild, 'CLEAR_UNDERLIMIT')}`);

        await channel.messages.fetch({limit: args[0]}).then(messages =>{
            messages.forEach(async (msg) => {
                msg.delete()
            })
        });
        let result = await settingsSchema.findOne({
            guildId
        })
        if (!result.serverlog) return

        const logchannel = guild.channels.cache.find(channel => channel.id === result.serverlog);
        if (!logchannel?.manageable) return;
        if (!logchannel.isText()) return
        let logembed = new MessageEmbed()
            .setColor(client.config.botEmbedHex)
            .setAuthor({ name: `${author.username} cleared ${args[0]} messages`, iconURL: author.displayAvatarURL() })
        logchannel.send({ embeds: [logembed] });
    }
}