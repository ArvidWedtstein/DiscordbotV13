import { Command } from '../../Interfaces';
import { Settings } from '../../Functions/settings';
import * as gradient from 'gradient-string';
import language, { insert } from '../../Functions/language';
import { addCoins, setCoins, getCoins, getColor } from '../../Functions/economy';
import Discord, { Client, ClientEvents, Constants, Collection, EmbedBuilder } from 'discord.js';
import temporaryMessage from '../../Functions/temporary-message';
import settingsSchema from '../../schemas/settingsSchema';

export const command: Command = {
    name: "simulateevent",
    description: "simulate a event",
    aliases: ["simevent"],
    group: __dirname,
    UserPermissions: ["BAN_MEMBERS"],
    ClientPermissions: [
        'SendMessages',
        'AddReactions',
        'ATTACH_FILES',
        'EmbedLinks',
        'MANAGE_MESSAGES',
        'READ_MESSAGE_HISTORY',
        'ViewChannel',
        'BAN_MEMBERS',
        'MODERATE_MEMBERS'
    ],
    run: async(client, message, args) => {
        const { guild, author, mentions, channel } = message
        if (!guild) return;
        const guildId = guild.id
        const setting = await Settings(message, 'moderation');

        if (!setting) return temporaryMessage(channel, `${insert(guild, 'SETTING_OFF', "Moderation")}`, 10);
        
        function instanceOfClientEvents(obj: any): obj is ClientEvents {
            return obj.emit !== undefined;
        }

        let event: any = args[0];
        if (!event) return temporaryMessage(channel, `Please provide a event`, 10);
        if (instanceOfClientEvents(event)) return temporaryMessage(channel, `Please provide a valid event`, 10);


        client.emit(event)
    }
}