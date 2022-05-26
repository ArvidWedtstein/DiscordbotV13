import { Event, Command} from '../Interfaces';
import Client from '../Client';
import { Message, PermissionString } from 'discord.js';
import temporaryMessage from '../Functions/temporary-message';
import language from '../Functions/language';

let cooldown = new Set();
export const event: Event = {
    name: "messageCreate",
    run: (client: Client, message: Message) => {
        const { author, content, guild, member, channel } = message;
        if (
            author.bot ||
            !guild ||
            !content.startsWith(client.config.prefix)
        ) return;

        // Custom stian command. Just for fun.
        if (content.startsWith("-stian")) return message.channel.send("<:gifflar:844852887389863947>");

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
        const args: any = content.slice(client.config.prefix.length).trim().split(" ");

        const cmd = args.shift().toLowerCase();

        if (!cmd) return

        // Get command in registry
        const command = client.registry.commands.get(cmd) || client.aliases.get(cmd);


        // Skip if command is disabled or doesn't exist
        if (!command) return
        if (command.disabled) return
        

        if (command?.UserPermissions) {
            // Validate Permissions
            validatePermissions(command.UserPermissions);
            command?.UserPermissions.forEach(async (p) => {
                if (!member?.permissions.toArray().includes(p)) return temporaryMessage(channel, `${language(guild, 'PERMISSION_ERROR')}`);
            })
        }
        if (command.ClientPermissions) {
            // Validate Permissions
            validatePermissions(command.ClientPermissions);
            command?.ClientPermissions.forEach(async (p) => {
                if (!guild?.me?.permissions.toArray().includes(p)) return temporaryMessage(channel, `${language(guild, 'CLIENTPERMISSION_ERROR')}`);
            })
        }

        if (command.cooldown) {

            if(cooldown.has(author.id)) {
                return temporaryMessage(channel, `This command has a cooldown of ${command.cooldown} seconds.`, 10);
            } else {
                cooldown.add(author.id);
                setTimeout(() => {
                    cooldown.delete(author.id);
                }, command.cooldown * 1000);
                // 12 hours
            }
            // https://stackoverflow.com/questions/65978548/how-to-make-max-uses-for-a-command-for-one-person-discord-js
        }
        
        if (command) (command as Command).run(client, message, args);
    }
}