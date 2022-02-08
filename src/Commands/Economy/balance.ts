import { ColorResolvable, MessageEmbed } from 'discord.js';
import { Command } from '../../Interfaces';
import language from '../../Functions/language';
import { addCoins, setCoins, getCoins, getColor } from '../../Functions/economy';
export const command: Command = {
    name: "balance",
    aliases: ["bal"],
    description: "check your balance",
    run: async(client, message, args) => {
        const target = message.author || message.mentions.users.first();
        const { guild } = message
        const guildId = guild?.id
        const userId = target.id
        // const setting = await settings.setting(message, 'money');
        const setting: boolean = true;
        if (!setting) {
            message.reply(`${language(guild, 'SETTING_OFF')} Economy ${language(guild, 'SETTING_OFF2')}`);
            return
        } else if (setting == true) {
            let coins = await getCoins(guildId, userId);
            let color: ColorResolvable = await getColor(guildId, userId);
            const erlingcoin = client.emojis.cache.get('853928115696828426');
            let embed = new MessageEmbed()
            .setColor(color)
            .setAuthor({name: `${message.author.username}`, iconURL: message.author.displayAvatarURL()})
            .setTitle(`${await language(guild, "BALANCE_TITLE")}`)
            .setDescription(`${await language(guild, "BALANCE_AMOUNT")} **${coins}** ErlingCoin${coins === 1 ? '' : 's'} ${erlingcoin}`)
            //.attachFiles(attachment)
            //.setThumbnail(`attachment://ErlingMoney.png`);
            message.channel.send({embeds: [embed]})
        }
    }
}