import { ColorResolvable, MessageEmbed } from 'discord.js';
import { Command } from '../../Interfaces';
import language, { insert } from '../../Functions/language';
import { addCoins, setCoins, getCoins, getColor } from '../../Functions/economy';
import temporaryMessage from '../../Functions/temporary-message';
import { Settings } from '../../Functions/settings';
export const command: Command = {
    name: "balance",
    aliases: ["bal"],
    description: "check your balance",
    UserPermissions: ["SEND_MESSAGES"],
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
        const { guild, author, mentions, channel } = message
        if (!guild) return;
        const target = author || mentions.users.first();
        const guildId = guild?.id
        const userId = target.id
        const setting = await Settings(message, 'money');
        // const setting: boolean = true;
        if (!setting) return temporaryMessage(channel, `${insert(guild, 'SETTING_OFF', "Economy")}`, 10);

        // Get coins and user defined color
        let coins = await getCoins(guildId, userId);
        let color: ColorResolvable = await getColor(guildId, userId);


        const erlingcoin = client.emojis.cache.get('853928115696828426');
        let embed = new MessageEmbed()
            .setColor(color)
            .setAuthor({name: `${target.username}`, iconURL: target.displayAvatarURL()})
            .setTitle(`${await language(guild, "BALANCE_TITLE")}`)
            .setDescription(`${await language(guild, "BALANCE_AMOUNT")} **${coins}** ErlingCoin${coins === 1 ? '' : 's'} ${erlingcoin}`)
        channel.send({embeds: [embed]})
    }
}