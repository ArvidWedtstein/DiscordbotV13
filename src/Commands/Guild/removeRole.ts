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
        const guildRoles = guild.roles.fetch();
        console.log(guildRoles)
        const roles = new MessageActionRow()
            .addComponents(
                new MessageSelectMenu() 
                    .setCustomId('roles')
                    .setMaxValues(1)
                    .setMinValues(1)
                    .addOptions([
						{
							label: 'Select me',
							description: 'This is a description',
							value: 'first_option',
						},
						{
							label: 'You can select me too',
							description: 'This is also a description',
							value: 'second_option',
						},
						{
							label: 'I am also an option',
							description: 'This is a description as well',
							value: 'third_option',
						},
					]),
            )
        const embed = new MessageEmbed()
            .setAuthor({name: `Choose role for ${member?.user.username}`, iconURL: member?.user.displayAvatarURL()})
            .setFooter({ text: `Executed by ${message.author.tag}`, iconURL: message.author.displayAvatarURL() })
            .setTimestamp()
        message.channel.send({embeds: [embed]});
    }
}