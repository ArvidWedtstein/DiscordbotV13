import { Event, Command} from '../Interfaces';
import Client from '../Client';
import { Message, PermissionsString, PermissionFlagsBits, SlashCommandBuilder } from 'discord.js';
import temporaryMessage from '../Functions/temporary-message';
import language from '../Functions/language';

let cooldown = new Set();
export const event: Event = {
    name: "messageCreate",
    run: (client: Client, message: Message) => {
        const { author, content, guild, member, channel, system, guildId } = message;
        if (
            system || 
            author.bot ||
            author.system ||
            !guildId ||
            !guild ||
            message.interaction ||
            !content.startsWith(client.config.prefix)
        ) return

        // Custom stian command. Just for fun.
        if (content.startsWith("-stian")) return message.channel.send("<:gifflar:844852887389863947>");

        const validatePermissions = (permissions: PermissionsString[]) => {
            
            const validPermissions: PermissionsString[] = [
                'CreateInstantInvite',
                'KickMembers',
                'BanMembers',
                'Administrator',
                'ManageChannels',
                'ManageGuild',
                'AddReactions',
                'ViewAuditLog',
                'PrioritySpeaker',
                'Stream',
                'ViewChannel',
                'SendMessages',
                'SendTTSMessages',
                'ManageMessages',
                'EmbedLinks',
                'AttachFiles',
                'ReadMessageHistory',
                'MentionEveryone',
                'UseExternalEmojis',
                'ViewGuildInsights',
                'Connect',
                'Speak',
                'MuteMembers',
                'DeafenMembers',
                'MoveMembers',
                'UseVAD',
                'ChangeNickname',
                'ManageNicknames',
                'ManageRoles',
                'ManageWebhooks',
                'ManageEmojisAndStickers',
                'UseApplicationCommands',
                'RequestToSpeak',
                'ManageEvents',
                'ManageThreads',
                'CreatePublicThreads',
                'CreatePrivateThreads',
                'UseExternalStickers',
                'SendMessagesInThreads',
                'CreateInstantInvite',
                'ModerateMembers',
                'UseEmbeddedActivities'
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
                if (!guild.members.me?.permissions.toArray().includes(p)) return temporaryMessage(channel, `${language(guild, 'CLIENTPERMISSION_ERROR')}`);
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