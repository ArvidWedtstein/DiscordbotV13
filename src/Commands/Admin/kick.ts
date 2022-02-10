import { Command } from '../../Interfaces';
import { Settings } from '../../Functions/settings';
import * as gradient from 'gradient-string';
import language from '../../Functions/language';
import { addCoins, setCoins, getCoins, getColor } from '../../Functions/economy';
import Discord, { Client, Intents, Constants, Collection, MessageActionRow, MessageButton, MessageEmbed } from 'discord.js';
import temporaryMessage from '../../Functions/temporary-message';
import settingsSchema from '../../schemas/settingsSchema';

export const command: Command = {
    name: "kick",
    UserPermissions: ["KICK_MEMBERS"],
    run: async(client, message, args) => {
        const { guild } = message
        if (!guild) return;
        const guildId = guild?.id
        const setting = await Settings(message, 'moderation');
        if (setting == false) {
            message.reply(`${await language(guild, 'SETTING_OFF')} Moderation ${await language(guild, 'SETTING_OFF2')}`);
            return
        } else if (setting == true) {
            const target = message.mentions.users.first();
            if (target) {
                message.delete()

                let reason = args.slice(1).join(' ');

                //If there is no reason
                if (!reason) {
                    reason = `${await language(guild, 'BAN_NOREASON')}`;
                }

                if (reason.length > 1024) {
                    reason = reason.slice(0, 1021) + '...';
                }

                //console.log(target.username + ' kick');
                
                

                const targetMember = guild.members.cache.get(target.id);
                let result = await settingsSchema.findOne({
                    guildId
                })
                if (result.serverlog) {
                    const logchannel = guild.channels.cache.find(channel => channel.id === result.serverlog);
                    if (!logchannel) return;
                    if (!logchannel.isText()) return
                    let logembed = new MessageEmbed()
                        .setColor(client.config.botEmbedHex)
                        .setAuthor(`${message.author.username}`, message.author.displayAvatarURL())
                        .setDescription(`kicked\n\n${language(guild, 'BAN_REASON')}: ${reason}`)
                        .setFooter(`${targetMember}`, targetMember?.displayAvatarURL())
                    logchannel.send({ embeds: [logembed] });
                }
                targetMember?.kick(reason);
            } else {
                message.channel.send(`${message.author}, ${language(guild, 'USER_NOTFOUND')}`)
            }   
        }
    }
}