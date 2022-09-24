import { Command } from '../../Interfaces';
import { Settings } from '../../Functions/settings';
import * as gradient from 'gradient-string';
import language from '../../Functions/language';
import { addCoins, setCoins, getCoins, getColor } from '../../Functions/economy';
import Discord, { Client, Constants, Collection, ActionRowBuilder, ButtonBuilder, EmbedBuilder, GuildMember, SelectMenuBuilder } from 'discord.js';
import temporaryMessage from '../../Functions/temporary-message';
export const command: Command = {
    name: "addrole",
    description: "add a role to a user",
    aliases: ["adduserrole"],
    hidden: false,
    UserPermissions: ["SendMessages"],
    ClientPermissions: ["SendMessages", "AddReactions"],
    ownerOnly: false,
    examples: ["addrole @user @role"],
    
    run: async(client, message, args) => {
        const { guild, mentions, channel, author } = message;
        const mention = mentions.users.first();
        if (!guild?.available) return;

        const member: GuildMember|undefined = guild?.members.cache.find(m => m.id === mention?.id)
        const roles: any[] = []
        const guildRoles = await guild.roles.cache
            .sort((a, b) => b.position - a.position)
            .map(r => roles.push({label: r.name, description: r.id, value: r.id}))
            .join(",");
        

        const roleSelect = new ActionRowBuilder<SelectMenuBuilder>()
            .addComponents(
                new SelectMenuBuilder() 
                    .setCustomId('rolesSelect')
                    .setPlaceholder('Select role')
                    .setMaxValues(1)
                    .setMinValues(1)
                    .addOptions(roles.splice(0, 25))
            )
        const embed = new EmbedBuilder()
            .setAuthor({name: `Choose role for ${member?.user.username}`, iconURL: member?.user.displayAvatarURL()})
            .setFooter({ text: `Executed by ${author.tag}`, iconURL: author.displayAvatarURL() })
            .setTimestamp()
        channel.send({ embeds: [embed], components: [roleSelect] });

        client.on("interactionCreate", async (button) => {
            if (!button.isSelectMenu()) return;
            
            if (button.customId != 'rolesSelect') return;
            // await button.deferUpdate();
            
            if (button.member?.user.id != author.id) return;
            

            const chosenrole = guild.roles.cache.find((r) => r.id === button.values[0])
            if (!chosenrole) await button.reply({ content: `${await language(guild, 'ROLE_NOTFOUND')}` });
            // member?.roles.add(chosenrole, 'yEs')
            // setTimeout(() => {
            //     roleSelect.components[0].setDisabled(true)
            // }, 60 * 1000)
        });
    }
}