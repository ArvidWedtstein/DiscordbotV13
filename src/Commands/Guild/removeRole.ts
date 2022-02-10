import { Command } from '../../Interfaces';
import { Settings } from '../../Functions/settings';
import * as gradient from 'gradient-string';
import language from '../../Functions/language';
import { addCoins, setCoins, getCoins, getColor } from '../../Functions/economy';
import Discord, { Client, Intents, Constants, Collection, MessageActionRow, MessageButton, MessageEmbed, GuildMember, MessageSelectMenu } from 'discord.js';
import temporaryMessage from '../../Functions/temporary-message';
export const command: Command = {
    name: "removerole",
    description: "add a role to a user",
    aliases: ["adduserrole"],
    group: __dirname,
    hidden: false,
    UserPermissions: ["SEND_MESSAGES"],
    ClientPermissions: ["SEND_MESSAGES", "ADD_REACTIONS"],
    ownerOnly: false,
    examples: ["addrole @user @role"],
    
    run: async(client, message, args) => {
        const mention = message.mentions.users.first();
        const { guild } = message;
        if (!guild?.available) return;

        const member: GuildMember|undefined = guild?.members.cache.find(m => m.id === mention?.id)
        const guildRoles = guild.roles.cache;
        guildRoles.forEach((r) => {
            console.log(r.name)
        })
        

        const roleSelect = new MessageActionRow()
            .addComponents(
                new MessageSelectMenu() 
                    .setCustomId('roles')
                    .setMaxValues(1)
                    .setMinValues(1)
                    .addOptions(),
            )
        const embed = new MessageEmbed()
            .setAuthor({name: `Choose role for ${member?.user.username}`, iconURL: member?.user.displayAvatarURL()})
            .setTitle(`ds`)
            .setFooter({ text: `Eggseecuted by ${message.author.tag}`, iconURL: message.author.displayAvatarURL() })
            .setTimestamp()
        message.channel.send({embeds: [embed]});
    }
}