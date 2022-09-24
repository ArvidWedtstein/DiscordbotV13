import { Command } from '../../Interfaces';
import { Settings } from '../../Functions/settings';
import * as gradient from 'gradient-string';
import language, { insert } from '../../Functions/language';
import { addCoins, setCoins, getCoins, getColor } from '../../Functions/economy';
import Discord, { Client, Constants, Collection, EmbedBuilder, AttachmentBuilder } from 'discord.js';
import temporaryMessage from '../../Functions/temporary-message';
export const command: Command = {
    name: "pay",
    description: "pay a user money",
    details: "Check the ping of this bot.",
    aliases: ["givemoney"],
    hidden: false,
    UserPermissions: ["SendMessages"],
    ClientPermissions: [
        'SendMessages',
        'AddReactions',
        'AttachFiles',
        'EmbedLinks',
        'ManageMessages',
        'ReadMessageHistory',
        'ViewChannel'
    ],
    ownerOnly: false,
    examples: ["pay @user <amount>"],
    
    run: async(client, message, args) => {
        const { guild, channel, author, mentions, member } = message;
        if (!guild) return
        const guildId = guild?.id

        // Check if economy is enabled
        const setting = await Settings(message, 'money');
        if (!setting) return temporaryMessage(channel, `${insert(guild, 'SETTING_OFF', "Economy")}`, 10);

        // Get user
        const target = mentions.users.first();

        if (!target) return temporaryMessage(channel, `${language(guild, 'VALID_USER')}`, 10);
        if (target.id == author.id) return temporaryMessage(channel, `${language(guild, 'VALID_USER')}`, 10);

        // Check if specified amount is a number
        const coinsToGive: any = args[1];
        if (isNaN(coinsToGive) || coinsToGive < 0) return temporaryMessage(channel, `${language(guild, 'ECONOMY_VALID')}`, 10);

        // Check if user has enough coins
        const coinsOwned = await getCoins(guildId, member?.id)
        if (coinsOwned < coinsToGive) return temporaryMessage(channel, `${language(guild, 'ECONOMY_PAYNOMONEY')} ${coinsToGive} ErlingCoins!`, 10);

        const confirmation = await channel.send(`${language(guild, 'ECONOMY_PAYVERIFICATION')} **${target.username}** ${coinsToGive}? (Y, Yes, N, No)`)
        const filter = (m: any) => m.author.id === author.id

        const collector = confirmation.channel.createMessageCollector({
            filter, 
            max: 1,
            time: 180 * 1000,
        });
    
        collector.on('collect', async (m) => {
            const { channel, content } = m
            // Check if the answer is neither "y" or "yes"
            if (content.toLowerCase() !== 'y' && content.toLowerCase() !== 'yes') {
                return temporaryMessage(channel, `${language(guild, 'ECONOMY_PAYCANCELLED')}`, 10)
            }
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

            const attachment = new AttachmentBuilder(`./img/ErlingCoinSpin.gif`);
            const border = new AttachmentBuilder(`./img/banner.jpg`);
            let embed = new EmbedBuilder()
                .setTitle('Transaction')
                .setDescription(`${language(guild, 'ECONOMY_PAY')} **${target.username}** ${coinsToGive} ErlingCoins!
                \n${language(guild, 'ECONOMY_PAYLEFT')} ${remainingCoins} ErlingCoins!`)
                .setThumbnail(`attachment://ErlingCoinSpin.gif`)
                .setImage(`attachment://banner.jpg`)
                .setFooter({ text: `Erlingcoins sent by ${author.username}`, iconURL: author.displayAvatarURL() })
            channel.send({
                embeds: [embed], 
                files: [attachment, border] 
            })
        });
        
    
        collector.on('end', (collected, reason) => {
            if (reason === 'time') {
                temporaryMessage(channel,  `${language(guild, 'ECONOMY_PAYCANCELLED')}`, 5);
            }
            return
        });
    }
}

