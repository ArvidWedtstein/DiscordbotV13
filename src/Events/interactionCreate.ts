import { Event, Command, SlashCommand} from '../Interfaces';
import Client from '../Client';
import { Interaction, Message, CommandInteraction, GuildMember, PermissionsString } from 'discord.js';
import temporaryMessage from '../Functions/temporary-message';
import language from '../Functions/language';
import { arg } from 'mathjs';


export const event: Event = {
    name: "interactionCreate",
    run: async (client: Client, interaction: Interaction) => {
        const member = interaction.member as GuildMember;
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
        if (
            interaction.user.bot ||
            !interaction.guild
        ) return;
        
        if (interaction.isCommand()) {
            // await interaction.deferReply({ ephemeral: true })
            const { commandName, options, guild, channel } = interaction;

            if (!commandName) return;
            const command = client.slashCommands.get(commandName);
            if (command?.default_permission) {
                validatePermissions(command?.default_permission);
                
                command?.default_permission.forEach(async (perm) => {
                    if (!member.permissions.has(perm)) return temporaryMessage(channel, `${await language(guild, 'PERMISSION_ERROR')}`, 10);
                })
            }

            if (command?.ClientPermissions && guild.members.me?.permissions) {
                validatePermissions(guild?.members?.me?.permissions.toArray());
                
                command?.ClientPermissions.forEach(async (perm) => {
                    if (!guild!.members.me!.permissions.has(perm)) return temporaryMessage(channel, `${await language(guild, 'CLIENTPERMISSION_ERROR')}`);
                })
            }

            if (command) (command as SlashCommand).run(client, interaction);
        };
        if (interaction.isButton()) return
        if (interaction.isContextMenuCommand() || interaction.isUserContextMenuCommand()) {
            interaction.deferReply({ ephemeral: false });

            const { commandName, options, guild, channel } = interaction;

            const command = client.slashCommands.get(commandName);
            if (command?.default_permission) {
                validatePermissions(command?.default_permission);
                
                command?.default_permission.forEach(async (perm) => {
                    if (!member.permissions.has(perm)) return temporaryMessage(channel, `${await language(guild, 'PERMISSION_ERROR')}`);
                })
            }

            if (command?.ClientPermissions && guild.members.me?.permissions) {
                validatePermissions(guild.members.me?.permissions.toArray());
                
                command?.ClientPermissions.forEach(async (perm) => {
                    if (!guild?.members.me?.permissions.has(perm)) return temporaryMessage(channel, `${await language(guild, 'CLIENTPERMISSION_ERROR')}`);;
                })
            }

            if (command) command.run(client, interaction);

        }
        
        if (interaction.isModalSubmit()) {

            const favoriteColor = interaction.fields.getTextInputValue('favoriteColorInput');
            const hobbies = interaction.fields.getTextInputValue('hobbiesInput');
            console.log({ favoriteColor, hobbies });

            interaction.deferUpdate()

            return
        }
    }
}