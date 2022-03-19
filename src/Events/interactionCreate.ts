import { Event, Command, SlashCommand} from '../Interfaces';
import Client from '../Client';
import { Interaction, Message, CommandInteraction, GuildMember, PermissionString } from 'discord.js';
import temporaryMessage from '../Functions/temporary-message';
import language from '../Functions/language';
import { arg } from 'mathjs';


export const event: Event = {
    name: "interactionCreate",
    run: async (client: Client, interaction: Interaction) => {
        const member = interaction.member as GuildMember;
        const validatePermissions = (permissions: PermissionString[]) => {
            const validPermissions = [
                'CREATE_INSTANT_INVITE',
                'KICK_MEMBERS',
                'BAN_MEMBERS',
                'ADMINISTRATOR',
                'MANAGE_CHANNELS',
                'MANAGE_GUILD',
                'ADD_REACTIONS',
                'VIEW_AUDIT_LOG',
                'PRIORITY_SPEAKER',
                'STREAM',
                'VIEW_CHANNEL',
                'SEND_MESSAGES',
                'SEND_TTS_MESSAGES',
                'MANAGE_MESSAGES',
                'EMBED_LINKS',
                'ATTACH_FILES',
                'READ_MESSAGE_HISTORY',
                'MENTION_EVERYONE',
                'USE_EXTERNAL_EMOJIS',
                'VIEW_GUILD_INSIGHTS',
                'CONNECT',
                'SPEAK',
                'MUTE_MEMBERS',
                'DEAFEN_MEMBERS',
                'MOVE_MEMBERS',
                'USE_VAD',
                'CHANGE_NICKNAME',
                'MANAGE_NICKNAMES',
                'MANAGE_ROLES',
                'MANAGE_WEBHOOKS',
                'MANAGE_EMOJIS_AND_STICKERS',
                'USE_APPLICATION_COMMANDS',
                'REQUEST_TO_SPEAK',
                'MANAGE_EVENTS',
                'MANAGE_THREADS',
                'USE_PUBLIC_THREADS',
                'USE_PRIVATE_THREADS',
                'CREATE_PUBLIC_THREADS',
                'CREATE_PRIVATE_THREADS',
                'USE_EXTERNAL_STICKERS',
                'SEND_MESSAGES_IN_THREADS',
                'START_EMBEDDED_ACTIVITIES',
                'MODERATE_MEMBERS'
            ]
            
            for (const permission of permissions) {
                if (!validPermissions.includes(permission)) {
                    throw new Error(`Unknown permission node "${permission}"`)
                }
            }
        }
        if (
            interaction.user.bot ||
            !interaction.guild
        ) return;
        
        if (interaction.isCommand()) {
            interaction.deferReply({ ephemeral: true})
            const { commandName, options, guild, channel } = interaction;

            if (!commandName) return;
            const command = client.slashCommands.get(commandName);
            if (command?.permissions) {
                validatePermissions(command?.permissions);
                
                command?.permissions.forEach(async (perm) => {
                    if (!member.permissions.has(perm)) return temporaryMessage(channel, `${await language(guild, 'PERMISSION_ERROR')}`);
                })
            }

            if (command?.ClientPermissions && guild.me?.permissions) {
                validatePermissions(guild.me?.permissions.toArray());
                
                command?.ClientPermissions.forEach(async (perm) => {
                    if (!guild?.me?.permissions.has(perm)) return temporaryMessage(channel, `${await language(guild, 'CLIENTPERMISSION_ERROR')}`);
                })
            }

            const args: string[] = []

            options.data.forEach(({ value }) => {
                args.push(String(value))
            })
            if (command) (command as SlashCommand).run(client, interaction, args);
        };
        if (interaction.isButton()) return
        if (interaction.isContextMenu() || interaction.isUserContextMenu()) {
            await interaction.deferReply({ ephemeral: false });

            const { commandName, options, guild, channel } = interaction;

            const command = client.slashCommands.get(commandName);
            if (command?.permissions) {
                validatePermissions(command?.permissions);
                
                command?.permissions.forEach(async (perm) => {
                    if (!member.permissions.has(perm)) return temporaryMessage(channel, `${await language(guild, 'PERMISSION_ERROR')}`);
                })
            }

            if (command?.ClientPermissions && guild.me?.permissions) {
                validatePermissions(guild.me?.permissions.toArray());
                
                command?.ClientPermissions.forEach(async (perm) => {
                    if (!guild?.me?.permissions.has(perm)) return temporaryMessage(channel, `${await language(guild, 'CLIENTPERMISSION_ERROR')}`);;
                })
            }

            const args: string[] = []

            options.data.forEach(({ value }) => {
                args.push(String(value))
            })
            if (command) command.run(client, interaction, args);

        }
    }
}