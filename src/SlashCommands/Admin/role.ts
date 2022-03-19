import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, ContextMenuInteraction, MessageActionRow, MessageButton, MessageEmbed } from "discord.js";
import temporaryMessage from "../../Functions/temporary-message";
import { SlashCommand } from '../../Interfaces';
import messageCountSchema from "../../schemas/messageCountSchema";

const actions = ['give', 'remove', 'has']

export const slashCommand: SlashCommand = {
    name: "role",
    type: "CHAT_INPUT",
    permissions: ['KICK_MEMBERS', 'MUTE_MEMBERS'],
    ClientPermissions: ['MUTE_MEMBERS', 'KICK_MEMBERS'],
    testOnly: false,
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
    run: async (client, interaction, args) => {
        const action = args.shift()

        const { guild, channel } = interaction;

        if (!action || !actions.includes(action)) return temporaryMessage(channel, `Unknown action. Use one of the following: ${actions.join(', ')}`, 10)

        const memberId = args.shift()!.replace(/[<@!&>]/g, '')
        const roleId = args.shift()!.replace(/[<@!&>]/g, '')

        const member = guild!.members.cache.get(memberId)
        const role = guild!.roles.cache.get(roleId)

        if (!member) return temporaryMessage(channel, `404 - Member with ID ${memberId} not found 😳`)
        if (!roleId) return temporaryMessage(channel, `404 - Role with ID ${roleId} not found 😳`)

        if (action === 'has') {
            
        }
    }
}