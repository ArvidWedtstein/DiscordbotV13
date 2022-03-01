import { Command } from '../../Interfaces';
import { Settings } from '../../Functions/settings';
import * as gradient from 'gradient-string';
import language from '../../Functions/language';
import { addCoins, setCoins, getCoins, getColor } from '../../Functions/economy';
import Discord, { Client, Intents, Constants, Collection, MessageActionRow, MessageButton, MessageEmbed } from 'discord.js';
import temporaryMessage from '../../Functions/temporary-message';
export const command: Command = {
    name: "askformoney",
    description: "ask for money",
    details: "beg for money.",
    aliases: ["beg"],
    hidden: false,
    UserPermissions: ["SEND_MESSAGES"],
    ClientPermissions: ["SEND_MESSAGES", "ADD_REACTIONS"],
    ownerOnly: false,
    examples: ["askformoney @user <amount>"],
    
    run: async(client, message, args) => {
        const { guild, channel, author, member, mentions } = message;
        message.delete()
        
        const guildId = guild?.id
        const setting = await Settings(message, 'money');
        
        if (setting == false) return temporaryMessage(channel, `${language(guild, 'SETTING_OFF')} Economy ${language(guild, 'SETTING_OFF2')}`, 10);
            
        var d = new Date();

        const target = mentions.users.first();
        if (!target) return temporaryMessage(channel, `${language(guild, 'ECONOMY_VALIDUSER')}`, 10);
        if (target == message.author) {
            message.reply(`${language(guild, 'ECONOMY_INVALIDUSER')}`)
            return
        }

        const coinsToAsk: any = args[1];

        if (isNaN(coinsToAsk)) return temporaryMessage(channel, `${language(guild, 'ECONOMY_VALID')}`, 10);
        if (coinsToAsk < 0) return temporaryMessage(channel, `${language(guild, 'ECONOMY_VALID')}`, 10);
        const yes = '<:yes:807175712515162183>'
        const no = '<:no:807175696555573278>'
        let embed = new MessageEmbed()
            .setColor('AQUA')
            .setDescription(`${language(guild, 'ECONOMY_ASKFORMONEY')} ${coinsToAsk} ErlingCoins, <@${target.id}>`)
            .setAuthor({ name: message.author.username, iconURL: message.author.displayAvatarURL() })
            .setFooter({ text: `${language(guild, 'ECONOMY_ASKFORMONEYYESNO')}. ${d.toLocaleTimeString()}` })
        let messageEmbed = await message.channel.send({ embeds: [embed] }).then((msg) => {
            msg.react(yes);
            msg.react(no);

            client.on("messageReactionAdd", async (reaction, user) => {
                if (reaction.message.partial) await reaction.message.fetch();
                if (reaction.partial) await reaction.fetch();
                if (user.bot) return;
                if (!reaction.message.guild) return;
                if (reaction.message.channel.id != msg.channel.id) return;
                if (user != target) {
                    await reaction.users.remove(user.id);
                    return;
                }
                if (reaction.emoji.name === 'yes') {
                    const coinsOwned = await getCoins(guildId, target.id)
                    if (coinsOwned < coinsToAsk) return temporaryMessage(channel, `${language(guild, 'ECONOMY_PAYNOMONEY')} ${coinsToAsk} ErlingCoins!`,10);

                    let embed = new MessageEmbed()
                        .setColor('#10ff00')
                        .setTitle(`${language(guild, 'PAY_ACCEPT')}`)
                        .setDescription(`${language(guild, 'ECONOMY_ASKFORMONEY')} ${coinsToAsk} ErlingCoins, <@${target.id}>`)
                        .setAuthor({ name: author.username, iconURL: member?.user?.displayAvatarURL() })
                        .setTimestamp()
                        .setFooter({ text: `${language(guild, 'ECONOMY_ASKFORMONEYACCEPTED')}` })
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
                    let embed = new Discord.MessageEmbed()
                    .setColor('#ff0000')
                    .setTitle(`${language(guild, 'PAY_DENIED')}`)
                    .setDescription(`${language(guild, 'ECONOMY_ASKFORMONEY')} ${coinsToAsk} ErlingCoins, <@${target.id}>`)
                    .setAuthor({ name: author.username, iconURL: member?.user.displayAvatarURL() })
                    .setTimestamp()
                    .setFooter({ text: `${language(guild, 'ECONOMY_ASKFORMONEYDENIED')}` })
                    await reaction.message.edit({ embeds: [embed] });

                    setTimeout(function() {
                        message.delete()
                    }, 8200);
                }
                
            });
        })
    }
}
