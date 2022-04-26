import { Command } from '../../Interfaces';
import { Settings } from '../../Functions/settings';
import * as gradient from 'gradient-string';
import language, { insert } from '../../Functions/language';
import { addCoins, setCoins, getCoins, getColor } from '../../Functions/economy';
import Discord, { Client, Intents, Constants, Collection, MessageActionRow, MessageButton, MessageEmbed, MessageAttachment } from 'discord.js';
import temporaryMessage from '../../Functions/temporary-message';
export const command: Command = {
    name: "pay",
    description: "pay a user money",
    details: "Check the ping of this bot.",
    aliases: ["givemoney"],
    hidden: false,
    UserPermissions: ["SEND_MESSAGES"],
    ClientPermissions: ["SEND_MESSAGES", "ADD_REACTIONS"],
    ownerOnly: false,
    examples: ["pay @user <amount>"],
    
    run: async(client, message, args) => {
        const { guild, channel, author, mentions, member } = message;
        if (!guild) return
        const guildId = guild?.id

        const setting = await Settings(message, 'money');
        if (!setting) return temporaryMessage(channel, `${insert(guild, 'SETTING_OFF', "Economy")}`, 10);

        const target = mentions.users.first();

        if (!target) return temporaryMessage(channel, `${language(guild, 'VALID_USER')}`, 10);
        if (target.id == message.author.id) return temporaryMessage(channel, `${language(guild, 'VALID_USER')}`, 10);

        const coinsToGive: any = args[1]
        if (isNaN(coinsToGive) || coinsToGive < 0) return temporaryMessage(channel, `${language(guild, 'ECONOMY_VALID')}`, 10)

        const coinsOwned = await getCoins(guildId, member?.id)
        if (coinsOwned < coinsToGive) return message.reply(`${language(guild, 'ECONOMY_PAYNOMONEY')} ${coinsToGive} ErlingCoins!`)

        const confirmation = await message.channel.send(`${language(guild, 'ECONOMY_PAYVERIFICATION')} ${target} ${coinsToGive}? (Y, N, Yes, No)`)
        const filter = (m: any) => m.author.id === message.author.id

        const collector = confirmation.channel.createMessageCollector({
            filter, 
            max: 1,
            time: 60000,
        });
    
        collector.on('collect', async (m) => {
            if (m.content.toLowerCase() == 'y' || 'yes') {
                const remainingCoins = await addCoins(
                    guildId,
                    member?.id,
                    coinsToGive * -1
                )
                const newBalance = await addCoins(
                    guildId,
                    target.id,
                    coinsToGive
                )

                const attachment = new MessageAttachment(`./img/ErlingMoney.png`, `ErlingMoney.png`);
                let embed = new MessageEmbed()
                    .setColor('BLURPLE')
                    .setTitle('Transaction')
                    .setDescription(`${language(guild, 'ECONOMY_PAY')} <@${target.id}> ${coinsToGive} ErlingCoins!`)
                    .addField(`${language(guild, 'ECONOMY_PAYLEFT')}`, `${remainingCoins}`)
                    .setThumbnail(`attachment://ErlingMoney.png`);
                message.channel.send({ embeds: [embed], files: [attachment] })
            } else if (m.content.toLowerCase() == 'n' || 'no') {
                temporaryMessage(m.channel, `${language(guild, 'ECONOMY_PAYCANCELLED')}`, 5)
            }
        });
        
    
        collector.on('end', (collected, reason) => {
            console.log(reason)
            if (reason === 'time') {
                temporaryMessage(message.channel,  `${language(guild, 'ECONOMY_PAYCANCELLED')}`, 5);
                return
            }
        });
    }
}

