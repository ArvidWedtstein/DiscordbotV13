import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, ContextMenuInteraction, MessageActionRow, MessageButton, MessageEmbed } from "discord.js";
import temporaryMessage from "../../Functions/temporary-message";
import { SlashCommand } from '../../Interfaces';

const actions = ['give', 'remove', 'has']

export const slashCommand: SlashCommand = {
    name: "role",
    description: "roles",
    type: "CHAT_INPUT",
    permissions: ['KICK_MEMBERS', 'MUTE_MEMBERS'],
    ClientPermissions: ['MUTE_MEMBERS', 'KICK_MEMBERS'],
    testOnly: true,
    options: [
        {
            name: "action",
            description: "The action to perform",
            type: "STRING",
            required: true,
            choices: actions.map((action) => ({
                name: action,
                value: action
            }))
        },  
        {
            name: "user",
            description: "The user to perform the action on",
            type: "USER",
            required: true
        },  
        {
            name: "role",
            description: "The role to perform the action on",
            type: "ROLE",
            required: true
        }  
    ],
    run: async (client, interaction) => {
        if (!interaction.isCommand()) return
        const { guild, channel, options } = interaction;

        const args: string[] = []

        options.data.forEach(({ value }) => {
            args.push(String(value))
        })
        const action = args.shift()

        

        if (!action || !actions.includes(action)) return temporaryMessage(channel, `Unknown action. Use one of the following: ${actions.join(', ')}`, 10)

        const memberId = args.shift()!.replace(/[<@!&>]/g, '')
        const roleId = args.shift()!.replace(/[<@!&>]/g, '')

        const member = guild!.members.cache.get(memberId)
        const role = guild!.roles.cache.get(roleId)

        if (!member) return temporaryMessage(channel, `404 - Member with ID ${memberId} not found 😳`)
        if (!roleId) return temporaryMessage(channel, `404 - Role with ID ${roleId} not found 😳`)

        if (action === 'has') {
            return await interaction.channel?.send({ content: `${member.roles.cache.has(roleId) ? 'User has role' : 'User does not have role'}` })
        }
        if (action === 'give') {
            member.roles.add(role!)
            interaction.editReply({ content: `Added role` })
            return
        }
        if (action === 'remove') {
            member.roles.remove(role!)
            interaction.editReply({ content: `Removed role` })
            return
        }
    }
}