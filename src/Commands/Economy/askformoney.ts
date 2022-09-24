import { Command } from '../../Interfaces';
import { Settings } from '../../Functions/settings';
import * as gradient from 'gradient-string';
import language, { insert } from '../../Functions/language';
import { addCoins, setCoins, getCoins, getColor } from '../../Functions/economy';
import Discord, { Client, Constants, Collection, EmbedBuilder, Interaction } from 'discord.js';
import temporaryMessage from '../../Functions/temporary-message';
export const command: Command = {
    name: "askformoney",
    description: "ask for money",
    details: "beg for money.",
    aliases: ["beg"],
    hidden: false,
    UserPermissions: ["SendMessages"],
    ClientPermissions: [
        'SendMessages',
        'AddReactions',
        'ATTACH_FILES',
        'EmbedLinks',
        'MANAGE_MESSAGES',
        'READ_MESSAGE_HISTORY',
        'ViewChannel'
    ],
    ownerOnly: false,
    examples: ["askformoney @user <amount>"],
    
    run: async(client, message, args) => {
        const { guild, channel, author, member, mentions } = message;
        if (!guild) return;
        
        const guildId = guild?.id
        const setting = await Settings(message, 'money');
        
        if (!setting) return temporaryMessage(channel, `${insert(guild, 'SETTING_OFF', "Economy")}`, 10);
            
        let d = new Date();

        const target = mentions.users.first();
        if (!target) return temporaryMessage(channel, `${await language(guild, 'ECONOMY_VALIDUSER')}`, 10);
        if (target == message.author) return temporaryMessage(channel, `${await language(guild, 'ECONOMY_INVALIDUSER')}`, 10)

        const coinsToAsk: any = args[1];

        if (isNaN(coinsToAsk)) return temporaryMessage(channel, `${await language(guild, 'ECONOMY_VALID')}`, 10);
        if (coinsToAsk < 0) return temporaryMessage(channel, `${await language(guild, 'ECONOMY_VALID')}`, 10);
        const yes = '<:yes:807175712515162183>'
        const no = '<:no:807175696555573278>'
        let embed = new EmbedBuilder()
            .setColor(client.config.botEmbedHex)
            .setDescription(`${await language(guild, 'ECONOMY_ASKFORMONEY')} ${coinsToAsk} ErlingCoins, <@${target.id}>`)
            .setAuthor({ name: author.username, iconURL: author.displayAvatarURL() })
            .setFooter({ text: `${await language(guild, 'ECONOMY_ASKFORMONEYYESNO')}. ${d.toLocaleTimeString()}` })
        let msgembed = await channel.send({ embeds: [embed] }).then((msg) => {
            msg.react(yes);
            msg.react(no);

            const filter = (i: any) => i.user.id === author.id;
            let collect = msg.createReactionCollector({
                filter, 
                max: 1,
                time: 60*1000
            });

            collect.on('collect', async (reaction, user) => {
                if (reaction.message.partial) await reaction.message.fetch();
                if (reaction.partial) await reaction.fetch();
                if (user.bot) return;
                if (!reaction.message.guild) return;
                if (reaction.message.channel.id != msg.channel.id) return;
                if (user != target) return await reaction.users.remove(user.id);

                if (reaction.emoji.name === 'yes') {
                    const coinsOwned = await getCoins(guildId, target.id)
                    if (coinsOwned < coinsToAsk) return temporaryMessage(channel, `${await language(guild, 'ECONOMY_PAYNOMONEY')} ${coinsToAsk} ErlingCoins!`,10);

                    let embed = new EmbedBuilder()
                        .setColor('#10ff00')
                        .setTitle(`${await language(guild, 'PAY_ACCEPT')}`)
                        .setDescription(`${await language(guild, 'ECONOMY_ASKFORMONEY')} ${coinsToAsk} ErlingCoins, <@${target.id}>`)
                        .setAuthor({ name: author.username, iconURL: member?.user?.displayAvatarURL() })
                        .setTimestamp()
                        .setFooter({ text: `${await language(guild, 'ECONOMY_ASKFORMONEYACCEPTED')}` })
                    await reaction.message.edit({ embeds: [embed]});

                    const remainingCoins = await addCoins(
                        guildId,
                        target.id,
                        coinsToAsk * -1
                    )
                    await addCoins(
                        guildId,
                        member?.id,
                        coinsToAsk
                    )
                    
                    setTimeout(function() {
                        message.delete()
                    }, 8200);
                }
                if (reaction.emoji.name === 'no') {
                    let embed = new Discord.EmbedBuilder()
                    .setColor('#ff0000')
                    .setTitle(`${await language(guild, 'PAY_DENIED')}`)
                    .setDescription(`${await language(guild, 'ECONOMY_ASKFORMONEY')} ${coinsToAsk} ErlingCoins, <@${target.id}>`)
                    .setAuthor({ name: author.username, iconURL: member?.user.displayAvatarURL() })
                    .setTimestamp()
                    .setFooter({ text: `${await language(guild, 'ECONOMY_ASKFORMONEYDENIED')}` })
                    await reaction.message.edit({ embeds: [embed] });

                    setTimeout(function() {
                        message.delete()
                    }, 8200);
                }
            })
        })
    }
}
