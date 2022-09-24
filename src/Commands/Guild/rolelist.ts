import { Command } from '../../Interfaces';
import { Settings } from '../../Functions/settings';
import * as gradient from 'gradient-string';
import language from '../../Functions/language';
import Discord, { Client, Constants, Collection, ActionRowBuilder, ButtonBuilder, EmbedBuilder } from 'discord.js';
import moment from 'moment';
export const command: Command = {
    name: "roles",
    description: "list over guild roles",
    aliases: ["roleslist"],
    run: async(client, message, args) => {
        const { guild, channel } = message
        let rolemap: any = guild?.roles.cache
            .sort((a, b) => b.position - a.position)
            .map(r => r)
            .join(", \n");
            if (rolemap.length > 1024) rolemap = "Too many roles to display";
            if (!rolemap) rolemap = "No roles";
        const embed = new EmbedBuilder()
            .setTitle('Server Roles')
            .addFields("Role List" , rolemap)
        channel.send({embeds: [embed]});
    }
}
