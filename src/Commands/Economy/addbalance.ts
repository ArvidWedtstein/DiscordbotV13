import { Command } from '../../Interfaces';
import { Settings } from '../../Functions/settings';
import language, { insert } from '../../Functions/language';
import { addCoins, setCoins, getCoins, getColor } from '../../Functions/economy';
import temporaryMessage from '../../Functions/temporary-message';
import { AttachmentBuilder, EmbedBuilder } from 'discord.js';
import { ErrorEmbed } from '../../Functions/ErrorEmbed';

export const command: Command = {
    name: "addbalance",
    description: "add balance to a user",
    aliases: ["addbal"],
    UserPermissions: ['Administrator'],
    ClientPermissions: [
        'SendMessages',
        'AddReactions',
        'AttachFiles',
        'EmbedLinks',
        'ManageMessages',
        'ReadMessageHistory',
        'ViewChannel'
    ],
    run: async(client, message, args) => {
        const { guild, channel, mentions, author } = message
        if (!guild || !channel) return;
        const guildId = guild?.id

        const setting = await Settings(message, 'money');
        if (!setting) return ErrorEmbed(message, client, command, `${insert(guild, 'SETTING_OFF', "Economy")}`);
            
        const mention = mentions.users.first();
    
        if (!mention) return ErrorEmbed(message, client, command, `${language(guild, 'VALID_USER')}`);

        const coins: number = parseInt(args[1]);
        
        if (isNaN(coins)) return ErrorEmbed(message, client, command, `${language(guild, 'ECONOMY_VALID')}`);

        const userId = mention.id

        const newCoins = await addCoins(guildId, userId, coins)
        const attachment = new AttachmentBuilder('./img/banner.jpg');
    
        let embed = new EmbedBuilder()
            .setColor(client.config.botEmbedHex)
            .setDescription(`${language(guild, 'ECONOMY_PAY')} <@${userId}> ${coins} ErlingCoins. \n<@${userId}>, ${language(guild, 'ECONOMY_PAYLEFT')} ${newCoins} ErlingCoins!`)
            .setImage('attachment://banner.jpg')
            .setFooter({ text: `Requested by ${author.tag}`, iconURL: author.displayAvatarURL() })
        return channel.send({ embeds: [embed], files: [attachment] })
        // message.reply(`${await language(guild, 'ECONOMY_PAY')} <@${userId}> ${coins} ErlingCoins. \n<@${userId}>, ${language(guild, 'ECONOMY_PAYLEFT')} ${newCoins} ErlingCoins!`)
    }
}