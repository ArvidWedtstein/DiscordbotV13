import { Command } from '../../Interfaces';
import { Settings } from '../../Functions/settings';
import language, { insert } from '../../Functions/language';
import { addCoins, setCoins, getCoins, getColor } from '../../Functions/economy';
import temporaryMessage from '../../Functions/temporary-message';
import { AttachmentBuilder, EmbedBuilder } from 'discord.js';

export const command: Command = {
    name: "addbalance",
    description: "add balance to a user",
    aliases: ["addbal"],
    UserPermissions: ['ADMINISTRATOR'],
    ClientPermissions: [
        'SEND_MESSAGES',
        'ADD_REACTIONS',
        'ATTACH_FILES',
        'EMBED_LINKS',
        'MANAGE_MESSAGES',
        'READ_MESSAGE_HISTORY',
        'VIEW_CHANNEL'
    ],
    run: async(client, message, args) => {
        const { guild, channel, mentions, author } = message
        if (!guild || !channel) return;
        const guildId = guild?.id

        const setting = await Settings(message, 'money');
        if (!setting) return temporaryMessage(channel, `${insert(guild, 'SETTING_OFF', "Economy")}`, 10);
            
        const mention = mentions.users.first();
    
        if (!mention) return temporaryMessage(channel, `${language(guild, 'VALID_USER')}`, 10)

        const coins: number = parseInt(args[1]);
        
        if (isNaN(coins)) return temporaryMessage(channel, `${language(guild, 'ECONOMY_VALID')}`, 10)

        const userId = mention.id

        const newCoins = await addCoins(guildId, userId, coins)
        const attachment = new AttachmentBuilder('./img/banner.jpg', 'banner.jpg');
    
        let embed = new EmbedBuilder()
            .setColor(client.config.botEmbedHex)
            .setDescription(`${language(guild, 'ECONOMY_PAY')} <@${userId}> ${coins} ErlingCoins. \n<@${userId}>, ${language(guild, 'ECONOMY_PAYLEFT')} ${newCoins} ErlingCoins!`)
            .setImage('attachment://banner.jpg')
            .setFooter({ text: `Requested by ${author.tag}`, iconURL: author.displayAvatarURL() })
        return channel.send({ embeds: [embed], files: [attachment] })
        // message.reply(`${await language(guild, 'ECONOMY_PAY')} <@${userId}> ${coins} ErlingCoins. \n<@${userId}>, ${language(guild, 'ECONOMY_PAYLEFT')} ${newCoins} ErlingCoins!`)
    }
}