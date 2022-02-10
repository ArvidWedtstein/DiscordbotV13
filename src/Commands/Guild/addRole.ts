import { Command } from '../../Interfaces';
import { Settings } from '../../Functions/settings';
import * as gradient from 'gradient-string';
import language from '../../Functions/language';
import { addCoins, setCoins, getCoins, getColor } from '../../Functions/economy';
import Discord, { Client, Intents, Constants, Collection, MessageActionRow, MessageButton, MessageEmbed, GuildMember, MessageSelectMenu } from 'discord.js';
import temporaryMessage from '../../Functions/temporary-message';
export const command: Command = {
    name: "addrole",
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
        const roles: any[] = []
        const guildRoles = await guild.roles.cache
            .sort((a, b) => b.position - a.position)
            .map(r => roles.push({label: r.name, description: r.id, value: r.id}))
            .join(",");
        

        const roleSelect = new MessageActionRow()
            .addComponents(
                new MessageSelectMenu() 
                    .setCustomId('rolesSelect')
                    .setPlaceholder('Select role')
                    .setMaxValues(1)
                    .setMinValues(1)
                    .addOptions(roles.splice(0, 25))
            )
        const embed = new MessageEmbed()
            .setAuthor({name: `Choose role for ${member?.user.username}`, iconURL: member?.user.displayAvatarURL()})
            .setFooter({ text: `Executed by ${message.author.tag}`, iconURL: message.author.displayAvatarURL() })
            .setTimestamp()
        message.channel.send({embeds: [embed], components: [roleSelect]});

        client.on("interactionCreate", async (button) => {
            if (!button.isSelectMenu()) return;
            
            if (button.customId != 'rolesSelect') return;
            await button.deferUpdate();
            
            if (button.member?.user.id != message.author.id) return;
            

            const chosenrole = guild.roles.cache.find((r) => r.id === button.values[0])
            if (!chosenrole) return button.reply(`${await language(guild, 'ROLE_NOTFOUND')}`);
            member?.roles.add(chosenrole, 'yEs')
            setTimeout(() => {
                roleSelect.components[0].setDisabled(true)
            }, 60 * 1000)
        });
    }
}