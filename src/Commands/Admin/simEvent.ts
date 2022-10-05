import { Command } from '../../Interfaces';
import { Settings } from '../../Functions/settings';
import language, { insert } from '../../Functions/language';
import { addCoins, setCoins, getCoins, getColor } from '../../Functions/economy';
import Discord, { Client, ClientEvents, Constants, Collection, EmbedBuilder } from 'discord.js';
import temporaryMessage from '../../Functions/temporary-message';
import settingsSchema from '../../schemas/settingsSchema';
import { ErrorEmbed } from '../../Functions/ErrorEmbed';

export const command: Command = {
    name: "simulateevent",
    description: "simulate a event",
    aliases: ["simevent"],
    group: __dirname,
    UserPermissions: ["BanMembers"],
    ClientPermissions: [
        'SendMessages',
        'AddReactions',
        'AttachFiles',
        'EmbedLinks',
        'ManageMessages',
        'ReadMessageHistory',
        'ViewChannel',
        'BanMembers',
        'ModerateMembers'
    ],
    run: async(client, message, args) => {
        const { guild, author, mentions, channel } = message
        if (!guild) return;
        const guildId = guild.id
        const setting = await Settings(message, 'moderation');

        if (!setting) return ErrorEmbed(message, client, command, `${insert(guild, 'SETTING_OFF', "Moderation")}`);
        
        function instanceOfClientEvents(obj: any): obj is ClientEvents {
            return obj.emit !== undefined;
        }

        let event: any = args[0];
        if (!event) return ErrorEmbed(message, client, command, `Please provide a event`);
        if (instanceOfClientEvents(event)) return ErrorEmbed(message, client, command, `Please provide a valid event`);


        client.emit(event)
    }
}